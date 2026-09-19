import pool from "../shared/db.js";

export async function getAllSeats(showtimeId: string) {
    const result = await pool.query(`
    SELECT
        seats.id,
        seats.row_label,
        seats.seat_number,
        bookings.id AS booking_id
    FROM seats
    LEFT JOIN bookings 
    ON bookings.seat_id = seats.id
    AND bookings.showtime_id = $1
    WHERE seats.room_id = (SELECT room_id from showtimes WHERE id = $1)
    `,[showtimeId])

    return result.rows
}