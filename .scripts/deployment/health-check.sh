#!/bin/bash
set -e

echo "🏥 Running health checks..."

sleep 30

ssh root@$MANAGER_IP << 'SSHEOF'
SERVICES=$(docker service ls --format '{{.Name}}')

for SERVICE in $SERVICES; do
  REPLICAS=$(docker service ls --filter "name=$SERVICE" --format '{{.Replicas}}')
  RUNNING=$(echo $REPLICAS | cut -d'/' -f1)
  DESIRED=$(echo $REPLICAS | cut -d'/' -f2)
  
  if [ "$RUNNING" != "$DESIRED" ]; then
    echo "❌ $SERVICE: $RUNNING/$DESIRED (not ready)"
    exit 1
  else
    echo "✅ $SERVICE: $RUNNING/$DESIRED"
  fi
done
SSHEOF

echo "✅ All services healthy"
