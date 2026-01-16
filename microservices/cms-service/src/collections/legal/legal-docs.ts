import type { CollectionConfig } from 'payload';

export const LegalDocs: CollectionConfig = {
  slug: 'legal-docs',
  labels: {
    singular: 'Legal Document',
    plural: 'Legal Documents',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'lastUpdated'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
      validate: false,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Metadata',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Used in the URL (e.g. "privacy-policy"). Automatically generated from title.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Short summary of the document purpose.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                description:
                  'Used in the URL (e.g. "privacy-policy"). Automatically generated from title.',
              },
            },
            {
              name: 'icon',
              type: 'select',
              required: false,
              defaultValue: 'file-text',
              options: [
                { label: 'Eye', value: 'eye' },
                { label: 'File Text', value: 'file-text' },
                { label: 'Cookie', value: 'cookie' },
                { label: 'Shield', value: 'shield' },
                { label: 'Users', value: 'users' },
                { label: 'Scale', value: 'scale' },
              ],
              admin: {
                description:
                  'Used for display icon in the frontend. Match to your icon set.',
              },
            },
            {
              name: 'lastUpdated',
              type: 'date',
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayOnly',
                },
                description: 'Date this document was last updated.',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: false,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) {
          return data;
        }

        if (data?.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        }

        if (operation === 'create' && !data.lastUpdated) {
          data.lastUpdated = new Date().toISOString();
        }

        if (operation === 'update' && data._status === 'published') {
          data.lastUpdated = new Date().toISOString();
        }

        return data;
      },
    ],
  },
};
