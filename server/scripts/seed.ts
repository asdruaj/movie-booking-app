import 'dotenv/config';
import { seedRooms } from './seed-rooms.js';
import { seedMovies } from './seed-movies.js';
import pool from '../src/shared/db.js';
import { seedShowtimes } from './seed-showtimes.js';
import { seedSeats } from './seed-seats.js';
import { seedUsers } from './seed-users.js';
import {writeFileSync} from 'fs'

async function seed() {
  await pool.query('TRUNCATE rooms, movies, showtimes, seats, users, bookings RESTART IDENTITY CASCADE');
  const rooms = await seedRooms();
  const movies = await seedMovies();
  const showtimes = await seedShowtimes(rooms, movies)
  const seats = await seedSeats(rooms)
  const users = await seedUsers()
  console.log('Seeded:', { rooms, movies, showtimes, seats, users });

  const seedOutput = {
    userId: users[0].id,
   // NOTE: showtimes[0] and seats[0] currently belong to the same room (Room 1)
  // only because of how showtimeData/roomLayouts happen to be ordered right now.
  // Nothing enforces this pairing — if either seed array's order changes,
  // this could silently pair a showtime with a seat from a different room.

    showtimeId: showtimes[0].id,
    seatId: seats[0].id
  }

  writeFileSync('scripts/seed-output.json', JSON.stringify(seedOutput))
}

seed();