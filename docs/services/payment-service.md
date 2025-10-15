```markdown
# Payment Service

The payment service (`microservices/stripe-service/`) makes monetization simple with Stripe. Let's set it up and explore its features.

## Stripe Integration
Handles products, checkouts, and webhooks.  

- **Routes**:  
  - `GET /products`: Lists products with prices.  
  - `POST /checkout`: Creates sessions.  
  - `POST /webhook`: Processes events like `checkout.session.completed`.  

- **Configuration**: Env vars `STRIPE_PRIVATE_KEY`, `STRIPE_WEBHOOK_SECRET`.  

- **Steps to Set Up**:  
  1. Create products in Stripe dashboard (e.g., 'Pro Subscription' with price ID).  
  2. Update `src/routes/stripe-routes.ts` for custom metadata.  
  3. Configure webhook in Stripe: Endpoint `https://your-domain.com/webhook`, events `checkout.session.completed`.  
  4. Test checkout: `curl -X POST http://localhost:8000/checkout -d '{"productId": "prod_123", "quantity": 1}' -H "x-user-info: {\"user_id\": \"123\"}"`.  
  5. Handle webhooks in `src/routes/stripe-webhook-routes.ts`: Publishes to Kafka for user updates.  

**Pro Tip**: Use Stripe CLI for local testing: `stripe listen --forward-to http://localhost:8083/webhook`. Mock events with `stripe trigger checkout.session.completed`.
```