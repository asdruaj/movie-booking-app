import { readFileSync } from 'fs';
import 'dotenv/config';

const API_URL = process.env.API_URL || 'http://localhost:5001/api/v1';
const seedData = JSON.parse(readFileSync('scripts/seed-output.json', 'utf-8'));
const { userId, showtimeId } = seedData;

// Fetches fresh available seats at runtime rather than relying on stale
// seed IDs — since tests consume seats as they run, static IDs would break
// on a second run without reseeding.
async function getAvailableSeats(count: number): Promise<string[]> {
  const res = await fetch(`${API_URL}/seats?showtime_id=${showtimeId}`);
  const seats = await res.json();
  const available = seats.filter((s: any) => s.booking_id === null);
  if (available.length < count) {
    throw new Error(`Not enough available seats: need ${count}, found ${available.length}. Reseed the database.`);
  }
  return available.slice(0, count).map((s: any) => s.id);
}

async function bookGroup(seatIds: string[], idempotencyKey: string) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      showtime_id: showtimeId,
      seat_ids: seatIds,
      user_id: userId,
      idempotency_key: idempotencyKey,
    }),
  });
  return { status: res.status, body: await res.json() };
}

async function test1HappyPath() {
  console.log('\n--- Test 1: Happy path (book a group of 2 seats) ---');
  const seatIds = await getAvailableSeats(2);
  const { status, body } = await bookGroup(seatIds, crypto.randomUUID());

  if (status !== 201) {
    console.error('FAIL: expected 201, got', status, body);
    process.exit(1);
  }
  if (!Array.isArray(body) || body.length !== 2) {
    console.error('FAIL: expected an array of 2 bookings, got', body);
    process.exit(1);
  }
  const groupIds = new Set(body.map((b: any) => b.booking_group_id));
  if (groupIds.size !== 1) {
    console.error('FAIL: expected all bookings to share one booking_group_id, got', groupIds);
    process.exit(1);
  }
  console.log('PASS: 2 seats booked together under one booking_group_id');
}

async function test2AtomicityUnderConflict() {
  console.log('\n--- Test 2: atomicity when one seat in the group is already taken ---');
  const [takenSeat, freshSeat1, freshSeat2] = await getAvailableSeats(3);

  const setup = await bookGroup([takenSeat], crypto.randomUUID());
  if (setup.status !== 201) {
    console.error('FAIL: setup booking failed unexpectedly', setup);
    process.exit(1);
  }

  // A NEW group containing the already-taken seat plus two fresh ones —
  // the whole group should fail, not just the one bad seat.
  const attempt = await bookGroup([takenSeat, freshSeat1, freshSeat2], crypto.randomUUID());
  if (attempt.status !== 409) {
    console.error('FAIL: expected 409 for the whole group, got', attempt.status, attempt.body);
    process.exit(1);
  }

  // Prove the rollback actually worked — the fresh seats must still be free.
  const res = await fetch(`${API_URL}/seats?showtime_id=${showtimeId}`);
  const seats = await res.json();
  const stillFree = seats.filter((s: any) => (s.id === freshSeat1 || s.id === freshSeat2) && s.booking_id === null);
  if (stillFree.length !== 2) {
    console.error('FAIL: fresh seats were partially booked despite group failure — rollback is broken');
    process.exit(1);
  }
  console.log('PASS: whole group correctly rejected, fresh seats remain untouched');
}

async function test3TrueConcurrency() {
  console.log('\n--- Test 3: two overlapping groups fired simultaneously ---');
  const [s1, s2, s3] = await getAvailableSeats(3);
  const groupA = [s1, s2];
  const groupB = [s2, s3]; // shares s2 with group A

  const [resultA, resultB] = await Promise.all([
    bookGroup(groupA, crypto.randomUUID()),
    bookGroup(groupB, crypto.randomUUID()),
  ]);

  const successes = [resultA, resultB].filter((r) => r.status === 201);
  const failures = [resultA, resultB].filter((r) => r.status === 409);

  if (successes.length !== 1 || failures.length !== 1) {
    console.error('FAIL: expected exactly 1 success and 1 failure, got', {
      statusA: resultA.status,
      statusB: resultB.status,
    });
    process.exit(1);
  }
  console.log('PASS: exactly one overlapping group succeeded, the other was cleanly rejected');
}

async function main() {
  await test1HappyPath();
  await test2AtomicityUnderConflict();
  await test3TrueConcurrency();
  console.log('\nAll multi-seat booking tests passed.');
}

main();