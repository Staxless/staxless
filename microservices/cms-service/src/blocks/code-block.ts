import type { Block } from 'payload';

export const CodeBlock: Block = {
  slug: 'code',
  fields: [
    {
      name: 'code',
      type: 'textarea',
      required: true,
      label: 'Code',
    },
    {
      name: 'language',
      type: 'select',
      options: [
        { label: 'JavaScript', value: 'js' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'Python', value: 'py' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'Java', value: 'java' },
        { label: 'C++', value: 'cpp' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'js',
      label: 'Language',
    },
  ],
  labels: {
    singular: 'Code Block',
    plural: 'Code Blocks',
  },
};
