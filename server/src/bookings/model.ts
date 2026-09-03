import pool from "../shared/db.js";

export async function findExistingBooking(showtime_id:string, seat_id:string) {
    const booking = await pool.query(`
        SELECT * from bookings WHERE showtime_id=$1 AND seat_id=$2
        `, [showtime_id, seat_id])

    return booking.rows[0] || null
}

export async function createBooking(showtime_id:string, seat_id:string, user_id:string) {
    const booking = await pool.query(`
        INSERT INTO bookings (showtime_id, seat_id, user_id, status) VALUES ($1, $2, $3, 'confirmed')
        `, [showtime_id, seat_id,user_id])

    return booking.rows
}