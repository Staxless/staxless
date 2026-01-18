group "default" {
 targets = ["frontend", "auth-service", "user-service", "stripe-service", "email-service", "kong-api-gateway"]
}

target "frontend" {
  context = "../microservices/frontend/"
  dockerfile = "../../docker/dockerfiles/frontend.Dockerfile"
  target = "prod" 
  tags = ["ghcr.io/staxless/staxless/frontend:latest"]
  platforms = ["linux/amd64"]
}

target "auth-service" {
  context = "../microservices/auth-service/"
  dockerfile = "../../docker/dockerfiles/node-service.Dockerfile"
  target = "prod"
  tags = ["ghcr.io/staxless/staxless/auth-service:latest"]
  platforms = ["linux/amd64"]
}

target "user-service" {
  context = "../microservices/user-service/"
  dockerfile = "../../docker/dockerfiles/node-service.Dockerfile"
  target = "prod"
  tags = ["ghcr.io/staxless/staxless/user-service:latest"]
  platforms = ["linux/amd64"]
}

target "stripe-service" {
  context = "../microservices/stripe-service/"
  dockerfile = "../../docker/dockerfiles/node-service.Dockerfile"
  target = "prod"
  tags = ["ghcr.io/staxless/staxless/stripe-service:latest"]
  platforms = ["linux/amd64"]
}

target "email-service" {
  context = "../microservices/email-service/"
  dockerfile = "../../docker/dockerfiles/node-service.Dockerfile"
  target = "prod"
  tags = ["ghcr.io/staxless/staxless/email-service:latest"]
  platforms = ["linux/amd64"]
}


target "kong-api-gateway" {
  context = "../microservices/kong-gateway/"
  dockerfile = "../../docker/dockerfiles/kong.Dockerfile"
  target = "prod"
  tags = ["ghcr.io/staxless/staxless/kong:latest"]
  platforms = ["linux/amd64"]
  no-cache = true
}