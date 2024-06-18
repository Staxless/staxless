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
