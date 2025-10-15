```markdown
# API Documentation

Welcome to the Staxless API Documentation! This section is your go-to guide for understanding all the API routes exposed by the Staxless boilerplate. We'll cover every endpoint, whether it's public or role-based, rate limits, expected inputs/outputs, and key details to help you integrate smoothly. The API is routed through the Kong API Gateway, which handles security, rate limiting, and role-based access control (RBAC). Let's dive in and explore how to interact with each service's endpoints!

## Overview
The Staxless API is organized by microservices, each with specific routes for its functionality. All requests pass through the Kong API Gateway at `http://<your-domain>:8000` (or `http://localhost:8000` in development). The gateway applies plugins like `rbac-auth` for role-based access and `rate-limiting` for usage control. Here's what you need to know:

- **Base URL**: `http://<your-domain>:8000` (or `https` in production).
- **Authentication**: Most endpoints require an `x-user-info` header with a JSON object containing user details (e.g., `{"user_id": "123", "roles": ["user"]}`). This is set by the auth service after login.
- **Rate Limits**: Applied per service via Kong plugins. Default: 100 requests/hour per consumer for protected endpoints. Public endpoints may have higher limits (e.g., 500/hour).
- **Response Format**: JSON, with standard `{ data: {...}, error: null }` for success and `{ data: null, error: "message" }` for failures.
- **Error Codes**: Follow HTTP standards (e.g., 400 for bad requests, 401 for unauthorized, 429 for rate limit exceeded).

**Pro Tip**: Use the Kong Admin GUI at `http://localhost:8002` to inspect routes, plugins, and consumers. Test endpoints locally with `curl` or tools like Postman.

## Services and Routes
Below, we detail the routes for each service, grouped by functionality. Each includes the HTTP method, path, access requirements, rate limits, and example requests/responses.

### Auth Service
The auth service (`microservices/auth-service/`) handles user authentication via OAuth and magic links. All routes are prefixed with `/auth`.

| Method | Path | Description | Access | Rate Limit | Notes |
|--------|------|-------------|--------|------------|-------|
| POST   | `/auth/oauth/:provider` | Initiate OAuth flow for a provider (e.g., Google, GitHub) | Public | 500/hour | Redirects to provider's login page |
| GET    | `/auth/oauth/:provider/callback` | Handle OAuth callback | Public | 500/hour | Creates session, redirects to frontend |
| POST   | `/auth/magic-link/request` | Request a magic link for passwordless login | Public | 100/hour | Triggers email via Kafka |
| GET    | `/auth/magic-link/verify` | Verify magic link token | Public | 100/hour | Creates session if valid |
| GET    | `/auth/session` | Get current session details | User | 200/hour | Requires `x-user-info` header |
| POST   | `/auth/logout` | End user session | User | 200/hour | Invalidates session token |
| GET    | `/auth/health` | Check service health | Public | 1000/hour | No auth required |

- **Example: Initiate Google OAuth**
  ```bash
  curl -X POST http://localhost:8000/auth/oauth/google
```

**Response**: Redirects to Google's login page (302 status).

- **Example: Request Magic Link**

  ```bash
  curl -X POST http://localhost:8000/auth/magic-link/request -H "Content-Type: application/json" -d '{"email": "test@example.com"}'
  ```

  **Response**:

  ```json
  {
    "data": { "message": "Magic link sent to test@example.com" },
    "error": null
  }
  ```

  **Note**: Check email for the link, which hits `/auth/magic-link/verify?token=abc123`.

- **Example: Get Session**

  ```bash
  curl -X GET http://localhost:8000/auth/session -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}"
  ```

  **Response**:

  ```json
  {
    "data": {
      "user_id": "123",
      "email": "test@example.com",
      "roles": ["user"],
      "session_expires": "2025-10-14T10:00:00Z"
    },
    "error": null
  }
  ```

- **RBAC Details**: The `rbac-auth` plugin checks the `x-user-info` header for `roles`. Only `/session` and `/logout` require `user` or `admin` roles. Public endpoints are open but rate-limited.

