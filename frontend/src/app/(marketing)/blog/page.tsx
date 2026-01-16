export const revalidate = 60;
// Force dynamic rendering to ensure the function runs
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import BlogClient from '@/components/blog/blog-client';
import { type BlogPostPayloadItem, getPublishedPosts } from '@/lib/payload';

// Define types for rich text nodes
type RichTextNode = {
  text?: string;
  children?: RichTextNode[];
  [key: string]: unknown;
};

// Define extractPlainText function
function extractPlainText(nodes: unknown): string {
  if (!(nodes && Array.isArray(nodes))) return '';

  return (nodes as RichTextNode[])
    .map((node: RichTextNode) => {
      if (node.text) {
        return node.text;
      }
      if (node.children) {
        return extractPlainText(node.children);
      }
      return '';
    })
    .join(' ')
    .trim();
}

export const metadata: Metadata = {
  title: 'Blog | Latest Articles and Insights',
  description:
    'Discover our latest blog posts, articles, and insights on technology, development, and industry trends.',
  openGraph: {
    title: 'Blog | Latest Articles and Insights',
    description:
      'Discover our latest blog posts, articles, and insights on technology, development, and industry trends.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Latest Articles and Insights',
    description:
      'Discover our latest blog posts, articles, and insights on technology, development, and industry trends.',
  },
};

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  category: { name: string; slug: string };
  image?: { url: string; alt?: string };
  metaDescription?: string;
  readTime?: number;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  console.log('=====================================');
  console.log('🚀 getBlogPosts FUNCTION CALLED');
  console.log('🕐 Time:', new Date().toISOString());
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('=====================================');

  try {
    console.log('📞 About to call getPublishedPosts...');
    const posts = await getPublishedPosts(1, 100);

    console.log(`✅ getPublishedPosts returned ${posts.length} posts`);

    if (posts.length === 0) {
      console.warn('⚠️ WARNING: No posts returned from getPublishedPosts');
      console.warn('⚠️ This could mean:');
      console.warn('   1. No posts in database');
      console.warn('   2. No posts with _status: "published"');
      console.warn('   3. No posts with publishedDate set');
      console.warn('   4. API connection issue');
      return [];
    }

    // Log first post for debugging
    console.log('📝 First post sample:', {
      id: posts[0].id,
      title: posts[0].title,
      slug: posts[0].slug,
      hasCategory: !!posts[0].category,
      categoryType: typeof posts[0].category,
      hasDescription: !!posts[0].description,
      hasImage: !!posts[0].image,
    });

    const mappedPosts: BlogPost[] = posts.map(
      (post: BlogPostPayloadItem, index: number): BlogPost => {
        try {
          // Extract and validate readTime
          const readTime: number | undefined =
            typeof post.readTime === 'number' ? post.readTime : undefined;

          // Extract and validate category
          const category =
            typeof post.category === 'string'
              ? { name: 'Uncategorized', slug: 'uncategorized' }
              : {
                  name: post.category?.name || 'Uncategorized',
                  slug: post.category?.slug || 'uncategorized',
                };

          // Extract and validate image - CONVERT TO RELATIVE URL
          const image =
            typeof post.image === 'string'
              ? undefined
              : post.image?.url
                ? {
                    // Remove domain from URL to make it relative
                    url: post.image.url.replace(/^https?:\/\/[^/]+/, ''),
                    alt: post.image.alt,
                  }
                : undefined;

          // Extract description
          const description = post.description
            ? extractPlainText(post.description)
            : post.metaDescription || 'No description available';

          if (index === 0) {
            console.log('✅ Successfully mapped first post:', {
              title: post.title,
              category: category.name,
              hasImage: !!image,
              imageUrl: image?.url,
              descriptionLength: description.length,
            });
          }

          // Return the BlogPost object
          return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            metaDescription: post.metaDescription,
            readTime,
            description,
            category,
            image,
            publishedDate: new Date(post.publishedDate).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
          };
        } catch (mappingError) {
          console.error(`❌ Error mapping post ${index}:`, mappingError);
          console.error('Post data:', JSON.stringify(post, null, 2));
          throw mappingError;
        }
      }
    );

    console.log(`✅ Successfully mapped ${mappedPosts.length} posts`);
    console.log('=====================================');
    return mappedPosts;
  } catch (error) {
    console.error('=====================================');
    console.error('❌ CRITICAL ERROR in getBlogPosts');
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('❌ Message:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    console.error('=====================================');
    return [];
  }
}

export default async function BlogPage() {
  console.log('');
  console.log('═════════════════════════════════════');
  console.log('🎨 BlogPage COMPONENT RENDERING');
  console.log('🕐 Time:', new Date().toISOString());
  console.log('═════════════════════════════════════');

  const posts = await getBlogPosts();

  console.log('═════════════════════════════════════');
  console.log(`📊 BlogPage passing ${posts.length} posts to client`);
  console.log('═════════════════════════════════════');
  console.log('');

  return <BlogClient posts={posts} />;
}
