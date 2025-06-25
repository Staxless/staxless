/**
 * @file templateConfig.ts
 * @description Configuration for email templates used in the application
 */

/**
 * Interface defining the structure of a single template configuration
 * @interface TemplateConfig
 */
export interface TemplateConfig {
  /** The unique name of the template */
  templateName: string;
  /** Array of variable names required by the template */
  requiredVariables: string[];
  /** Subject line for emails using this template */
  subject: string;
}

/**
 * Interface for a map of template configurations
 * @interface TemplateConfigMap
 */
export interface TemplateConfigMap {
  /** Key-value pairs where key is template identifier and value is TemplateConfig */
  [key: string]: TemplateConfig;
}

/**
 * Configuration object containing all available email template configurations
 * @constant templateConfig
 * @type {TemplateConfigMap}
 */
export const templateConfig: TemplateConfigMap = {
  'magic-link': {
    templateName: 'magic-link',
    requiredVariables: ['token', 'link'],
    subject: 'Your Magic Link'
  },
  'welcome': {
    templateName: 'welcome-template',
    requiredVariables: ['name'],
    subject: 'Welcome to Our App!'
  },
  'purchase-confirmation': {
    templateName: 'purchase-confirmation-template',
    requiredVariables: ['orderId', 'items'],
    subject: 'Purchase Confirmation'
  }
};