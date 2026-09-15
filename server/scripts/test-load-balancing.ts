async function testLoadBalancing() {
  const requests = Array.from({ length: 200 }, () =>
    fetch('http://localhost:8080/api/v1/health').then(res => res.json())
  );

  const responses = await Promise.all(requests);

  const counts: Record<string, number> = {};
  for (const res of responses) {
    counts[res.instance] = (counts[res.instance] || 0) + 1;
  }

  console.log(counts);
}

testLoadBalancing();