```markdown
# CMS Service

The CMS service (`microservices/cms-service/`) lets you manage content effortlessly with Payload CMS. Here's how to get it running and customize it.

## Payload CMS
A headless CMS for users, media, and custom collections.  

- **Configuration**: `src/payload.config.ts` – Defines editor (Lexical), DB adapter, and collections.  

- **Collections**:  
  - `User`: In `src/collections/system/User.ts` – Fields like email, roles.  
  - `Media`: For uploads.  

- **Access Controls**: `src/access/` – e.g., `isAdmin.ts` for role checks.  

- **Steps**:  
  1. Set `PAYLOAD_SECRET` and `DATABASE_URI`.  
  2. Add a collection: Create `src/collections/MyCollection.ts`:  
     ```typescript
     import { CollectionConfig } from 'payload';
     export const MyCollection: CollectionConfig = {
       slug: 'my-collection',
       fields: [{ name: 'title', type: 'text' }],
       access: { read: () => true },
     };
     ```  
     Add to `payload.config.ts`: `collections: [...systemCollections, MyCollection]`.  
  3. Log in at [http://localhost:8085/admin](http://localhost:8085/admin) – Default user from seed or registration.  
  4. Query GraphQL: `http://localhost:8085/api/graphql` (e.g., `{ Users { docs { email } } }`).  

**Pro Tip**: Use `src/lib/userAuthStrategy.ts` for custom auth. Extend with plugins like `payload-cloud-plugin`.
```