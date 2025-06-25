// File: /microservices/email-service/src/consumers/handlers/handle-send-magic-link.ts
// Action: CREATE new file

import { KafkaMessage } from 'kafkajs';
import createEmailService from '../../config/emailService'; // Adjust path if necessary
import { mailgunClient } from '../../config/mailgunClient'; // Adjust path if necessary

const { sendEmail } = createEmailService(mailgunClient);

export default async function handleSendMagicLink(message: KafkaMessage) {
    const { email, variables } = JSON.parse(message.value!.toString());
    
    try {
        await sendEmail({
            templateKey: 'magic-link',
            email: email,
            variables: variables
        });
        console.log(`[Email Consumer] Magic link email sent to ${email}`);
    } catch (error) {
        console.error(`[Email Consumer] Failed to send magic link email to ${email}`, error);
        // Implement retry or DLQ logic here
    }
}