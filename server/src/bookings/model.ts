import pool from "../shared/db.js";
import { SeatUnavailableError } from "../shared/errors.js";
import { randomUUID } from "crypto";

export async function createMultipleBookingsWithLock(
  showtime_id: string,
  seat_ids: string[],
  user_id: string,
  idempotency_key: string
) {
  const client = await pool.connect();
  const sortedSeatIds = [...seat_ids].sort();

  try {
    await client.query('BEGIN');

    // Lock every seat in the group, in a consistent sorted order, BEFORE
    // checking anything else. Same reasoning as the single-seat version:
    // locking first is what makes the idempotency check below actually
    // safe under concurrency, not just the availability check.
    for (const seatId of sortedSeatIds) {
      await client.query('SELECT * FROM seats WHERE id = $1 FOR UPDATE', [seatId]);
    }

    // Now that every seat is locked, check idempotency.
    const existingKey = await client.query(
      `SELECT response_body FROM idempotency_keys WHERE key = $1`,
      [idempotency_key]
    );

    if (existingKey.rows.length > 0) {
      await client.query('COMMIT');
      return existingKey.rows[0].response_body;
    }

    // Check availability for every seat in the group. If ANY is taken,
    // the whole group fails — no partial bookings.
    for (const seatId of sortedSeatIds) {
      const existingBooking = await client.query(
        'SELECT * FROM bookings WHERE showtime_id = $1 AND seat_id = $2',
        [showtime_id, seatId]
      );
      if (existingBooking.rows.length > 0) {
        throw new SeatUnavailableError();
      }
    }

    // All seats are free. Generate ONE group id, stamp it on every row.
    const bookingGroupId = randomUUID();
    const bookings = [];

    for (const seatId of sortedSeatIds) {
      const result = await client.query(
        'INSERT INTO bookings (showtime_id, seat_id, user_id, booking_group_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [showtime_id, seatId, user_id, bookingGroupId]
      );
      bookings.push(result.rows[0]);
    }

    // One idempotency row for the WHOLE group, storing the full array.
    await client.query(
      `INSERT INTO idempotency_keys (key, response_body) VALUES ($1, $2)`,
      [idempotency_key, JSON.stringify(bookings)]
    );

    await client.query('COMMIT');
    return bookings;    

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}