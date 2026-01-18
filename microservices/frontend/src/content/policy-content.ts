// 📋 POLICY CONTENT MANAGEMENT
// Add new policies by creating entries in the policies object

export interface PolicySection {
  type: 'heading' | 'subheading' | 'paragraph' | 'list' | 'numbered-list';
  content: string;
  items?: string[];
}

export interface PolicyContent {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  content: PolicySection[];
}

const policies: Record<string, PolicyContent> = {
  privacy: {
    title: 'Privacy Policy',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'December 15, 2024',
    content: [
      {
        type: 'paragraph',
        content: `This Privacy Policy describes how ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'SaaS Starter'} ("we," "our," or "us") collects, uses, and shares your personal information when you use our service.`,
      },
      {
        type: 'heading',
        content: '1. Information We Collect',
      },
      {
        type: 'subheading',
        content: 'Information You Provide',
      },
      {
        type: 'paragraph',
        content:
          'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
      },
      {
        type: 'list',
        content: 'This may include:',
        items: [
          'Name and contact information (email address, phone number)',
          'Account credentials (username, password)',
          'Payment information (credit card details, billing address)',
          'Profile information and preferences',
          'Communications with our support team',
        ],
      },
      {
        type: 'subheading',
        content: 'Information We Collect Automatically',
      },
      {
        type: 'paragraph',
        content:
          'When you use our service, we automatically collect certain information about your device and usage patterns.',
      },
      {
        type: 'list',
        content: 'This includes:',
        items: [
          'Device information (IP address, browser type, operating system)',
          'Usage data (pages visited, features used, time spent)',
          'Log data (access times, error logs, performance metrics)',
          'Cookies and similar tracking technologies',
        ],
      },
      {
        type: 'heading',
        content: '2. How We Use Your Information',
      },
      {
        type: 'paragraph',
        content:
          'We use the information we collect to provide, maintain, and improve our service.',
      },
      {
        type: 'numbered-list',
        content: 'Specifically, we use your information to:',
        items: [
          'Provide and deliver the services you request',
          'Process transactions and send related information',
          'Send technical notices, updates, and support messages',
          'Respond to your comments, questions, and customer service requests',
          'Monitor and analyze trends, usage, and activities',
          'Detect, investigate, and prevent fraudulent transactions',
          'Personalize and improve our service',
        ],
      },
      {
        type: 'heading',
        content: '3. Information Sharing',
      },
      {
        type: 'paragraph',
        content:
          'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.',
      },
      {
        type: 'subheading',
        content: 'Service Providers',
      },
      {
        type: 'paragraph',
        content:
          'We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, and customer service.',
      },
      {
        type: 'subheading',
        content: 'Legal Requirements',
      },
      {
        type: 'paragraph',
        content:
          'We may disclose your information if required to do so by law or in response to valid requests by public authorities.',
      },
      {
        type: 'heading',
        content: '4. Data Security',
      },
      {
        type: 'paragraph',
        content:
          'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      },
      {
        type: 'heading',
        content: '5. Your Rights',
      },
      {
        type: 'paragraph',
        content:
          'Depending on your location, you may have certain rights regarding your personal information:',
      },
      {
        type: 'list',
        content: 'These rights may include:',
        items: [
          'Access to your personal information',
          'Correction of inaccurate information',
          'Deletion of your personal information',
          'Restriction of processing',
          'Data portability',
          'Objection to processing',
        ],
      },
      {
        type: 'heading',
        content: '6. Contact Us',
      },
      {
        type: 'paragraph',
        content:
          'If you have any questions about this Privacy Policy, please contact us using the information provided at the bottom of this page.',
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'December 15, 2024',
    content: [
      {
        type: 'paragraph',
        content: `These Terms of Service ("Terms") govern your use of the ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'SaaS Starter'} service. By using our service, you agree to these Terms.`,
      },
      {
        type: 'heading',
        content: '1. Acceptance of Terms',
      },
      {
        type: 'paragraph',
        content:
          'By accessing or using our service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use our service.',
      },
      {
        type: 'heading',
        content: '2. Description of Service',
      },
      {
        type: 'paragraph',
        content:
          'Our service provides a software-as-a-service platform that enables users to build and manage their applications. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.',
      },
      {
        type: 'heading',
        content: '3. User Accounts',
      },
      {
        type: 'paragraph',
        content:
          'To use certain features of our service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      },
      {
        type: 'list',
        content: 'You agree to:',
        items: [
          'Provide accurate and complete information when creating your account',
          'Keep your account information up to date',
          'Maintain the security of your password',
          'Notify us immediately of any unauthorized use of your account',
        ],
      },
      {
        type: 'heading',
        content: '4. Acceptable Use',
      },
      {
        type: 'paragraph',
        content:
          'You agree to use our service only for lawful purposes and in accordance with these Terms.',
      },
      {
        type: 'list',
        content: 'You agree not to:',
        items: [
          'Use the service for any illegal or unauthorized purpose',
          'Violate any applicable laws or regulations',
          'Infringe on the rights of others',
          'Transmit any harmful or malicious code',
          'Attempt to gain unauthorized access to our systems',
          'Interfere with or disrupt the service',
        ],
      },
      {
        type: 'heading',
        content: '5. Payment Terms',
      },
      {
        type: 'paragraph',
        content:
          'Certain features of our service require payment. By purchasing a subscription, you agree to pay all applicable fees as described on our pricing page.',
      },
      {
        type: 'list',
        content: 'Payment terms:',
        items: [
          'Fees are charged in advance on a recurring basis',
          'All fees are non-refundable except as required by law',
          'We may change our fees with 30 days notice',
          'You are responsible for all taxes and fees',
        ],
      },
      {
        type: 'heading',
        content: '6. Intellectual Property',
      },
      {
        type: 'paragraph',
        content:
          'The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
      },
      {
        type: 'heading',
        content: '7. Termination',
      },
      {
        type: 'paragraph',
        content:
          'We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.',
      },
      {
        type: 'heading',
        content: '8. Disclaimer of Warranties',
      },
      {
        type: 'paragraph',
        content:
          'The service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      },
      {
        type: 'heading',
        content: '9. Limitation of Liability',
      },
      {
        type: 'paragraph',
        content:
          'In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
      },
      {
        type: 'heading',
        content: '10. Changes to Terms',
      },
      {
        type: 'paragraph',
        content:
          'We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last Updated" date.',
      },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'December 15, 2024',
    content: [
      {
        type: 'paragraph',
        content: `This Cookie Policy explains how ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'SaaS Starter'} uses cookies and similar technologies when you visit our website or use our service.`,
      },
      {
        type: 'heading',
        content: '1. What Are Cookies',
      },
      {
        type: 'paragraph',
        content:
          'Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, which can make your next visit easier and the site more useful to you.',
      },
      {
        type: 'heading',
        content: '2. Types of Cookies We Use',
      },
      {
        type: 'subheading',
        content: 'Essential Cookies',
      },
      {
        type: 'paragraph',
        content:
          'These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.',
      },
      {
        type: 'subheading',
        content: 'Performance Cookies',
      },
      {
        type: 'paragraph',
        content:
          'These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve how our website works.',
      },
      {
        type: 'subheading',
        content: 'Functionality Cookies',
      },
      {
        type: 'paragraph',
        content:
          'These cookies allow the website to remember choices you make and provide enhanced, more personal features.',
      },
      {
        type: 'subheading',
        content: 'Targeting Cookies',
      },
      {
        type: 'paragraph',
        content:
          'These cookies are used to deliver advertisements more relevant to you and your interests.',
      },
      {
        type: 'heading',
        content: '3. How We Use Cookies',
      },
      {
        type: 'list',
        content: 'We use cookies to:',
        items: [
          'Keep you signed in to your account',
          'Remember your preferences and settings',
          'Analyze how our service is used',
          'Improve our service performance',
          'Provide personalized content',
          'Measure the effectiveness of our marketing',
        ],
      },
      {
        type: 'heading',
        content: '4. Third-Party Cookies',
      },
      {
        type: 'paragraph',
        content:
          'We may also use third-party services that place cookies on your device. These services include analytics providers, advertising networks, and social media platforms.',
      },
      {
        type: 'heading',
        content: '5. Managing Cookies',
      },
      {
        type: 'paragraph',
        content:
          'Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience of our service.',
      },
      {
        type: 'list',
        content: 'You can:',
        items: [
          'Delete existing cookies from your browser',
          'Block cookies from being set',
          'Set your browser to notify you when cookies are being sent',
          'Use browser extensions to manage cookies',
        ],
      },
      {
        type: 'heading',
        content: '6. Updates to This Policy',
      },
      {
        type: 'paragraph',
        content:
          'We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.',
      },
    ],
  },

  dpa: {
    title: 'Data Processing Agreement',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'December 15, 2024',
    content: [
      {
        type: 'paragraph',
        content: `This Data Processing Agreement ("DPA") forms part of the Terms of Service between you and ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'SaaS Starter'} and governs the processing of personal data in accordance with applicable data protection laws.`,
      },
      {
        type: 'heading',
        content: '1. Definitions',
      },
      {
        type: 'paragraph',
        content:
          'Terms used in this DPA have the meanings given to them in the General Data Protection Regulation (GDPR) and other applicable data protection laws.',
      },
      {
        type: 'heading',
        content: '2. Scope and Application',
      },
      {
        type: 'paragraph',
        content:
          'This DPA applies to the processing of personal data by us on your behalf in connection with the provision of our services.',
      },
      {
        type: 'heading',
        content: '3. Data Processing Details',
      },
      {
        type: 'subheading',
        content: 'Categories of Data Subjects',
      },
      {
        type: 'list',
        content:
          'Personal data may relate to the following categories of data subjects:',
        items: [
          'Your employees, contractors, and authorized users',
          'Your customers and end users',
          'Visitors to your websites or applications',
        ],
      },
      {
        type: 'subheading',
        content: 'Types of Personal Data',
      },
      {
        type: 'list',
        content: 'We may process the following types of personal data:',
        items: [
          'Contact information (names, email addresses, phone numbers)',
          'Account information (usernames, passwords, preferences)',
          'Usage data (activity logs, feature usage, performance metrics)',
          'Technical data (IP addresses, device information, browser data)',
        ],
      },
      {
        type: 'heading',
        content: '4. Our Obligations as Data Processor',
      },
      {
        type: 'list',
        content: 'We will:',
        items: [
          'Process personal data only on your documented instructions',
          'Ensure confidentiality of personal data',
          'Implement appropriate technical and organizational security measures',
          'Assist you in responding to data subject requests',
          'Notify you of any personal data breaches without undue delay',
          'Delete or return personal data upon termination of services',
        ],
      },
      {
        type: 'heading',
        content: '5. Your Obligations as Data Controller',
      },
      {
        type: 'list',
        content: 'You will:',
        items: [
          'Ensure you have a lawful basis for processing personal data',
          'Provide clear instructions for data processing',
          'Ensure data subjects have been informed about the processing',
          'Respond to data subject requests in accordance with applicable law',
          'Notify relevant supervisory authorities of data breaches where required',
        ],
      },
      {
        type: 'heading',
        content: '6. Security Measures',
      },
      {
        type: 'paragraph',
        content:
          'We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Encryption of personal data in transit and at rest',
          'Regular security assessments and penetration testing',
          'Access controls and authentication mechanisms',
          'Employee training on data protection',
          'Incident response procedures',
        ],
      },
      {
        type: 'heading',
        content: '7. Sub-processors',
      },
      {
        type: 'paragraph',
        content:
          'We may engage sub-processors to assist in providing our services. We will ensure that any sub-processors are bound by data protection obligations equivalent to those in this DPA.',
      },
      {
        type: 'heading',
        content: '8. International Transfers',
      },
      {
        type: 'paragraph',
        content:
          'If we transfer personal data outside the European Economic Area, we will ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions.',
      },
    ],
  },

  'acceptable-use': {
    title: 'Acceptable Use Policy',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'December 15, 2024',
    content: [
      {
        type: 'paragraph',
        content: `This Acceptable Use Policy governs your use of ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'SaaS Starter'} services and is incorporated into our Terms of Service.`,
      },
      {
        type: 'heading',
        content: '1. General Principles',
      },
      {
        type: 'paragraph',
        content:
          'You must use our services in a manner that is lawful, ethical, and respectful of others. You are responsible for all activity that occurs under your account.',
      },
      {
        type: 'heading',
        content: '2. Prohibited Uses',
      },
      {
        type: 'subheading',
        content: 'Illegal Activities',
      },
      {
        type: 'list',
        content: 'You may not use our services for:',
        items: [
          'Any illegal activities or to facilitate illegal activities',
          'Violating any applicable laws or regulations',
          'Infringing on intellectual property rights',
          'Fraud, money laundering, or other financial crimes',
        ],
      },
      {
        type: 'subheading',
        content: 'Harmful Content',
      },
      {
        type: 'list',
        content: 'You may not upload, transmit, or distribute:',
        items: [
          'Malware, viruses, or other malicious code',
          'Content that is defamatory, harassing, or threatening',
          'Spam or unsolicited commercial communications',
          'Content that promotes violence or illegal activities',
        ],
      },
      {
        type: 'subheading',
        content: 'System Abuse',
      },
      {
        type: 'list',
        content: 'You may not:',
        items: [
          'Attempt to gain unauthorized access to our systems',
          'Interfere with or disrupt our services',
          'Use automated tools to access our services without permission',
          'Reverse engineer or attempt to extract source code',
        ],
      },
      {
        type: 'heading',
        content: '3. Resource Usage',
      },
      {
        type: 'paragraph',
        content:
          'You must use our services in accordance with the resource limits of your subscription plan. Excessive usage that impacts service performance for other users is prohibited.',
      },
      {
        type: 'heading',
        content: '4. Content Standards',
      },
      {
        type: 'paragraph',
        content:
          'All content you upload or transmit through our services must comply with applicable laws and must not:',
      },
      {
        type: 'list',
        content: '',
        items: [
          "Violate any person's privacy or publicity rights",
          'Contain false or misleading information',
          'Infringe on copyrights, trademarks, or other intellectual property',
          'Contain adult content without appropriate age restrictions',
        ],
      },
      {
        type: 'heading',
        content: '5. Reporting Violations',
      },
      {
        type: 'paragraph',
        content:
          'If you become aware of any violation of this policy, please report it to us immediately. We investigate all reports and take appropriate action.',
      },
      {
        type: 'heading',
        content: '6. Enforcement',
      },
      {
        type: 'paragraph',
        content:
          'We reserve the right to investigate suspected violations of this policy. Violations may result in:',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Warning or notice of violation',
          'Temporary suspension of services',
          'Permanent termination of account',
          'Legal action where appropriate',
        ],
      },
      {
        type: 'heading',
        content: '7. Changes to This Policy',
      },
      {
        type: 'paragraph',
        content:
          'We may update this Acceptable Use Policy from time to time. Continued use of our services after changes constitutes acceptance of the updated policy.',
      },
    ],
  },

  sla: {
    title: 'Service Level Agreement',
    effectiveDate: 'January 1, 2024',
    lastUpdated: 'December 15, 2024',
    content: [
      {
        type: 'paragraph',
        content: `This Service Level Agreement ("SLA") describes the service levels that ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'SaaS Starter'} will provide to customers.`,
      },
      {
        type: 'heading',
        content: '1. Service Availability',
      },
      {
        type: 'paragraph',
        content:
          'We commit to maintaining the following service availability levels:',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Production services: 99.9% uptime per month',
          'API endpoints: 99.9% availability per month',
          'Dashboard and web interface: 99.5% availability per month',
        ],
      },
      {
        type: 'heading',
        content: '2. Performance Standards',
      },
      {
        type: 'subheading',
        content: 'Response Times',
      },
      {
        type: 'list',
        content: 'We aim to maintain the following response times:',
        items: [
          'API requests: < 200ms average response time',
          'Dashboard page loads: < 2 seconds',
          'Database queries: < 100ms average',
        ],
      },
      {
        type: 'subheading',
        content: 'Support Response Times',
      },
      {
        type: 'list',
        content: 'Support ticket response times by priority:',
        items: [
          'Critical issues: 2 hours',
          'High priority: 8 hours',
          'Medium priority: 24 hours',
          'Low priority: 72 hours',
        ],
      },
      {
        type: 'heading',
        content: '3. Scheduled Maintenance',
      },
      {
        type: 'paragraph',
        content:
          'We may perform scheduled maintenance during designated maintenance windows. We will provide at least 48 hours notice for any scheduled maintenance that may affect service availability.',
      },
      {
        type: 'heading',
        content: '4. Service Credits',
      },
      {
        type: 'paragraph',
        content:
          'If we fail to meet the service availability commitments, you may be eligible for service credits:',
      },
      {
        type: 'list',
        content: '',
        items: [
          '99.0% - 99.9% availability: 10% service credit',
          '95.0% - 99.0% availability: 25% service credit',
          'Below 95.0% availability: 50% service credit',
        ],
      },
      {
        type: 'heading',
        content: '5. Exclusions',
      },
      {
        type: 'paragraph',
        content: 'This SLA does not apply to service unavailability caused by:',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Scheduled maintenance with proper notice',
          'Issues caused by your applications or configurations',
          'Third-party service provider outages',
          'Force majeure events',
          'Network connectivity issues outside our control',
        ],
      },
      {
        type: 'heading',
        content: '6. Monitoring and Reporting',
      },
      {
        type: 'paragraph',
        content:
          'We continuously monitor our services and maintain detailed logs of service availability and performance. Monthly service reports are available upon request.',
      },
      {
        type: 'heading',
        content: '7. Incident Response',
      },
      {
        type: 'paragraph',
        content: 'In the event of a service incident, we will:',
      },
      {
        type: 'numbered-list',
        content: '',
        items: [
          'Acknowledge the incident within 15 minutes of detection',
          'Provide regular status updates during resolution',
          'Conduct a post-incident review for major incidents',
          'Implement measures to prevent similar incidents',
        ],
      },
      {
        type: 'heading',
        content: '8. Service Credit Claims',
      },
      {
        type: 'paragraph',
        content:
          'To claim service credits, you must submit a request within 30 days of the incident. Service credits will be applied to your next billing cycle and cannot exceed 50% of your monthly service fees.',
      },
    ],
  },
};

export function getPolicyContent(slug: string): PolicyContent | null {
  return policies[slug] || null;
}

export function getAllPolicySlugs(): string[] {
  return Object.keys(policies);
}