- **Rate Limiting**: Configured in `kong.yaml`:

  ```yaml
  plugins:
    - name: rate-limiting
      config:
        hour: 100
        policy: local
  ```

  Override per route if needed (e.g., `hour: 500` for OAuth endpoints).

- **Troubleshooting**: If OAuth fails, verify `PROVIDER_CLIENT_ID` and `redirectUri` in `src/lib/providers/<provider>.ts`. For magic links, ensure Kafka and email service are running (`docker ps`).

### User Service

The user service (`microservices/user-service/`) manages user profiles and subscriptions. Routes are prefixed with `/user`.

| Method | Path | Description | Access | Rate Limit | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/user/profile` | Get user profile | User | 200/hour | Returns user data |
| PATCH | `/user/profile` | Update user profile (e.g., name, email) | User | 50/hour | Validates input |
| GET | `/user/subscription` | Get subscription status | User | 200/hour | Integrates with Stripe |
| POST | `/user/subscription/cancel` | Cancel subscription | User | 20/hour | Triggers Stripe update |
| GET | `/user/health` | Check service health | Public | 1000/hour | No auth required |

- **Example: Get Profile**

  ```bash
  curl -X GET http://localhost:8000/user/profile -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}"
  ```

  **Response**:

  ```json
  {
    "data": {
      "user_id": "123",
      "email": "test@example.com",
      "name": "Test User",
      "created_at": "2025-10-01T00:00:00Z"
    },
    "error": null
  }
  ```

- **Example: Update Profile**

  ```bash
  curl -X PATCH http://localhost:8000/user/profile -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}" -H "Content-Type: application/json" -d '{"name": "New Name"}'
  ```

  **Response**:

  ```json
  {
    "data": { "message": "Profile updated", "name": "New Name" },
    "error": null
  }
  ```

- **RBAC Details**: All routes except `/health` require `user` or `admin` roles. The `x-user-info` header must match the requesting user_id for profile actions.

- **Rate Limiting**: Stricter for sensitive actions like subscription cancellation to prevent abuse.

- **Troubleshooting**: If subscription data is missing, verify Stripe integration and Kafka events (`docker logs user-service`).

### Payment Service

The payment service (`microservices/stripe-service/`) handles Stripe payments and webhooks. Routes are prefixed with `/stripe`.

| Method | Path | Description | Access | Rate Limit | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/stripe/products` | List available products/prices | Public | 500/hour | Used by frontend for checkout |
| POST | `/stripe/checkout` | Create a checkout session | User | 50/hour | Returns session URL |
| POST | `/stripe/webhook` | Handle Stripe webhooks | Public (Stripe-signed) | 1000/hour | Validates signature |
| GET | `/stripe/health` | Check service health | Public | 1000/hour | No auth required |

- **Example: List Products**

  ```bash
  curl -X GET http://localhost:8000/stripe/products
  ```

  **Response**:

  ```json
  {
    "data": [
      { "id": "prod_123", "name": "Pro Plan", "price": 29.00, "currency": "usd" },
      { "id": "prod_456", "name": "Free Plan", "price": 0.00, "currency": "usd" }
    ],
    "error": null
  }
  ```

- **Example: Create Checkout Session**

  ```bash
  curl -X POST http://localhost:8000/stripe/checkout -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}" -H "Content-Type: application/json" -d '{"productId": "prod_123", "quantity": 1}'
  ```

  **Response**:

  ```json
  {
    "data": { "session_url": "https://checkout.stripe.com/pay/cs_..." },
    "error": null
  }
  ```

- **Webhook Security**: The `/stripe/webhook` endpoint requires a Stripe signature in the `Stripe-Signature` header. Configure in `src/config/stripe-client.ts` with `STRIPE_WEBHOOK_SECRET`.

- **RBAC Details**: Only `/checkout` requires `user` role. Webhooks are public but validated by Stripe's signature.

- **Rate Limiting**: High limit for webhooks to handle frequent Stripe events. Checkout is limited to prevent abuse.

- **Troubleshooting**: Use Stripe CLI for local webhook testing:

  ```bash
  stripe listen --forward-to http://localhost:8083/webhook
  stripe trigger checkout.session.completed
  ```

  Check `docker logs stripe-service` for webhook errors.

### Email Service

