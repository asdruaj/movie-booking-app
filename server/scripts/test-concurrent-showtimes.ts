import 'dotenv/config'

async function testConcurrentShowtimes() {

  const requests = Array.from({ length: 5 }, () =>
    fetch(`${process.env.API_URL}/showtimes`, {
      method: 'GET',
    })
  );

  const responses = await Promise.all(requests);
  
  for (const res of responses) {
    console.log(res.status);
  }
}

testConcurrentShowtimes();