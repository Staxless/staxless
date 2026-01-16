# API Documentation

Welcome to the Staxless API Documentation! This section is your go-to guide for understanding all the API routes exposed by the Staxless boilerplate. We'll cover every endpoint, whether it's public or role-based, rate limits, expected inputs/outputs, and key details to help you integrate smoothly. The API is routed through the Kong API Gateway, which handles security, rate limiting, and role-based access control (RBAC). Let's dive in!

## Overview

The Staxless API is organized by microservices, each with specific routes for its functionality. All requests pass through the Kong API Gateway at `http://<your-domain>:8000` (or `http://localhost:8000` in development). The gateway applies plugins like `rbac-auth` for role-based access and `rate-limiting` for usage control. Here's what you need to know:

- **Base URL**: `http://<your-domain>:8000` (or `https` in production)
- **Authentication**: Most endpoints require an `x-user-info` header with a JSON object containing user details (e.g., `{"user_id": "123", "roles": ["user"]}`). This is set by the auth service after login.
- **Rate Limits**: Applied per service via Kong plugins. Default: 100 requests/hour per consumer for protected endpoints. Public endpoints may have higher limits (e.g., 500/hour).
- **Response Format**: JSON, with standard `{ data: {...}, error: null }` for success and `{ data: null, error: "message" }` for failures.
- **Error Codes**: Follow HTTP standards (e.g., 400 for bad requests, 401 for unauthorized, 429 for rate limit exceeded).

**Pro Tip**: Use the Kong Admin GUI at `http://localhost:8002` to inspect routes, plugins, and consumers. Test endpoints locally with `curl` or tools like Postman.

## Services and Routes

### Auth Service

Handles user authentication via OAuth and magic links. All routes are prefixed with `/auth`.

| Method | Path                             | Description                 | Access | Rate Limit | Notes                      |
| ------ | -------------------------------- | --------------------------- | ------ | ---------- | -------------------------- |
| POST   | `/auth/oauth/:provider`          | Initiate OAuth flow         | Public | 500/hour   | Redirects to provider      |
| GET    | `/auth/oauth/:provider/callback` | Handle OAuth callback       | Public | 500/hour   | Creates session, redirects |
| POST   | `/auth/magic-link/request`       | Request magic link          | Public | 100/hour   | Triggers email via Kafka   |
| GET    | `/auth/magic-link/verify`        | Verify magic link token     | Public | 100/hour   | Creates session if valid   |
| GET    | `/auth/session`                  | Get current session details | User   | 200/hour   | Requires `x-user-info`     |
| POST   | `/auth/logout`                   | End user session            | User   | 200/hour   | Invalidates session token  |
| GET    | `/auth/health`                   | Check service health        | Public | 1000/hour  | No auth required           |

### User Service

Manages user profiles and subscriptions. Routes prefixed with `/user`.

| Method | Path                        | Description             | Access | Rate Limit | Notes                  |
| ------ | --------------------------- | ----------------------- | ------ | ---------- | ---------------------- |
| GET    | `/user/profile`             | Get user profile        | User   | 200/hour   | Returns user data      |
| PATCH  | `/user/profile`             | Update user profile     | User   | 50/hour    | Validates input        |
| GET    | `/user/subscription`        | Get subscription status | User   | 200/hour   | Integrates with Stripe |
| POST   | `/user/subscription/cancel` | Cancel subscription     | User   | 20/hour    | Triggers Stripe update |
| GET    | `/user/health`              | Check service health    | Public | 1000/hour  | No auth required       |

### Payment Service

Handles Stripe payments and webhooks. Routes prefixed with `/stripe`.

| Method | Path               | Description                    | Access                 | Rate Limit | Notes                         |
| ------ | ------------------ | ------------------------------ | ---------------------- | ---------- | ----------------------------- |
| GET    | `/stripe/products` | List available products/prices | Public                 | 500/hour   | Used by frontend for checkout |
| POST   | `/stripe/checkout` | Create a checkout session      | User                   | 50/hour    | Returns session URL           |
| POST   | `/stripe/webhook`  | Handle Stripe webhooks         | Public (Stripe-signed) | 1000/hour  | Validates signature           |
| GET    | `/stripe/health`   | Check service health           | Public                 | 1000/hour  | No auth required              |

### Email Service

Sends transactional emails (primarily via Kafka events). Limited exposed endpoints. Routes prefixed with `/email`.

| Method | Path            | Description                  | Access | Rate Limit | Notes                |
| ------ | --------------- | ---------------------------- | ------ | ---------- | -------------------- |
| POST   | `/email/send`   | Send a test email (dev only) | Admin  | 20/hour    | Uses template config |
| GET    | `/email/health` | Check service health         | Public | 1000/hour  | No auth required     |

### Custom Service (Analytics Example)

Example of a custom service. Routes prefixed with `/analytics`.

| Method | Path                | Description          | Access | Rate Limit | Notes                      |
| ------ | ------------------- | -------------------- | ------ | ---------- | -------------------------- |
| GET    | `/analytics/data`   | Get analytics data   | User   | 100/hour   | Returns aggregated metrics |
| POST   | `/analytics/event`  | Log a custom event   | User   | 200/hour   | Publishes to Kafka         |
| GET    | `/analytics/health` | Check service health | Public | 1000/hour  | No auth required           |

## Kong Gateway Configuration

Key configurations in `kong-gateway/src/kong.yaml`:

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
  # Similar blocks for user, stripe, email, analytics...
```
