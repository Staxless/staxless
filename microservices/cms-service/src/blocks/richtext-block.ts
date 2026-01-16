import { slateEditor } from '@payloadcms/richtext-slate';
import type { Block } from 'payload';

export const RichTextBlock: Block = {
  slug: 'richText',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: slateEditor({
        admin: {
          elements: ['h2', 'h3', 'ul', 'ol', 'link'],
          leaves: ['bold', 'italic', 'underline'],
        },
      }),
    },
  ],
  labels: {
    singular: 'Rich Text Block',
    plural: 'Rich Text Blocks',
  },
};
