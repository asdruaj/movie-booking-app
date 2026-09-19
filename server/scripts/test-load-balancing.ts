import 'dotenv/config'
async function testLoadBalancing() {
  const requests = Array.from({ length: 50 }, () =>
    fetch(`${process.env.API_URL}/health`).then(res => res.json())
  );

  const responses = await Promise.all(requests);

  const counts: Record<string, number> = {};
  for (const res of responses) {
    counts[res.instance] = (counts[res.instance] || 0) + 1;
  }

  console.log(counts);
}

testLoadBalancing();