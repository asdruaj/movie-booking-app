import pool from "../shared/db.js";

export async function getAllMovies(limit: number, offset: number) {
  const result = await pool.query(
    `SELECT movies.*,
       EXISTS(SELECT 1 FROM showtimes WHERE showtimes.movie_id = movies.id) AS has_showtimes
     FROM movies
     ORDER BY has_showtimes DESC, name
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}