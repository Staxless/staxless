# Architecture Overview

Staxless is built with modularity and scalability in mind, using a microservices approach that's easy to understand and extend. Think of it as a well-organized toolbox where each tool (service) has a specific job, and they all work together seamlessly. Here's a friendly breakdown to help you visualize the big picture.

## Core Components

- **Frontend**: A Next.js app in `frontend/` that handles the user interface. It uses React for dynamic components, Tailwind CSS for styling, and shadcn/ui for consistent, accessible UI elements. This is where users interact with your SaaS—login, dashboard, checkout, and more.
- **API Gateway**: Powered by Kong in `kong-gateway/`, this acts as the "front door" for all API requests. It routes traffic securely, handles authentication, and enforces rules like rate limiting or RBAC (role-based access control).
- **Microservices**: These are the backend workhorses, each in `microservices/`:
  - **Auth Service**: Manages logins via OAuth or magic links.
  - **User Service**: Stores and updates user data, including subscriptions.
  - **Stripe Service**: Integrates payments and handles webhooks.
  - **Email Service**: Sends emails using Mailgun.
  - **CMS Service**: Uses Payload CMS for managing content like users and media.
- **Event Streaming**: Kafka handles asynchronous communication—e.g., auth triggers an email event. This keeps services decoupled and responsive.
- **Database**: MongoDB stores persistent data like users and content. It's configured for easy scaling.
- **Networking**: Two Docker networks separate traffic: `frontend` for public-facing (e.g., UI to Kong) and `backend` for internal (e.g., services to MongoDB/Kafka). This enhances security.

## How It All Connects

Requests start at the frontend, go through Kong (which checks permissions), hit the relevant microservice, and may trigger Kafka events for other services. Data flows to MongoDB as needed. This setup allows you to scale individual parts without overhauling everything.

## Why This Architecture?

Scalability: Add replicas to services like auth or user for high traffic.
Security: Kong and RBAC protect endpoints; networks isolate traffic.
Flexibility: Easy to swap providers (e.g., email from Mailgun to SendGrid) or add services.
Developer-Friendly: Docker Compose for local dev, with hot reloading and clear separation of concerns.

For details on specific services, check out the Services section!
