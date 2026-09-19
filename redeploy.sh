#!/bin/bash
set -e

NEW_IP=$1

if [ -z "$NEW_IP" ]; then
  echo "Usage: ./redeploy.sh <new-droplet-ip>"
  exit 1
fi

echo "Provisioning $NEW_IP..."
ssh -o StrictHostKeyChecking=no root@$NEW_IP 'bash -s' < provision.sh

echo "Updating GitHub secret..."
gh secret set DEPLOY_HOST --body "$NEW_IP" --repo asdruaj/movie-booking-app

echo "Done. New droplet is live at http://$NEW_IP"