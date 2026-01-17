#!/bin/bash
set -e

echo "🚀 Deploying stack..."

scp -o StrictHostKeyChecking=no config/docker-compose.prod.yml root@$MANAGER_IP:/root/stack.yml

ssh root@$MANAGER_IP << 'SSHEOF'
docker stack deploy -c /root/stack.yml --with-registry-auth staxless
SSHEOF

echo "✅ Stack deployed"
sleep 10
ssh root@$MANAGER_IP "docker service ls"
