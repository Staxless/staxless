import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostClient } from '@/components/blog/blog-post-client';
import {
  type BlogPostPayloadItem,
  getAllSlugs,
  getItemBySlug,
} from '@/lib/payload';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = await getAllSlugs('posts');
  return slugs.map(({ slug, categorySlug }) => ({
    category: categorySlug,
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getItemBySlug<BlogPostPayloadItem>(
    'posts',
    resolvedParams.slug
  );

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Get image URL and convert to relative
  const imageUrl =
    typeof post.image !== 'string' && post.image?.url
      ? post.image.url.replace(/^https?:\/\/[^/]+/, '')
      : undefined;

  return {
    title: post.title,
    description: post.metaDescription || post.title,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.title,
      type: 'article',
      publishedTime: post.publishedDate,
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.title,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getItemBySlug<BlogPostPayloadItem>(
    'posts',
    resolvedParams.slug
  );

  if (!post) {
    notFound();
  }

  // Convert image URL to relative if it exists
  const imageUrl =
    typeof post.image !== 'string' && post.image?.url
      ? post.image.url.replace(/^https?:\/\/[^/]+/, '')
      : undefined;

  const imageAlt =
    typeof post.image !== 'string' && post.image?.alt
      ? post.image.alt
      : undefined;

  // Get category info
  const category =
    typeof post.category === 'string'
      ? { name: 'Uncategorized', slug: 'uncategorized' }
      : {
          name: post.category?.name || 'Uncategorized',
          slug: post.category?.slug || 'uncategorized',
        };

  // Get authors info
  const authors = (post.authors || []).map((author) => {
    if (typeof author === 'string') {
      return {
        id: author,
        firstname: 'Unknown',
        email: '',
      };
    }
    return {
      id: author.id,
      firstname: author.name || 'Unknown',
      lastname: '',
      email: author.email,
    };
  });

  // Get related posts info
  const relatedPosts = (post.relatedPosts || [])
    .map((related) => {
      if (typeof related === 'string') {
        return null;
      }

      const relatedCategory =
        typeof related.category === 'string'
          ? { slug: 'uncategorized' }
          : { slug: related.category?.slug || 'uncategorized' };

      return {
        id: related.id,
        title: related.title,
        slug: related.slug,
        category: relatedCategory,
      };
    })
    .filter((post): post is NonNullable<typeof post> => post !== null);

  // Extract plain text from description if it exists
  type RichTextNode = {
    text?: string;
    children?: RichTextNode[];
    [key: string]: unknown;
  };

  const extractPlainText = (nodes: RichTextNode[]): string => {
    if (!Array.isArray(nodes)) return '';
    return nodes
      .map((node: RichTextNode) => {
        if (node.text) return node.text;
        if (node.children) return extractPlainText(node.children);
        return '';
      })
      .join(' ')
      .trim();
  };

  const description = post.description
    ? extractPlainText(post.description as unknown as RichTextNode[])
    : null;

  return (
    <BlogPostClient
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        description: description
          ? [{ children: [{ text: description }] }]
          : null,
        content: post.content as unknown as never,
        publishedDate: new Date(post.publishedDate).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        ),
        category,
        image: imageUrl
          ? { url: imageUrl, alt: imageAlt }
          : { url: '', alt: '' },
        authors,
        relatedPosts,
        metaDescription: post.metaDescription,
      }}
    />
  );
}
