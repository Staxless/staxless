```markdown
# Email Service

The email service (`microservices/email-service/`) delivers reliable transactional emails using Mailgun. Let's set it up and customize templates.

## Mailgun
Uses templates for consistent messaging.  

- **Configuration**: `src/config/emailConfig.ts` – Defines templates like 'magic-link'.  
- **Client**: `src/config/mailgunClient.ts` – Initializes with API key.  

- **Consumers**: `src/consumers/handlers/handle-send-magic-link.ts` – Processes Kafka events.  

- **Steps**:  
  1. Set `MAILGUN_API_KEY` and `MAILGUN_DOMAIN`.  
  2. Add a template: Update `templateConfig`:  
     ```typescript
     'reset-password': {
       templateName: 'reset-password',
       requiredVariables: ['link'],
       subject: 'Reset Your Password',
     },
     ```  
  3. Create handler: In `handlers/`, add `handle-reset-password.ts`.  
  4. Test: Produce Kafka message:  
     ```bash
     kafka-console-producer --topic email-events --broker-list localhost:9092 <<EOF
     {"key":"send.reset-password.email","value":"{\"email\":\"test@example.com\",\"variables\":{\"link\":\"http://reset-link\"}}"}
     EOF
     ```  

**Pro Tip**: Check Mailgun logs for bounces. Validate variables in `sendEmail` to avoid errors.
```