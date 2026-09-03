async function testConcurrentBooking() {
  const showtimeId = '1305b370-770e-41b6-abfa-85c1cac6ccfd';
  const seatId = 'f72d7845-7445-4b10-8944-5c66c981fdf7';
  const userId = 'f61382d6-c40d-4537-a010-9b91ba74a5d1';

  const requests = Array.from({ length: 5 }, () =>
    fetch('http://localhost:5001/api/v1/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showtime_id: showtimeId, seat_id: seatId, user_id: userId }),
    })
  );

  const responses = await Promise.all(requests);
  
  for (const res of responses) {
    console.log(res.status);
  }
}

testConcurrentBooking();