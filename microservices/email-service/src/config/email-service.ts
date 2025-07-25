/**
 * @file emailService.ts
 * @description Email service implementation for sending templated emails
 */

import { type TemplateConfigMap, templateConfig } from './email-config';

/**
 * Interface defining the parameters required to send an email
 * @interface SendEmailParams
 */
export interface SendEmailParams {
  /** The key identifying the email template to use */
  templateKey: string;
  /** The recipient's email address */
  email: string;
  /** Object containing key-value pairs for template variables */
  variables: Record<string, string | number | boolean>;
}

/**
 * Interface defining the email service contract
 * @interface EmailService
 */
export interface EmailService {
  /** Method to send an email with the specified parameters */
  sendEmail: (params: SendEmailParams) => Promise<unknown>;
  /** Map of available template configurations */
  templateConfig: TemplateConfigMap;
}

/**
 * Creates an email service instance with the provided email client
 * @function createEmailService
 * @param emailClient - The email client implementation
 * @param {Object} emailClient.get - Method to fetch template data by path
 * @param {Function} emailClient.messages - Method to access email sending functionality
 * @returns {EmailService} An email service instance
 * @example
 * const emailClient = {
 *   get: async (path) => ({ template: 'template content' }),
 *   messages: () => ({ send: async (data) => ({ status: 'sent' }) })
 * };
 * const emailService = createEmailService(emailClient);
 */
export function createEmailService(emailClient: {
  get: (path: string) => Promise<{ template: string }>;
  messages: () => { send: (data: Record<string, unknown>) => Promise<unknown> };
}): EmailService {
  /**
   * Sends an email using the specified template and variables
   * @param params - Parameters for sending the email
   * @param {string} params.templateKey - The key identifying the email template
   * @param {string} params.email - The recipient's email address
   * @param {Record<string, any>} params.variables - Template variables
   * @returns {Promise<any>} A promise that resolves when the email is sent successfully
   * @throws {Error} If the template key is invalid or required variables are missing
   * @example
   * await sendEmail({
   *   templateKey: 'welcome',
   *   email: 'user@example.com',
   *   variables: { name: 'John Doe' }
   * });
   */
  async function sendTemplatedEmail({
    templateKey,
    email,
    variables,
  }: SendEmailParams): Promise<unknown> {
    const config = templateConfig[templateKey];
    if (!config) {
      throw new Error('Invalid template key');
    }

    // Validate required variables
    const missingVars = config.requiredVariables.filter(
      (key: string) => !(key in variables)
    );
    if (missingVars.length > 0) {
      throw new Error(`Missing variables: ${missingVars.join(', ')}`);
    }

    const data = {
      from: `Your App <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: config.subject,
      template: config.templateName,
      'h:X-Mailgun-Variables': JSON.stringify(
        Object.entries(variables).reduce(
          (acc: Record<string, string | number | boolean>, [key, value]) => {
            acc[`${key}`] = value;
            return acc;
          },
          {}
        )
      ),
    };
    return await emailClient.messages().send(data);
  }

  return { sendEmail: sendTemplatedEmail, templateConfig };
}

/**
 * Default export of the createEmailService instance factory function
 * @default
 */
export default createEmailService;
