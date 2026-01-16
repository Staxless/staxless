# Quick Start Guide

Let's get Staxless up and running on your local machine in just a few simple steps! This guide is designed to be quick and painless, using the Staxless CLI to automate most of the setup.

## Prerequisites

Make sure you have these tools ready:

- **Docker & Docker Compose**  
  Download from [docker.com](https://www.docker.com/get-started).  
  Verify: `docker --version` and `docker compose version`

- **Node.js**  
  Version 18 or higher. Check: `node -v`

- **Git**  
  Check: `git --version`

- **GitHub Access**  
  Authenticated with GitHub (via `gh auth login` or personal access token)

- **Third-Party Accounts**  
  Have your keys/tokens ready for:  
  • Stripe (if using payments)  
  • Mailgun (if using magic links)  
  • OAuth providers (Google, GitHub, etc.) if using social login

## Setup Steps

### 1. Install the Staxless CLI

```bash
git clone https://github.com/Staxless/staxless-cli.git
cd staxless-cli
npm install
npm link
```
