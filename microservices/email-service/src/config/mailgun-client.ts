/**
 * @file mailgunClient.ts
 * @description Mailgun client configuration and initialization
 */

import mailgun from 'mailgun-js';

/**
 * Interface defining the structure of email data for sending
 * @interface EmailData
 */
interface EmailData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  [key: string]: unknown;
}

/**
 * Interface defining the structure of the send response
 * @interface SendResponse
 */
interface SendResponse {
  id: string;
  message: string;
}

/**
 * Interface defining the structure of the Mailgun client
 * @interface MailgunClient
 */
export interface MailgunClient {
  /** Method to fetch template data by path */
  get: (path: string) => Promise<{ template: string }>;
  /** Method to access email sending functionality */
  messages: () => { send: (data: EmailData) => Promise<SendResponse> };
}

/**
 * Creates a Mailgun client instance with configured API key and domain
 * @function createMailgunClient
 * @returns {MailgunClient} A configured Mailgun client instance
 * @throws {Error} If MAILGUN_API_KEY or MAILGUN_DOMAIN environment variables are not set
 * @example
 * const client = createMailgunClient();
 * client.get('/templates/welcome').then(template =>  );
 */
export function createMailgunClient(): MailgunClient {
  if (!process.env.MAILGUN_API_KEY) {
    throw new Error('Missing MAILGUN_API_KEY');
  }
  if (!process.env.MAILGUN_DOMAIN) {
    throw new Error('Missing MAILGUN_DOMAIN');
  }

  return mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  }) as MailgunClient;
}

/**
 * Default Mailgun client instance
 * @constant mailgunClient
 * @type {MailgunClient}
 */
export const mailgunClient = createMailgunClient();
