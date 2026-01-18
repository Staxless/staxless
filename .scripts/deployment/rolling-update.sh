#!/bin/bash
set -e

SERVICES="${1:-all}"

echo "🔄 Running rolling update for: $SERVICES..."

if [ "$SERVICES" = "all" ]; then
  SERVICE_LIST=$(ssh root@$MANAGER_IP "docker service ls --format '{{.Name}}' | grep '^staxless_'")
else
  IFS=',' read -ra SERVICE_NAMES <<< "$SERVICES"
  SERVICE_LIST=()
  for service in "${SERVICE_NAMES[@]}"; do
    SERVICE_LIST+=("staxless_$service")
  done
fi

for service in "${SERVICE_LIST[@]}"; do
  echo "Updating: $service"
  
  CURRENT_IMAGE=$(ssh root@$MANAGER_IP "docker service inspect $service --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'")
  IMAGE_BASE=$(echo "$CURRENT_IMAGE" | cut -d: -f1)
  NEW_IMAGE="${IMAGE_BASE}:latest"
  
  ssh root@$MANAGER_IP "docker service update --image $NEW_IMAGE --update-parallelism 1 --update-delay 10s --update-failure-action rollback --update-monitor 30s $service"
  
  sleep 5
  
  UPDATE_STATUS=$(ssh root@$MANAGER_IP "docker service inspect $service --format '{{.UpdateStatus.State}}'")
  
  if [ "$UPDATE_STATUS" = "completed" ]; then
    echo "✅ $service updated"
  elif [ "$UPDATE_STATUS" = "rollback_completed" ]; then
    echo "❌ $service failed - rolled back"
    exit 1
  fi
done

echo "✅ All services updated"
