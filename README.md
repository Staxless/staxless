
# Staxless SaaS Boilerplate 

Welcome to **Staxless** – your all-in-one solution for building modern, subscription-based SaaS applications quickly and efficiently! This boilerplate combines a powerful Next.js frontend, Node.js microservices, and a Kong API gateway, all containerized with Docker. Whether you’re a startup founder or a seasoned developer, Staxless provides the tools you need to launch your SaaS product with authentication, payments, and marketing features out of the box.

---

## ✨ Features

- **Frontend**: Next.js with React, Tailwind CSS, and MDX for a stunning, responsive UI.
- **Microservices**: Node.js with Express for authentication, user management, and Stripe payments.
- **API Gateway**: Kong for seamless routing and proxying between services.
- **Authentication**: Lucia with OAuth2 support (e.g., Google, GitHub).
- **Payments**: Stripe integration for subscriptions and one-time purchases.
- **Database**: MongoDB for scalable user and session management.
- **Containerized**: Docker and Docker Compose with hot reloading for development and optimized builds for production.
- **Marketing Ready**: Built-in docs, and legal pages with MDX support.

---

## 🛠️ Tech Stack

| Component         | Technology                  |
|-------------------|-----------------------------|
| **Frontend**      | Next.js, React, Tailwind CSS|
| **Backend**       | Node.js, Express, MongoDB   |
| **API Gateway**   | Kong                        |
| **Payments**      | Stripe                      |
| **Authentication**| Lucia, OAuth2               |
| **DevOps**        | Docker, Docker Compose      |

---

## 🚀 Quick Start

Get Staxless up and running in just **5-10 minutes**!

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- A [Stripe](https://stripe.com/) account (for payments)

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/zacharybenson/staxless.git
   cd zacharybenson-staxless
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `secrets/template.env` to `secrets/.env` in `frontend/`, `microservices/auth-service/`, `microservices/stripe-service/`, and `microservices/user-service/`.
   - Update `.env` files with your Stripe keys, OAuth credentials, and MongoDB settings (see [Environment Configuration](#environment-configuration)).

4. **Launch with Docker**
   ```bash
   docker-compose -f config/docker-compose.dev.yml up --build
   ```

5. **Open Your Browser**
   Visit [http://localhost:3000](http://localhost:3000) to see Staxless in action! 🎉

---

## 📖 Documentation

For detailed setup, development workflows, and feature breakdowns, check out the [full documentation](docs/staxless-documentation.md). Here’s a sneak peek:

- **Setup Guide**: Prerequisites, installation, and environment setup.
- **Core Features**: Authentication, payments, API endpoints, and database schema.
- **User Guides**: Quick start, development with hot reloading, and deployment tips.

---

## 🏗️ Project Structure

```
zacharybenson-staxless/
├── README.md              # You’re here!
├── config/                # Docker Compose and top-level configs
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   └── package.json
├── frontend/              # Next.js frontend
│   ├── src/              # Pages, components, and utilities
│   ├── dockerfiles/      # Frontend Docker setup
│   └── secrets/          # Environment variables
├── kong-gateway/          # Kong API gateway configuration
└── microservices/         # Backend services
    ├── auth-service/     # Authentication with OAuth
    ├── stripe-service/   # Stripe payment integration
    └── user-service/     # User management with MongoDB
```

---

## 🌟 Getting Started with Development

1. **Run in Dev Mode**
   ```bash
   docker-compose -f config/docker-compose.dev.yml up --build
   ```
   *Hot reloading is enabled! Changes to frontend or microservices reflect instantly.*

2. **Test APIs**
   - Auth: `curl http://localhost:8080/health`
   - Stripe: `curl http://localhost:8083/products`
   - User: `curl http://localhost:8082/`

3. **Explore the Frontend**
   Edit `frontend/src/app/page.tsx` to customize the landing page!

---

## 🔧 Environment Configuration

Each service requires an `.env` file in its `secrets/` directory. Here’s an example for `microservices/stripe-service/secrets/.env`:

```bash
PORT=8083
STRIPE_PRIVATE_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

See the full list of variables in each `secrets/template.env` file.

---

## 🛡️ Deployment

Ready to go live? Use `docker-compose.prod.yml` for optimized production builds:
```bash
docker-compose -f config/docker-compose.prod.yml up --build
```

For AWS deployment, check the [Deploying to AWS](#deploying-to-aws) section in the docs!

---

## 🤝 Contributing

We’d love your help to make Staxless even better! 
- Fork the repo and submit a PR.
- Report issues or suggest features via [GitHub Issues](https://github.com/zacharybenson/staxless/issues).

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

## 👋 Connect with Us

- **Author**: Zachary Benson
- **Twitter**: [@staxless](https://twitter.com/staxless)
- **Website**: [staxless.com](https://staxless.com)

Happy building with Staxless! Let’s create something amazing together! 🌍
