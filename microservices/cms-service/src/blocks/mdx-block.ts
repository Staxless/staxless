import type { Block } from 'payload';

export const MDXBlock: Block = {
  slug: 'mdx',
  fields: [
    {
      name: 'mdxContent',
      type: 'textarea',
      required: true,
      label: 'MDX Content',
      admin: {
        description:
          'Enter MDX (Markdown with JSX) here. Will be rendered on the frontend.',
      },
    },
  ],
  labels: {
    singular: 'MDX Block',
    plural: 'MDX Blocks',
  },
};
