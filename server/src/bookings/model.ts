import pool from "../shared/db.js";
import { SeatUnavailableError } from "../shared/errors.js";

export async function createBookingWithLock(showtime_id:string, seat_id:string, user_id:string, idempotency_key: string){
    const client = await pool.connect()

 try {
    await client.query('BEGIN')

    await client.query(
        'SELECT * FROM seats WHERE id = $1 FOR UPDATE',
        [seat_id]
    )

    const existingKey = await client.query(
        `SELECT response_body FROM idempotency_keys WHERE key = $1`,
        [idempotency_key]
    )

    if (existingKey.rows.length > 0){
        await client.query('COMMIT')
        return existingKey.rows[0].response_body
    }


    const existingBooking = await client.query(
        'SELECT * FROM bookings WHERE showtime_id = $1 AND seat_id = $2',
    [showtime_id, seat_id]
    )

    if (existingBooking.rows.length > 0){
        throw new SeatUnavailableError();
    }

     const bookingResult = await client.query(
        'INSERT INTO bookings (showtime_id, seat_id, user_id) VALUES ($1,$2,$3) RETURNING *',
        [showtime_id, seat_id, user_id]
     )

     await client.query(
        `INSERT INTO idempotency_keys (key, response_body) VALUES ($1, $2)`,
        [idempotency_key, bookingResult.rows[0]]
     )

     await client.query('COMMIT')
     return bookingResult.rows[0]
 } catch (error) {
    await client.query('ROLLBACK')
    throw error
 } finally{
    client.release()
 }
}