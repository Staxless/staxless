import { revalidatePath, revalidateTag } from 'next/cache';
import type { CollectionConfig } from 'payload';
import { isAdmin } from '../../access/is-admin'; // Assume this exists or create it

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: { width: '50%' },
          label: 'Name',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          admin: { width: '50%' },
          label: 'Slug',
          required: true,
        },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        revalidatePath(`/blog/${doc.slug}`);
        revalidateTag('blog-archives');
        if (doc.slug !== previousDoc?.slug) {
          revalidatePath(`/blog/${previousDoc?.slug}`);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        revalidatePath(`/blog/${doc.slug}`);
        revalidateTag('blog-archives');
      },
    ],
  },
};
