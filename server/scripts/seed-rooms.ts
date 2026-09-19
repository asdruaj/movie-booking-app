import pool from "../src/shared/db"

const labels = ['Room 1', 'Room 2', 'Room 3']

export async function seedRooms() {
    const insertedRooms = []
  for (const label of labels) {
    const result = await pool.query(
        "INSERT INTO rooms (label) VALUES ($1) RETURNING id",
        [label]
    )
    insertedRooms.push(result.rows[0])
  }

  return insertedRooms
}
