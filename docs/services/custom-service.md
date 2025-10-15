```markdown
# Creating a Custom Service

Adding a new service is straightforward—let's say for analytics. Here's how to integrate it with Kafka, the API Gateway, and the frontend.

## Kafka Integration
For event-driven communication.  

- **Setup**: `src/config/kafka-client.ts` – Creates producers/consumers.  

- **Steps**:  
  1. Add topic in `config/docker-compose.dev.yml` kafka-setup:  
     ```yaml
     kafka-topics --create --topic analytics-events --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1
     ```  
  2. Create consumer in `src/consumers/index.ts`:  
     ```typescript
     import { createConsumer } from '../config/kafka-client';
     const consumer = createConsumer('analytics-group');
     await consumer.subscribe({ topic: 'analytics-events' });
     await consumer.run({ eachMessage: async ({ message }) => { /* Handle */ } });
     ```  
  3. Produce events:  
     ```typescript
     const producer = createProducer();
     await producer.send({ topic: 'analytics-events', messages: [{ key: 'user.action', value: JSON.stringify(data) }] });
     ```  

**Pro Tip**: Use partitions for scaling. Debug with `kafka-console-consumer --topic analytics-events --bootstrap-server localhost:9092`.

## API Gateway Integration
Expose your service via Kong.  

- **Steps**:  
  1. Add to `kong.yaml`:  
     ```yaml
     services:
       - name: analytics-service
         url: http://analytics:8086
         routes:
           - paths: [/analytics]
     plugins:
       - name: rbac-auth
         config: { roles: ["user"] }
     ```  
  2. Expose port in Docker Compose: `ports: - "8086:8086"`.  
  3. Test: `curl http://localhost:8000/analytics/health`.  

**Pro Tip**: Use Kong's rate-limiting plugin for API protection.

## Frontend Integration
Connect to your service from the UI.  

- **Steps**:  
  1. Add action: `/frontend/src/app/actions/analytics.ts`:  
     ```typescript
     import axios from 'axios';
     export async function getAnalytics() {
       const res = await axios.get('/analytics/data', { headers: { 'x-user-info': JSON.stringify(user) } });
       return res.data;
     }
     ```  
  2. Use in component:  
     ```tsx
     import { getAnalytics } from '@/app/actions/analytics';
     const AnalyticsDashboard = async () => {
       const data = await getAnalytics();
       return <Chart data={data} />;
     };
     ```  
  3. Handle errors with toasts from `use-toast.ts`.  

**Pro Tip**: Use SWR for caching: `import useSWR from 'swr'; const { data } = useSWR('/analytics/data', fetcher);`.
```