import pool from "../src/shared/db";

type SeededRoom = {
  id: string;
  label: string;
};

type SeededMovie = {
  id: string;
  duration: number;
};

const showtimeData = [
  { roomIndex: 0, movieIndex: 0, startTime: '2026-09-05T14:00:00Z' },
  { roomIndex: 0, movieIndex: 1, startTime: '2026-09-05T19:00:00Z' },
  { roomIndex: 1, movieIndex: 2, startTime: '2026-09-05T15:30:00Z' },
  { roomIndex: 1, movieIndex: 0, startTime: '2026-09-05T20:30:00Z' },
  { roomIndex: 2, movieIndex: 3, startTime: '2026-09-05T16:00:00Z' },
  { roomIndex: 2, movieIndex: 4, startTime: '2026-09-05T21:00:00Z' },
];

export async function seedShowtimes(rooms: SeededRoom[], movies: SeededMovie[]) {
    const insertedShowtimes = []

    for (const entry of showtimeData) {
        const room = rooms[entry.roomIndex]
        const movie = movies[entry.movieIndex]
        const start_time = new Date(entry.startTime)
        const end_time = new Date(start_time.getTime() + (movie.duration * 60000))

        const result = await pool.query(`
            INSERT INTO showtimes (movie_id, room_id, start_time, end_time)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `, [movie.id, room.id, start_time, end_time])

        insertedShowtimes.push(result.rows[0])
    }

    return insertedShowtimes
}