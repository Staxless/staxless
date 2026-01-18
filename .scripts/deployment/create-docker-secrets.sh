#!/bin/bash
set -e

echo "🔐 Creating Docker secrets..."

ssh root@$MANAGER_IP << 'SSHEOF'

# Database
if [ -n "$DATABASE_URL" ]; then
  echo "$DATABASE_URL" | docker secret create DATABASE_URL - 2>/dev/null || echo "ℹ️  DATABASE_URL exists"
fi

if [ -n "$DATABASE_NAME" ]; then
  echo "$DATABASE_NAME" | docker secret create DATABASE_NAME - 2>/dev/null || echo "ℹ️  DATABASE_NAME exists"
fi

# OAuth - Flexible detection
echo "🔍 Detecting OAuth providers..."
for var in $(env | grep '_CLIENT_ID=' | cut -d= -f1); do
  PROVIDER=${var%_CLIENT_ID}
  CLIENT_ID_VALUE="${!var}"
  CLIENT_SECRET_VAR="${PROVIDER}_CLIENT_SECRET"
  CLIENT_SECRET_VALUE="${!CLIENT_SECRET_VAR}"
  
  if [ -n "$CLIENT_ID_VALUE" ] && [ -n "$CLIENT_SECRET_VALUE" ]; then
    echo "✅ Found OAuth provider: $PROVIDER"
    echo "$CLIENT_ID_VALUE" | docker secret create "${PROVIDER}_CLIENT_ID" - 2>/dev/null || echo "ℹ️  ${PROVIDER}_CLIENT_ID exists"
    echo "$CLIENT_SECRET_VALUE" | docker secret create "${PROVIDER}_CLIENT_SECRET" - 2>/dev/null || echo "ℹ️  ${PROVIDER}_CLIENT_SECRET exists"
  fi
done

# Google redirect URI (special case)
if [ -n "$GOOGLE_REDIRECT_URI" ]; then
  echo "$GOOGLE_REDIRECT_URI" | docker secret create GOOGLE_REDIRECT_URI - 2>/dev/null || echo "ℹ️  GOOGLE_REDIRECT_URI exists"
fi

# Stripe
if [ -n "$STRIPE_PRIVATE_KEY" ]; then
  echo "$STRIPE_PRIVATE_KEY" | docker secret create STRIPE_PRIVATE_KEY - 2>/dev/null || echo "ℹ️  STRIPE_PRIVATE_KEY exists"
fi

if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
  echo "$STRIPE_WEBHOOK_SECRET" | docker secret create STRIPE_WEBHOOK_SECRET - 2>/dev/null || echo "ℹ️  STRIPE_WEBHOOK_SECRET exists"
fi

# Mailgun
if [ -n "$MAILGUN_API_KEY" ]; then
  echo "$MAILGUN_API_KEY" | docker secret create MAILGUN_API_KEY - 2>/dev/null || echo "ℹ️  MAILGUN_API_KEY exists"
fi

# Cloudflare
if [ -n "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
  echo "$CLOUDFLARE_TUNNEL_TOKEN" | docker secret create CLOUDFLARE_TUNNEL_TOKEN - 2>/dev/null || echo "ℹ️  CLOUDFLARE_TUNNEL_TOKEN exists"
fi


SSHEOF

echo "✅ Secrets created"
ssh root@$MANAGER_IP "docker secret ls"
