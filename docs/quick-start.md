# Quick Start Guide

Let's get Staxless up and running on your local machine in just a few simple steps! This guide is designed to be quick and painless, using the Staxless CLI to automate setup. If anything feels off, we'll include tips to help you troubleshoot right away.

## Prerequisites

Before we dive in, make sure you have these tools ready—they're the foundation for a smooth setup:

- **Docker & Docker Compose**: Download from [docker.com](https://www.docker.com/get-started). Verify with `docker --version` and `docker-compose --version`.
- **Node.js**: Version 18 or higher. Check with `node -v`. If needed, install via [nodejs.org](https://nodejs.org).
- **Git**: For cloning the repository. Confirm with `git --version`.
- **GitHub Access**: Ensure you're authenticated with GitHub (e.g., via `gh auth login` or a personal access token). The CLI will check this.
- **Third-Party Accounts**: Have your keys ready for services like Stripe, Mailgun, and OAuth providers (e.g., Google, GitHub). The CLI will prompt you for them.

## Setup Steps

1. **Install the Staxless CLI**  
   The CLI is your one-stop tool for initializing the project. First, clone the CLI repository (or install it if published—check the latest on GitHub):

   ```bash
   git clone https://github.com/Staxless/staxless-cli.git  # Assuming the CLI repo name
   cd staxless-cli
   npm install
   npm link  # Makes 'staxless' available globally
   ```

   If the CLI is published on npm, simply run: `npm install -g staxless-cli`.

2. **Run the CLI to Initialize Your Project**  
   The CLI will guide you through the entire setup with interactive prompts. It checks GitHub auth, clones the boilerplate repo, installs dependencies, configures linter/base/auth/payments, generates `.env` files, sets up the admin account, and more. Let's walk through this together:

   ```bash
   staxless init
   ```

   - **What Happens During Init?**
     - **GitHub Auth Check**: Verifies your Git credentials and access to the Staxless repo. If needed, it prompts for a personal access token.
     - **Project Details**: Prompts for "Set up Ultracite Linter?" (default: yes) and "Project name:" (e.g., `my-awesome-saas`).
     - **Clone Repo**: Clones `https://github.com/Staxless/staxless` into a new directory based on your project name.
     - **Install Dependencies**: Runs `npm install` in key directories (web, api, ui, utils).
     - **Configurations**:
       - Prompts for base config like Database URI (default: `mongodb://localhost:27017`).
       - Auth method: Choose OAuth, Magic Links, Both, or None. For OAuth, select providers (Google/GitHub) and enter Client ID/Secret. For Magic, select Mailgun and enter API Key/Domain.
       - Payments: Enable Stripe? If yes, enter Secret Key.
       - Generates Payload CMS secret automatically.
     - **Generate .env**: Creates `config/secrets/dev/staxless.dev.env` with all your inputs.
     - **Admin Account**: Prompts for admin email and appends it to `.env`.
     - **Final Output**: Displays a success message with next steps, like `cd my-awesome-saas && npm dev:up`.
   - **Pro Tip**: The CLI displays progress with spinners and ASCII art for a fun experience. If it fails (e.g., due to missing auth), it logs errors clearly.

3. **Launch the Application**  
   Once init completes, navigate to your new project directory:

   ```bash
   cd <your-project-name>  # e.g., cd my-awesome-saas
   docker-compose -f config/docker-compose.dev.yml up --build
   ```

   This builds Docker images for all services (frontend, auth, user, stripe, email, CMS, Kong, MongoDB, and Kafka) and starts them in development mode. The first run might take 5-10 minutes as it pulls dependencies and builds images—grab a coffee! Subsequent runs are much faster.

4. **Access the Application**  
   Once everything's running (you'll see logs confirming services are up), head to these URLs:

   - Frontend: [http://localhost:3000](http://localhost:3000) – Your main app interface for testing login, dashboard, etc.
   - Kong Admin GUI: [http://localhost:8002](http://localhost:8002) – Manage API routes visually.
   - CMS Admin: [http://localhost:8085/admin](http://localhost:8085/admin) – Log in with credentials from your Payload setup.

5. **Verify Setup**  
   Let's make sure everything's connected properly:
   - Run health checks for key services:
     ```bash
     curl http://localhost:8080/health  # Auth service – Expect { "uptime": ..., "message": "OK" }
     curl http://localhost:8083/health  # Stripe service – Should include "stripeConnected": true
     curl http://localhost:8084/health  # Email service
     curl http://localhost:8082/health  # User service
     curl http://localhost:8085/health  # CMS service
     ```
   - Test the frontend: Navigate to [http://localhost:3000/login](http://localhost:3000/login) and try signing in with OAuth or a magic link.
   - Check Docker status: `docker ps` should list all containers as "Up".

## Quick Tips for a Smooth Start

- **Common Hiccups**: If the CLI fails during auth check, run `gh auth login` or provide a token when prompted. Check logs with `docker-compose logs <service-name>` (e.g., `docker-compose logs auth-service`). Look for errors like missing env vars or port conflicts.
- **Port Conflicts**: Run `lsof -i :3000` (or similar for other ports) to find and kill conflicting processes.
- **Hot Reloading**: In dev mode, changes to frontend code reload automatically—perfect for quick iterations.
- **Stopping Services**: Use `docker-compose down` to cleanly stop everything. Add `-v` to remove volumes if you need a fresh start.

If something doesn't click, head to the [Troubleshooting & FAQs](../troubleshooting.md) section—we've got you covered!
