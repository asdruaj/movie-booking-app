import pool from "../src/shared/db.js";

type SeededRoom = {
  id: string;
  label: string;
};

const roomLayouts = [
  { roomIndex: 0, rows: [8, 10, 10, 12] },        // Room 1: 4 rows
  { roomIndex: 1, rows: [6, 8, 8, 10, 10] },       // Room 2: 5 rows
  { roomIndex: 2, rows: [10, 10, 12, 12, 14, 14] }, // Room 3: 6 rows
];

export async function seedSeats(rooms: SeededRoom[]) {
  const insertedSeats = [];

  for (const layout of roomLayouts) {
    const room = rooms[layout.roomIndex];

    for (let rowIndex = 0; rowIndex < layout.rows.length; rowIndex++) {
      const rowLabel = String.fromCharCode(65 + rowIndex); // 0->A, 1->B, ...
      const seatsInRow = layout.rows[rowIndex];

      for (let seatNumber = 1; seatNumber <= seatsInRow; seatNumber++) {
        const result = await pool.query(
          `INSERT INTO seats (room_id, row_label, seat_number) 
           VALUES ($1, $2, $3) RETURNING id`,
          [room.id, rowLabel, seatNumber]
        );
        insertedSeats.push(result.rows[0]);
      }
    }
  }

  return insertedSeats;
}