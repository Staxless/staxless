import { slateEditor } from '@payloadcms/richtext-slate';
import type { Field } from 'payload';

export default function richText(options: { name: string }): Field {
  return {
    name: options.name,
    type: 'richText',
    editor: slateEditor({
      admin: {
        elements: ['h2', 'h3', 'ul', 'ol', 'link'],
        leaves: ['bold', 'italic', 'underline'],
      },
    }),
  };
}
