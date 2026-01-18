#!/bin/bash
set -e

echo "🔐 Creating service secrets..."

REQUIRED_SECRETS=$(grep "^secrets=" $GITHUB_OUTPUT | cut -d= -f2)

if [ -z "$REQUIRED_SECRETS" ]; then
  echo "ℹ️  No secrets required"
  exit 0
fi

IFS=',' read -ra SECRETS <<< "$REQUIRED_SECRETS"

for secret in "${SECRETS[@]}"; do
  secret_upper=$(echo "$secret" | tr '[:lower:]' '[:upper:]')
  secret_value="${!secret_upper}"
  
  if [ -n "$secret_value" ]; then
    echo "Creating: $secret"
    ssh root@$MANAGER_IP "echo '$secret_value' | docker secret create $secret - 2>/dev/null || echo '$secret exists'"
  else
    echo "⚠️  $secret_upper not set"
  fi
done

echo "✅ Secrets created"
