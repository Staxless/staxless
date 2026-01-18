#!/bin/bash
set -e

SERVICE_NAME="$1"

echo "🚀 Deploying new service: $SERVICE_NAME..."

scp -o StrictHostKeyChecking=no config/docker-compose.prod.yml root@$MANAGER_IP:/root/stack.yml

ssh root@$MANAGER_IP "docker stack deploy -c /root/stack.yml --with-registry-auth staxless"

echo "✅ Service deployed"
sleep 10

ssh root@$MANAGER_IP "docker service ls | grep $SERVICE_NAME"
