import 'dotenv/config';
import { seedRooms } from './seed-rooms.js';
import { seedMovies } from './seed-movies.js';
import pool from '../src/shared/db.js';
import { seedShowtimes } from './seed-showtimes.js';
import { seedSeats } from './seed-seats.js';
import { SeedUsers } from './seed-users.js';

async function seed() {
  await pool.query('TRUNCATE rooms, movies, showtimes, seats, users, bookings RESTART IDENTITY CASCADE');
  const rooms = await seedRooms();
  const movies = await seedMovies();
  const showtimes = await seedShowtimes(rooms, movies)
  const seats = await seedSeats(rooms)
  const users = await SeedUsers()
  console.log('Seeded:', { rooms, movies, showtimes, seats, users });
}

seed();