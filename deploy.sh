cloudflared tunnel --url http://localhost:5175 > client-tunnel.log 2>&1 &

cloudflared tunnel --url http://localhost:8081 > server-tunnel.log 2>&1 &

for i in {1..15}; do
  CLIENT_URL=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' client-tunnel.log)
  if [ -n "$CLIENT_URL" ]; then
    break
  fi
  sleep 1
done

for i in {1..15}; do
  API_URL=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' server-tunnel.log)
  if [ -n "$API_URL" ]; then
    break
  fi
  sleep 1
done

VITE_API_URL="${API_URL}/api/v1" CLIENT_URL=${CLIENT_URL} docker compose -p ticketrush-prod -f docker-compose.prod.yml up -d --build