/**
 * @file mailgunClient.ts
 * @description Mailgun client configuration and initialization using mailgun.js
 */
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { loadSecret } from '../lib/secrets-manager.js';

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
 * @throws {Error} If MAILGUN_API_KEY or MAILGUN_DOMAIN are not set
 * @example
 * const client = createMailgunClient();
 * client.messages().send({ from: '...', to: '...', subject: '...', text: '...' });
 */
export function createMailgunClient(): MailgunClient {
  const apiKey = loadSecret('MAILGUN_API_KEY') ?? process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey) {
    throw new Error('Missing MAILGUN_API_KEY');
  }
  if (!domain) {
    throw new Error('Missing MAILGUN_DOMAIN');
  }

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: apiKey });

  return {
    get: async (path: string) => {
      // Fetch template using the correct API structure
      const domainTemplates = await mg.domains.domainTemplates.list(domain);
      const template = domainTemplates.items?.find(
        (t: { name: string }) => t.name === path
      );
      return { template: template?.version?.template || '' };
    },
    messages: () => ({
      send: async (data: EmailData): Promise<SendResponse> => {
        // Build message data with proper structure
        const messageData = {
          to: [data.to],
          from: data.from,
          subject: data.subject,
          text: data.text || '',
          html: data.html,
        };

        // Use Record type assertion for compatibility
        const response = await mg.messages.create(
          domain,
          // @ts-expect-error
          messageData as Record<string, unknown>
        );

        return {
          id: response.id || '',
          message: response.message || 'Message sent',
        };
      },
    }),
  } as MailgunClient;
}

/**
 * Default Mailgun client instance
 * @constant mailgunClient
 * @type {MailgunClient}
 */
export const mailgunClient = createMailgunClient();
