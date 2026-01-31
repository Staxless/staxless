# docker-bake.hcl
# ──────────────────────────────────────────────────────────────────────────────
# Global variables (overridable via environment iables)
# ──────────────────────────────────────────────────────────────────────────────

variable "REGISTRY" {
  default     = "ghcr.io/staxless/staxless"
  description = "Container registry prefix (without trailing slash)"
}

variable "VERSION" {
  default     = "latest"
  description = "Image tag/version (semver, git-sha, latest, etc.)"
}

variable "PLATFORMS" {
  default     = ["linux/amd64"]
  description = "Target platforms to build for"
}

# ──────────────────────────────────────────────────────────────────────────────
# Default group — what gets built when running: docker buildx bake
# ──────────────────────────────────────────────────────────────────────────────

group "default" {
  targets = [
    // "frontend",
    // "auth-service",
    // "user-service",
    // "stripe-service",
    "email-service",
    // "kong-api-gateway"
  ]
}

# ──────────────────────────────────────────────────────────────────────────────
# Shared base for Node.js services (inherits reduce repetition)
# ──────────────────────────────────────────────────────────────────────────────

target "node-base" {
  dockerfile = "../../docker/dockerfiles/node-service.Dockerfile"
  target     = "prod"
  platforms  = PLATFORMS
  # No tags here → each service defines its own
}

# ──────────────────────────────────────────────────────────────────────────────
# Individual targets
# ──────────────────────────────────────────────────────────────────────────────

target "frontend" {
  context    = "../microservices/frontend/"
  dockerfile = "../../docker/dockerfiles/frontend.Dockerfile"
  target     = "prod"
  platforms  = PLATFORMS
  tags       = ["${REGISTRY}/frontend:${VERSION}"]
}

target "auth-service" {
  inherits = ["node-base"]
  context  = "../microservices/auth-service/"
  tags     = ["${REGISTRY}/auth-service:${VERSION}"]
}

target "user-service" {
  inherits = ["node-base"]
  context  = "../microservices/user-service/"
  tags     = ["${REGISTRY}/user-service:${VERSION}"]
}

target "stripe-service" {
  inherits = ["node-base"]
  context  = "../microservices/stripe-service/"
  tags     = ["${REGISTRY}/stripe-service:${VERSION}"]
}

target "email-service" {
  inherits = ["node-base"]
  context  = "../microservices/email-service/"
  tags     = ["${REGISTRY}/email-service:${VERSION}"]
}

target "kong-api-gateway" {
  context    = "../microservices/kong-gateway/"
  dockerfile = "../../docker/dockerfiles/kong.Dockerfile"
  target     = "prod"
  platforms  = PLATFORMS
  tags       = ["${REGISTRY}/kong:${VERSION}"]
  no-cache   = true
}