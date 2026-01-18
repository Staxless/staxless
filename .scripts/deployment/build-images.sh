#!/bin/bash
set -e

SERVICES="${1:-all}"

echo "🔨 Building images for: $SERVICES..."

doctl registry login

if [ "$SERVICES" = "all" ]; then
  docker buildx bake -f config/docker-bake.hcl --push
else
  IFS=',' read -ra SERVICE_LIST <<< "$SERVICES"
  for service in "${SERVICE_LIST[@]}"; do
    echo "Building $service..."
    docker buildx bake -f config/docker-bake.hcl --push "$service"
  done
fi

echo "✅ Images built and pushed"