The email service (`microservices/email-service/`) sends transactional emails via Mailgun. Routes are prefixed with `/email`. Most functionality is internal (via Kafka), but some endpoints are exposed for testing.

| Method | Path | Description | Access | Rate Limit | Notes |
| --- | --- | --- | --- | --- | --- |
| POST | `/email/send` | Send a test email (dev only) | Admin | 20/hour | Uses template config |
| GET | `/email/health` | Check service health | Public | 1000/hour | No auth required |

- **Example: Send Test Email**

  ```bash
  curl -X POST http://localhost:8000/email/send -H "x-user-info: {\"user_id\": \"admin1\", \"roles\": [\"admin\"]}" -H "Content-Type: application/json" -d '{"template": "welcome", "email": "test@example.com", "variables": {"name": "Test User"}}'
  ```

  **Response**:

  ```json
  {
    "data": { "message": "Email sent to test@example.com" },
    "error": null
  }
  ```

- **RBAC Details**: `/email/send` is restricted to `admin` role for security, as it's primarily for testing. Normal email sending occurs via Kafka events (e.g., from auth service).

- **Rate Limiting**: Low limit for `/email/send` to prevent spam. Health endpoint has a high limit.

- **Troubleshooting**: Verify `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` in `.env`. Check Mailgun dashboard for delivery logs. Ensure Kafka is running for event-driven emails.

### CMS Service

The CMS service (`microservices/cms-service/`) uses Payload CMS for content management. Routes are prefixed with `/cms`. It exposes REST and GraphQL APIs.

