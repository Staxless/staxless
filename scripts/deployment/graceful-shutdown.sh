#!/bin/bash
set -e

echo "🛑 Starting graceful shutdown..."

if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$MANAGER_IP "echo ready" 2>/dev/null; then
  echo "⚠️  Manager not reachable - skipping"
  exit 0
fi

SERVICES=$(ssh root@$MANAGER_IP "docker service ls --format '{{.Name}}' | grep '^staxless_'" || echo "")

if [ -z "$SERVICES" ]; then
  echo "ℹ️  No services found"
  exit 0
fi

echo "Step 1: Scale down services"
for service in $SERVICES; do
  echo "Scaling down: $service"
  ssh root@$MANAGER_IP "docker service scale $service=0"
  sleep 2
done

echo "Waiting 30 seconds..."
sleep 30

echo "Step 2: Remove services"
for service in $SERVICES; do
  ssh root@$MANAGER_IP "docker service rm $service"
done

sleep 10

echo "Step 3: Remove stack"
ssh root@$MANAGER_IP "docker stack rm staxless" 2>/dev/null || true

sleep 20

echo "Step 4: Leave swarm"
ssh root@$MANAGER_IP "docker swarm leave --force" 2>/dev/null || true

echo "✅ Graceful shutdown complete"
