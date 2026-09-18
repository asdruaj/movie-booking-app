import { readFileSync} from 'fs'
import 'dotenv/config'

async function testConcurrentBooking() {
  const seedData = JSON.parse(readFileSync('scripts/seed-output.json', 'utf-8'))

  const requests = Array.from({ length: 5 }, () =>
    fetch(`${process.env.API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showtime_id: seedData.showtimeId, seat_ids: [seedData.seatId], user_id: seedData.userId, idempotency_key: crypto.randomUUID() }),
    })
  );

  const responses = await Promise.all(requests);
  const statusCodes = responses.map((res) => res.status);

  console.log('Status codes:', statusCodes);

  const successCount = statusCodes.filter((code) => code === 201).length;

  if (successCount !== 1) {
    console.error(`FAIL: expected exactly 1 success, got ${successCount}`);
    process.exit(1);
  }

  console.log('PASS: exactly 1 booking succeeded, race condition correctly prevented');
}

testConcurrentBooking();