| Method | Path | Description | Access | Rate Limit | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/cms/api/users` | List users (REST) | Admin | 100/hour | Paginated results |
| GET | `/cms/api/users/:id` | Get user by ID | Admin | 100/hour | Returns single user |
| POST | `/cms/api/users` | Create user | Admin | 50/hour | Validates input |
| PATCH | `/cms/api/users/:id` | Update user | Admin | 50/hour | Restricted fields |
| DELETE | `/cms/api/users/:id` | Delete user | Admin | 20/hour | Soft delete |
| POST | `/cms/api/graphql` | GraphQL endpoint | Admin/User | 200/hour | Depends on query |
| GET | `/cms/health` | Check service health | Public | 1000/hour | No auth required |

- **Example: List Users (REST)**

  ```bash
  curl -X GET http://localhost:8000/cms/api/users -H "x-user-info: {\"user_id\": \"admin1\", \"roles\": [\"admin\"]}"
  ```

  **Response**:

  ```json
  {
    "data": {
      "docs": [
        { "id": "123", "email": "test@example.com", "name": "Test User" }
      ],
      "totalDocs": 1
    },
    "error": null
  }
  ```

- **Example: GraphQL Query**

  ```bash
  curl -X POST http://localhost:8000/cms/api/graphql -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}" -H "Content-Type: application/json" -d '{"query": "query { Users { docs { email } } }"}'
  ```

  **Response**:

  ```json
  {
    "data": {
      "Users": {
        "docs": [{ "email": "test@example.com" }]
      }
    },
    "error": null
  }
  ```

- **RBAC Details**: Admin routes (`/cms/api/*`) require `admin` role. GraphQL endpoint allows `user` role for read-only queries (controlled by Payload's access policies in `src/access/`).

- **Rate Limiting**: Stricter for write operations (POST, PATCH, DELETE) to prevent abuse.

- **Troubleshooting**: Check `PAYLOAD_SECRET` and `DATABASE_URI`. Access admin panel at `http://localhost:8085/admin` for manual debugging.

### Custom Service (Analytics Example)

This is an example of a custom analytics service (`microservices/analytics-service/`), showing how to expose new endpoints. Routes are prefixed with `/analytics`.

| Method | Path | Description | Access | Rate Limit | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/analytics/data` | Get analytics data | User | 100/hour | Returns aggregated metrics |
| POST | `/analytics/event` | Log a custom event | User | 200/hour | Publishes to Kafka |
| GET | `/analytics/health` | Check service health | Public | 1000/hour | No auth required |

- **Example: Get Analytics Data**

  ```bash
  curl -X GET http://localhost:8000/analytics/data -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}"
  ```

  **Response**:

  ```json
  {
    "data": {
      "page_views": 1000,
      "unique_users": 150,
      "timestamp": "2025-10-13T21:00:00Z"
    },
    "error": null
  }
  ```

- **Example: Log Event**

  ```bash
  curl -X POST http://localhost:8000/analytics/event -H "x-user-info: {\"user_id\": \"123\", \"roles\": [\"user\"]}" -H "Content-Type: application/json" -d '{"event": "button_click", "details": {"button_id": "cta1"}}'
  ```

  **Response**:

  ```json
  {
    "data": { "message": "Event logged" },
    "error": null
  }
  ```

- **RBAC Details**: Requires `user` role for data access and event logging. Configured in `kong.yaml`:

  ```yaml
  services:
    - name: analytics-service
      url: http://analytics:8086
      routes:
        - paths: [/analytics]
      plugins:
        - name: rbac-auth
          config: { roles: ["user"] }
  ```

- **Rate Limiting**: Higher limit for event logging to support frequent actions.

- **Troubleshooting**: Verify Kafka topic (`analytics-events`) exists. Check `docker logs analytics-service` for errors.

## Kong Gateway Configuration

The Kong Gateway (`kong-gateway/`) manages all routes and applies plugins for security and rate limiting. Key configurations in `kong-gateway/src/kong.yaml`:

```yaml
_format_version: "3.0"
_transform: true
services:
  - name: auth-service
    url: http://auth:8080
    routes:
      - name: auth-route
        paths: [/auth]
        strip_path: true
    plugins:
      - name: rate-limiting
        config:
          hour: 100
          policy: local
      - name: rbac-auth
        config:
          roles: ["user", "admin"]
          header_name: x-user-info
  # Similar blocks for user, stripe, email, cms, analytics
```

- **RBAC Plugin**: Checks `x-user-info` header for roles. Unauthenticated requests to protected routes return 401.
- **Rate Limiting**: Applied globally or per route. Consumers are identified by `x-user-info` or API keys for public routes.
- **Health Checks**: Each service exposes a `/health` endpoint, checked by Kong:

  ```yaml
  healthchecks:
    active:
      type: http
      http_path: /health
      healthy: { interval: 30, successes: 2 }
      unhealthy: { interval: 30, failures: 3 }
  ```

## Security Considerations

- **Headers**: Always include `x-user-info` for protected routes. Generated by auth service after login.
- **HTTPS**: Use in production (port 8443). Configure SSL in `kong.yaml` or via provider (e.g., DigitalOcean Certbot).
- **Secrets**: Store sensitive keys (e.g., `STRIPE_PRIVATE_KEY`) in Docker secrets or provider-specific secret managers (AWS Secrets Manager, Azure Key Vault).
- **CORS**: Configured in `kong.yaml` for frontend access:

  ```yaml
  plugins:
    - name: cors
      config:
        origins: ["http://localhost:3000", "https://your-domain.com"]
  ```

## Testing and Debugging

- **Local Testing**: Use `curl` or Postman. For OAuth/magic links, test via frontend at `http://localhost:3000/login`.
- **Ngrok for Webhooks**: Expose local server for Stripe/Mailgun:

  ```bash
  ngrok http 8000
  ```

  Update webhook URLs in provider dashboards.
- **Logs**: Check service logs: `docker-compose logs <service-name>`.
- **Kong Admin API**: Query `http://localhost:8001` for route/plugin details:

  ```bash
  curl http://localhost:8001/services
  ```

## Extending the API

To add new routes:

1. Update the service's `src/routes/` (e.g., `analytics-routes.ts`).
2. Add to `kong.yaml`:

   ```yaml
   services:
     - name: new-service
       url: http://new-service:8087
       routes:
         - paths: [/new]
   ```
3. Apply RBAC/rate-limiting plugins as needed.
4. Test: `curl http://localhost:8000/new/health`.

**Pro Tip**: Use Swagger/OpenAPI to generate interactive API docs. Add to `frontend/` with `swagger-ui-react` for a developer portal.

If you hit any snags or need to extend this further, check out the Troubleshooting & FAQs section or let us know!

```
```