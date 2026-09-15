async function testConcurrentShowtimes() {

  const requests = Array.from({ length: 5 }, () =>
    fetch('http://localhost:5001/api/v1/showtimes', {
      method: 'GET',
    })
  );

  const responses = await Promise.all(requests);
  
  for (const res of responses) {
    console.log(res.status);
  }
}

testConcurrentShowtimes();