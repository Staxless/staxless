```markdown
# Auth Service

The auth service (`microservices/auth-service/`) keeps your users secure with flexible login options, including OAuth and magic links. Let's explore how to set these up.

## OAuth
Supports multiple providers for social logins.  

- **Providers**: In `src/lib/providers/` (e.g., `google.ts`, `github.ts`). Each defines scopes and user mapping.  

- **Configuration**:  
  - `src/config/oauth-config.ts`: Sets redirect URIs and sessions.  
  - Env vars: `PROVIDER_CLIENT_ID`, `PROVIDER_CLIENT_SECRET` (e.g., for Google).  

- **Routes**: `src/routes/oauthRouter.ts` handles `/oauth/:provider` and callbacks.  

- **Steps to Set Up a Provider**:  
  1. Register app on provider's dev console (e.g., Google Cloud Console). Set redirect to `http://localhost:8000/oauth/google/callback`.  
  2. Add env vars:  
     ```bash
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```  
  3. Update `src/lib/providers/google.ts`:  
     ```typescript
     export const googleProvider = {
       clientId: process.env.GOOGLE_CLIENT_ID!,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       redirectUri: `${process.env.FRONTEND_URL}/oauth/google/callback`,
       scope: ['profile', 'email'],
     };
     ```  
  4. Test: Click OAuth button on frontend; it should redirect and create a session.  

- **Advanced**: Use `src/scripts/generate-provider.ts` to scaffold new providers: `node src/scripts/generate-provider.ts apple`.  

**Pro Tip**: Handle errors in `src/handlers/oauth-handlers.ts`. Monitor with `docker logs auth-service`.

## Magic Link
Passwordless login via email links.  

- **Implementation**:  
  - `src/routes/magicLinkRouter.ts`: Endpoints for requesting and verifying links.  
  - `src/handlers/magic-link-handlers.ts`: Generates tokens.  
  - `src/models/magicLinkModel.ts`: Stores tokens in MongoDB.  

- **Configuration**: `src/config/magic-link-config.ts` – Set `tokenExpiration: 3600` (seconds).  

- **Process**: Request link → Kafka event to email service → User clicks link → Validate token and create session.  

- **Steps**:  
  1. Ensure email service is configured.  
  2. Request via frontend or curl: `curl -X POST http://localhost:8000/magic-link/request -d '{"email": "test@example.com"}'`.  
  3. Verify: `curl http://localhost:8000/magic-link/verify?token=abc123`.  
  4. Customize email template in email service's `templateConfig`.  

**Pro Tip**: Use `src/consumers/handlers/handle-session-validation.ts` to debug validation. Set short expirations for testing.
```