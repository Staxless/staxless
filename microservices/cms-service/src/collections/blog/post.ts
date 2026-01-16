import { revalidatePath } from 'next/cache';
import type { CollectionConfig } from 'payload';
import { isAdmin } from '../../access/is-admin';
import { publishedOnly } from '../../access/published-only';
import { CodeBlock } from '../../blocks/code-block';
import { MDXBlock } from '../../blocks/mdx-block';
import { RichTextBlock } from '../../blocks/richtext-block';
import richText from '../../fields/rich-text-field';
import { slugField } from '../../fields/slug-field';

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
      validate: false,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: false,
          admin: { width: '50%' },
        },
        {
          name: 'tags',
          type: 'text',
          hasMany: true,
          admin: { width: '50%' },
        },
      ],
    },
    richText({ name: 'description' }),
    {
      name: 'content',
      type: 'blocks',
      blocks: [CodeBlock, RichTextBlock, MDXBlock],
      required: false,
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      filterOptions: ({ id }) => ({ id: { not_in: [id] } }),
    },
    slugField(),
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'user',
      hasMany: true,
      required: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: false,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        try {
          if (doc._status !== 'published') {
            req.payload.logger.info('Skipping revalidation for draft post');
            return;
          }

          if (!doc.category) {
            req.payload.logger.warn(
              'Post has no category, skipping revalidation'
            );
            return;
          }

          const category = await req.payload
            .findByID({
              collection: 'categories',
              id: doc.category,
              depth: 0,
            })
            .catch((error) => {
              req.payload.logger.error(
                `Failed to find category ${doc.category}: ${error.message}`
              );
              return null;
            });

          if (!category) {
            req.payload.logger.warn(
              `Category ${doc.category} not found, skipping revalidation`
            );
            return;
          }

          if (doc.slug && category.slug) {
            revalidatePath(`/blog/${category.slug}/${doc.slug}`);
            req.payload.logger.info(
              `Revalidated: /blog/${category.slug}/${doc.slug}`
            );
          }

          if (
            operation === 'update' &&
            previousDoc &&
            previousDoc.category &&
            (doc.category !== previousDoc.category ||
              doc.slug !== previousDoc.slug)
          ) {
            const prevCategory = await req.payload
              .findByID({
                collection: 'categories',
                id: previousDoc.category,
                depth: 0,
              })
              .catch((error) => {
                req.payload.logger.error(
                  `Failed to find previous category: ${error.message}`
                );
                return null;
              });

            if (prevCategory && previousDoc.slug && prevCategory.slug) {
              revalidatePath(`/blog/${prevCategory.slug}/${previousDoc.slug}`);
              req.payload.logger.info(
                `Revalidated old path: /blog/${prevCategory.slug}/${previousDoc.slug}`
              );
            }
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          req.payload.logger.error(
            `Error in afterChange hook: ${error.message}`
          );
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        try {
          if (!doc.category) {
            req.payload.logger.warn('Deleted post had no category');
            return;
          }

          const category = await req.payload
            .findByID({
              collection: 'categories',
              id: doc.category,
              depth: 0,
            })
            .catch((error) => {
              req.payload.logger.error(
                `Failed to find category for deleted post: ${error.message}`
              );
              return null;
            });

          if (!category) {
            req.payload.logger.warn(
              `Category ${doc.category} not found after delete`
            );
            return;
          }

          if (category.slug) {
            revalidatePath(`/blog/${category.slug}`);

            if (doc.slug) {
              revalidatePath(`/blog/${category.slug}/${doc.slug}`);
            }

            req.payload.logger.info('Revalidated paths after delete');
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          req.payload.logger.error(
            `Error in afterDelete hook: ${error.message}`
          );
        }
      },
    ],
  },
};
