```markdown
# API Gateway

The API Gateway (`kong-gateway/`) is your traffic cop, routing requests and adding security layers without code changes. Let's dive into setting it up and customizing its RBAC plugin.

## Setup
Kong uses a declarative config for simplicity—no database needed in basic setups.  

- **Configuration Files**:  
  - `kong-gateway/src/kong.yaml`: Defines services, routes, and plugins.  
  - Dockerfiles and volumes in `config/docker-compose.dev.yml` for dev.  

- **Environment Variables**: In `.env` or `config/secrets/prod/kong.env`:  
  - `KONG_DATABASE=off` (declarative mode).  
  - `KONG_PROXY_LISTEN=0.0.0.0:8000`.  
  - `KONG_PLUGINS=bundled,rbac-auth`.  
  - `KONG_DECLARATIVE_CONFIG=/opt/kong/src/kong.yaml`.  

- **Ports and Networks**:  
  - Proxy: 8000 (HTTP), 8443 (HTTPS).  
  - Admin API: 8001 (programmatic control).  
  - Admin GUI: 8002 (visual dashboard).  
  - Networks: Aliased as `front-gate` (frontend) and `back-gate` (backend).  

- **Steps to Set Up**:  
  1. Edit `kong.yaml` for your services:  
     ```yaml
     _format_version: "3.0"
     _transform: true
     services:
       - name: auth-service
         url: http://auth:8080
         plugins:
           - name: request-transformer # Example plugin
             config:
               add:
                 headers:
                   - "x-forwarded-for: {client_ip}"
         routes:
           - name: auth-route
             methods: [GET, POST]
             paths: [/auth]
             strip_path: true
       # Add similar blocks for user, stripe, etc.
     ```  
  2. Build and start: `docker-compose -f config/docker-compose.dev.yml up --build kong-api-gateway`.  
  3. Validate config via Admin API: `curl http://localhost:8001/config?check=true -d @kong-gateway/src/kong.yaml`.  
  4. Test a route: `curl http://localhost:8000/auth/health` – Should proxy to auth service.  
  5. For prod, use `docker-compose.prod.yml` with persistent volumes for `kong_prefix_vol` and `kong_tmp_vol`.  

**Pro Tip**: Use Kong's health checks in `kong.yaml` (e.g., `healthchecks: active: {type: http, path: /health}`) to auto-retry failed upstreams. Monitor with `docker logs kong-api-gateway`.

## RBAC Plugin
This custom plugin (`kong-gateway/plugins/rbac-auth/`) enforces roles like 'admin' or 'user'.  

- **Files**:  
  - `handler.lua`: Core logic for checking headers (e.g., `x-user-info`) against roles.  
  - `schema.lua`: Defines config options like allowed roles.  

- **Integration**: Applied per route in `kong.yaml`:  
  ```yaml
  plugins:
    - name: rbac-auth
      config:
        roles: ["admin", "user"]
        deny_unauthorized: true
        header_name: x-user-info # Contains JSON with user roles
  ```  

- **Steps to Customize**:  
  1. Edit `schema.lua` to add fields:  
     ```lua
     fields = {
       roles = { type = "array", required = true },
       header_name = { type = "string", default = "x-user-info" },
     }
     ```  
  2. Update `handler.lua` for logic:  
     ```lua
     function plugin:access(conf)
       local user_info = kong.request.get_header(conf.header_name)
       if not user_info then
         return kong.response.exit(401, "Unauthorized")
       end
       -- Parse JSON and check roles
     end
     ```  
  3. Reload Kong: `docker-compose restart kong-api-gateway`.  
  4. Test: Send a request with header `x-user-info: {"roles": ["user"]}` – Should pass if role matches.  

**Pro Tip**: Integrate with auth service to populate `x-user-info`. For advanced, add Lua tests or use Kong's plugin dev kit.
```