```
.
├── Config/
│ ├── compose.dev.yml
│ ├── compose.prod.yml
│ └── package.json
├── frontend/
│ ├── src
│ ├── package.json
│ └── dockerfiles/
│ ├── frontend.dockerfile.dev
│ ├── frontend.dockerfile.prod
│ └── secrets/
│ └── secretx
├── api-gateway/
│ ├── src/
│ │ └── package.json
│ ├── dockerfiles/
│ │ ├── api-gateway.dockerfile.dev
│ │ └── api-gateway.dockerfile.prod
│ └── secrets/
│ └── secretx
└── microservices/
│ └─── microserviceX/
├── src
├── package.json
├── dockerfiles/
│ ├── microserviceX.dockerfile.dev
│ └── microserviceX.dockerfile.prod
├─── secrets/
  └── secretx
```

api-gateway:

- Connected to frontend
- Front end -> proxy api/ to frontgate
  -> api-gate way routes to backend service
  -> backend service handles call

  IMAGE CONTAINER SIZES

  ENV: DEVELOPMENT
  REPOSITORY             SIZE
  app_frontend           1.86GB
  app_auth_service       1.15GB
  app-database-service   1.15GB
  app-stripe-service     1.15GB
  app_api_gateway        133MB

  ENV: PRODUCTION
  REPOSITORY             SIZE
  app_frontend           145MB
  app_auth_service       193MB
  app-database-service   191MB
  app-stripe-service     186MB
  app_api_gateway        129MB
