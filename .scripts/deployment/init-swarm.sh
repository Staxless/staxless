#!/bin/bash
set -e

echo "🐝 Initializing Docker Swarm..."

# Wait for manager
MAX_ATTEMPTS=60
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$MANAGER_IP "echo ready" 2>/dev/null; then
    echo "✅ Manager ready"
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  sleep 10
done

# Initialize swarm
ssh root@$MANAGER_IP << 'SSHEOF'
PRIVATE_IP=$(ip addr show eth1 | grep "inet " | awk '{print $2}' | cut -d/ -f1)
docker swarm init --advertise-addr $PRIVATE_IP
docker swarm join-token worker -q > /tmp/worker-token
SSHEOF

# Get token
WORKER_TOKEN=$(ssh root@$MANAGER_IP cat /tmp/worker-token)
echo "WORKER_TOKEN=$WORKER_TOKEN" >> $GITHUB_ENV

# Get manager private IP
MANAGER_PRIVATE_IP=$(ssh root@$MANAGER_IP "ip addr show eth1 | grep 'inet ' | awk '{print \$2}' | cut -d/ -f1")

# Join workers
IFS=',' read -ra WORKERS <<< "$WORKER_IPS"
for WORKER_IP in "${WORKERS[@]}"; do
  echo "Joining worker: $WORKER_IP"
  MAX_ATTEMPTS=60
  ATTEMPT=0
  while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$WORKER_IP "echo ready" 2>/dev/null; then
      break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 10
  done
  
  ssh root@$WORKER_IP "docker swarm join --token $WORKER_TOKEN $MANAGER_PRIVATE_IP:2377"
  echo "✅ $WORKER_IP joined"
done

echo "✅ Swarm initialized"
ssh root@$MANAGER_IP "docker node ls"
