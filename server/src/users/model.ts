import pool from "../shared/db.js";

export async function getAllUsers() {
  const result = await pool.query('SELECT id, email FROM users ORDER BY email');
  return result.rows;
}