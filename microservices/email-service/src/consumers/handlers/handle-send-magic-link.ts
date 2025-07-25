// File: /microservices/email-service/src/consumers/handlers/handle-send-magic-link.ts
// Action: CREATE new file

import type { KafkaMessage } from 'kafkajs';
import createEmailService from '../../config/email-service'; // Adjust path if necessary
import { mailgunClient } from '../../config/mailgun-client'; // Adjust path if necessary

const { sendEmail } = createEmailService(mailgunClient);

export default async function handleSendMagicLink(message: KafkaMessage) {
  const { email, variables } = JSON.parse(message.value?.toString());

  try {
    await sendEmail({
      templateKey: 'magic-link',
      email,
      variables,
    });
  } catch {
    throw new Error(
      `[Email Consumer] Failed to send magic link email to ${email}`
    );
    // Implement retry or DLQ logic here
  }
}
