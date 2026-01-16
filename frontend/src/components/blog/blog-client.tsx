'use client';

import { FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

// Updated interface to match what's passed from server
interface BlogPost {
  id: string;
  title: string;
  description: string; // Changed from DescriptionNode[] to plain string
  slug: string;
  publishedDate: string;
  category: { name: string; slug: string };
  image?: { url: string; alt?: string };
  metaDescription?: string;
  readTime?: number;
}

interface BlogClientProps {
  posts: BlogPost[];
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const description = useMemo(() => {
    // Since description is now a plain string from the server
    if (post.metaDescription) {
      return post.metaDescription;
    }
    if (post.description) {
      return post.description;
    }
    return 'No description available';
  }, [post.description, post.metaDescription]);

  return (
    <Link
      aria-label={`Read blog post: ${post.title}`}
      className="group block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
      href={`/blog/${post.category.slug}/${post.slug}`}
      style={
        {
          '--tw-ring-color': BRAND_CONFIG.brand.colors.primary,
        } as React.CSSProperties
      }
    >
      <Card
        className="h-full border transition-all duration-200 hover:shadow-lg group-hover:scale-[1.02]"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        {post.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image
              alt={post.image.alt || `Featured image for ${post.title}`}
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={post.image.url || '/placeholder.svg'}
            />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="mb-2 flex items-center justify-between">
            <Badge
              style={{
                backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                color: BRAND_CONFIG.brand.colors.primary,
              }}
              variant="secondary"
            >
              {post.category.name}
            </Badge>
            {post.readTime && (
              <span
                className="text-xs"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                {post.readTime} min read
              </span>
            )}
          </div>

          <CardTitle
            className="line-clamp-2 group-hover:underline"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            {post.title}
          </CardTitle>

          <CardDescription
            className="line-clamp-3"
            style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
          >
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div
            className="flex items-center space-x-2 text-sm"
            style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
          >
            <FileText aria-hidden="true" className="h-4 w-4" />
            <time dateTime={post.publishedDate}>{post.publishedDate}</time>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BlogClient({ posts }: BlogClientProps) {
  const sortedPosts = useMemo(() => {
    return [...posts].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );
  }, [posts]);

  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Header user={null} />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <header className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div
                className="rounded-full p-4"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                }}
              >
                <FileText
                  aria-hidden="true"
                  className="h-12 w-12"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
              </div>
            </div>

            <h1
              className="mb-4 font-bold text-4xl md:text-5xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Blog
            </h1>

            <p
              className="mx-auto max-w-2xl text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
            >
              Discover our latest articles, insights, and updates
            </p>
          </header>

          {/* Posts Grid */}
          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <FileText
                className="mx-auto mb-4 h-16 w-16"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              />
              <h2
                className="mb-2 font-semibold text-2xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                No Posts Yet
              </h2>
              <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                Check back soon for our latest articles and insights.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
