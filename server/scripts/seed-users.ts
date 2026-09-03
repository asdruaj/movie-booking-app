import pool from "../src/shared/db"

const emails = [
  'alice@example.com',
  'bob@example.com',
  'carol@example.com',
];

export async function SeedUsers() {
    const insertedUsers = []
  for (const email of emails) {

    const result = await pool.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING id",
        [email]
    )
    insertedUsers.push(result.rows[0])
  }

  return insertedUsers
}
