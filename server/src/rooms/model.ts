import pool from '../shared/db.js';

export async function getAllRooms() {
  const result = await pool.query('SELECT * FROM rooms');
  return result.rows;
}