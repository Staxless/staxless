#!/bin/bash
set -e

echo "🔍 Validating inputs..."

if [[ ! "$MODE" =~ ^(initial-deployment|rolling-update|deploy-new-service|destroy)$ ]]; then
  echo "❌ Invalid mode: $MODE"
  exit 1
fi

if [ "$MODE" = "destroy" ] && [ "$CONFIRM_DESTROY" != "DESTROY" ]; then
  echo "❌ Type 'DESTROY' to confirm"
  exit 1
fi

if [ "$MODE" = "deploy-new-service" ] && [ -z "$NEW_SERVICE_NAME" ]; then
  echo "❌ Service name required"
  exit 1
fi

echo "✅ Validation passed"
