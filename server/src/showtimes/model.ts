import pool from "../shared/db.js";

export async function getAllShowtimes(movieId?: string) {
    const result = await pool.query(`
        SELECT
            showtimes.id,
            showtimes.start_time,
            showtimes.end_time,
            movies.name AS movie_name,
            movies.id AS movie_id,
            rooms.label AS room_label
        FROM showtimes
        INNER JOIN movies ON showtimes.movie_id = movies.id
        INNER JOIN rooms ON showtimes.room_id = rooms.id
        WHERE ($1::uuid IS NULL OR showtimes.movie_id = $1)
        `,[movieId || null])

    return result.rows
}