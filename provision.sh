#!/bin/bash
set -e

echo "Adding deploy SSH key..."
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINgBMtWfI9sCtHCPuR7OGoICOlhY8CDVj98RMOkw+LTB github-actions-deploy" >> ~/.ssh/authorized_keys

echo "Cloning repo..."
mkdir -p /opt
cd /opt
git clone https://github.com/asdruaj/movie-booking-app.git ticketrush
cd ticketrush
git checkout main

echo "Building migration tooling image..."
docker build --target builder -t ticketrush-migrator ./server

echo "Starting the app stack..."
PUBLIC_IP=$(curl -s ifconfig.me)
echo "Detected public IP: $PUBLIC_IP"
VITE_API_URL=http://$PUBLIC_IP:8081/api/v1 CLIENT_URL=http://$PUBLIC_IP docker compose -p ticketrush-prod -f docker-compose.prod.yml up -d --build

echo "Running migrations..."
cd server
docker run --rm --network ticketrush-prod_default \
  -e DATABASE_URL=postgres://postgres:devpassword@postgres:5432/ticketrush_dev \
  -v $(pwd)/migrations:/app/migrations \
  ticketrush-migrator pnpm migrate up

echo "Seeding database..."
docker run --rm --network ticketrush-prod_default \
  -e DATABASE_URL=postgres://postgres:devpassword@postgres:5432/ticketrush_dev \
  -v $(pwd)/scripts:/app/scripts \
  ticketrush-migrator pnpm seed

echo "Provisioning complete."