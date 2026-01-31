<div align="center">

# Staxless

**Build Simple. Scale Smarter.**

[![License](https://img.shields.io/badge/license-proprietary-8B7EC8?style=flat-square)](https://staxless.com)
[![Node](https://img.shields.io/badge/node-%3E%3D18-86EFAC?style=flat-square)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-required-2496ED?style=flat-square)](https://docker.com)

The production-ready SaaS boilerplate for modern applications.

</div>

---

## Features

- **Frontend** - Next.js with React, Tailwind CSS, and shadcn/ui
- **Microservices** - Node.js with Express for auth, users, payments, and email
- **API Gateway** - Kong for routing and rate limiting
- **Authentication** - Lucia with OAuth2 (Google, GitHub)
- **Payments** - Stripe subscriptions and one-time purchases
- **Database** - MongoDB for scalable data management
- **Containerized** - Docker Compose with hot reloading

---

## Quick Start

```bash
# Install the CLI
npm install -g @staxless/cli

# Initialize your project
staxless init

# Start development
staxless dev start
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js, React, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, MongoDB |
| API Gateway | Kong |
| Payments | Stripe |
| Authentication | Lucia, OAuth2 |
| DevOps | Docker, Docker Compose |

---

## Project Structure

```
staxless/
├── microservices/
│   ├── frontend/          # Next.js application
│   │   ├── src/
│   │   │   ├── app/       # Next.js App Router
│   │   │   └── components/
│   │   │       ├── sales/ # Landing page sections
│   │   │       ├── shared/# Header, Footer
│   │   │       └── ui/    # shadcn components
│   │   └── config/        # Brand & sales config
│   ├── auth-service/      # Authentication
│   ├── user-service/      # User management
│   ├── stripe-service/    # Payments
│   └── email-service/     # Transactional email
├── kong-gateway/          # API Gateway config
├── docker/                # Docker configurations
└── environments/          # Environment templates
```

---

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js application |
| API Gateway | 8000 | Kong API Gateway |
| Auth Service | 8080 | Authentication & OAuth |
| User Service | 8082 | User management |
| Stripe Service | 8083 | Payments & subscriptions |
| Email Service | 8084 | Transactional email |
| MongoDB | 27017 | Database |

---

## Configuration

### Frontend Customization

```bash
# Configure branding and styles
staxless setup:frontend
```

Or edit directly:
- `frontend/config/brand-config.ts` - Colors, typography, company info
- `frontend/config/sales-config.ts` - Landing page copy, testimonials, pricing

### Environment Variables

Copy templates and configure:

```bash
cp environments/template.env environments/.env
```

Required variables:
- `STRIPE_PRIVATE_KEY` - Stripe API key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - OAuth
- `MONGODB_URI` - Database connection

---

## Development

```bash
# Start all services
staxless dev start

# View logs
staxless dev logs -f

# Check status
staxless dev status

# Stop services
staxless dev down

# Full reset
staxless dev reset
```

---

## Deployment

```bash
# Configure production secrets
staxless setup:prod

# Deploy to production
staxless prod deploy

# Check deployment status
staxless prod status
```

---

## Prerequisites

- **Node.js 18+** - [nodejs.org](https://nodejs.org)
- **Git** - [git-scm.com](https://git-scm.com)
- **Docker** - [docker.com](https://docker.com)
- **GitHub CLI** - [cli.github.com](https://cli.github.com)

---

## Links

- [Website](https://staxless.com)
- [CLI Documentation](https://github.com/Staxless/staxless-cli)
- [Report Issues](https://github.com/Staxless/staxless/issues)

---

<div align="center">

Made with care by [Staxless](https://staxless.com)

</div>
