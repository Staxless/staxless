# Architecture Overview

Staxless is built with modularity and scalability in mind, using a clean microservices approach that's straightforward to understand and easy to extend. Think of it as a well-organized toolbox — each tool (service) has a clear job, and they all work together smoothly.

## Core Components

- **Frontend**  
  A Next.js application (`frontend/`) that handles the entire user interface.  
  Built with React, Tailwind CSS, and shadcn/ui components for modern, accessible, and beautiful UI.

- **API Gateway**  
  Powered by **Kong** (`kong-gateway/`).  
  Acts as the single entry point for all API traffic. Handles routing, authentication, rate limiting, and role-based access control (RBAC).

- **Microservices** (located in `microservices/`)

  - **Auth Service** — Handles login flows (OAuth providers + magic links)
  - **User Service** — Manages user profiles, settings, and subscription status
  - **Stripe Service** — Processes payments, creates checkout sessions, and handles Stripe webhooks
  - **Email Service** — Sends transactional emails (primarily triggered via events)

- **Event Streaming**  
  **Kafka** enables reliable, asynchronous communication between services.  
  Example: when a user signs up → auth service publishes an event → email service sends welcome email.

- **Database**  
  **MongoDB** — Stores all persistent data (users, subscriptions, etc.).  
  Simple to scale horizontally when needed.

- **Networking**  
  Two separate Docker networks for better security:
  - `frontend` → public-facing communication (browser ↔ Kong ↔ frontend)
  - `backend` → internal-only (services ↔ MongoDB, Kafka, each other)

## How It All Connects (Request Flow)

1. User interacts with the Next.js frontend
2. Frontend makes API calls to Kong (`localhost:8000` / your-domain:8000)
3. Kong authenticates (via `x-user-info` header), applies rate limits & RBAC
4. Kong routes the request to the correct microservice
5. Microservice processes request, reads/writes to MongoDB if needed
6. When appropriate, services publish events to Kafka
7. Other services consume those events (e.g. email sending, analytics, etc.)

This decoupled design makes the system resilient and easy to scale.

## Why This Architecture?

- **Scalability** — You can scale individual services (add replicas of auth, user, etc.) independently
- **Security** — Kong centralizes auth & rate limiting; internal network isolates databases & message queues
- **Flexibility** — Easy to change providers (Stripe → Lemon Squeezy, Mailgun → Resend, etc.) or add brand new services
- **Developer Experience** — Local development with Docker Compose, hot reloading, clear separation of concerns

Want to dive deeper into any specific service?  
Check the [Services section](./services/) for detailed documentation on each component.
