import pool from "../shared/db.js";

export async function getAllMovies (limit: number, offset: number) {
    const result = await pool.query(
        "SELECT * from movies ORDER BY name LIMIT ($1) OFFSET ($2) ",
        [limit, offset]
    )
    return result.rows
}