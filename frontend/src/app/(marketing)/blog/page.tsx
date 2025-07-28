'use client';

import { Calendar, FileText, Tag } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllBlogSlugs, getBlogContent } from '@/content/blog-content';
import { BRAND_CONFIG } from '@/lib/brand-config';

// Define type for blog post to ensure icon is a React component
type BlogPost = {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  publishedDate: string;
  category: string;
};

// Fetch all blog posts dynamically
const blogPosts: BlogPost[] = getAllBlogSlugs()
  .map((slug) => getBlogContent(slug))
  .filter(
    (post): post is NonNullable<ReturnType<typeof getBlogContent>> =>
      post !== null
  )
  .map((post) => ({
    id: post.title.toLowerCase().replace(/\s+/g, '-'),
    title: post.title,
    description: post.metaDescription,
    slug:
      getAllBlogSlugs().find((s) => getBlogContent(s)?.title === post.title) ||
      '',
    icon: FileText, // Explicitly set to FileText component
    publishedDate: post.publishedDate,
    category: post.category,
  }));

export default function BlogPage() {
  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      <Header user={null} />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div
                className="rounded-full p-4"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                }}
              >
                <FileText
                  className="h-12 w-12"
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                />
              </div>
            </div>
            <h1
              className="mb-6 font-bold text-4xl md:text-5xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Blog
            </h1>
            <p
              className="text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
            >
              Explore our latest articles, tutorials, and tips to stay informed
              and inspired
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Blog Posts Grid */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <Card
                  className="h-full cursor-pointer border transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor:
                      BRAND_CONFIG.brand.colors.backgroundSecondary,
                    borderColor: BRAND_CONFIG.brand.colors.border,
                  }}
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center space-x-3">
                      <post.icon
                        className="h-6 w-6"
                        style={{ color: BRAND_CONFIG.brand.colors.primary }}
                      />
                      <CardTitle
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {post.title}
                      </CardTitle>
                    </div>
                    <CardDescription
                      style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                    >
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                      >
                        Published: {post.publishedDate}
                      </span>
                      <span
                        className="rounded px-2 py-1 text-sm"
                        style={{
                          backgroundColor:
                            BRAND_CONFIG.brand.colors.backgroundTertiary,
                          color: BRAND_CONFIG.brand.colors.textMuted,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Contact Section */}
          <Card
            className="mx-auto mt-16 max-w-2xl border"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardHeader className="text-center">
              <CardTitle
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Have Feedback or Ideas?
              </CardTitle>
              <CardDescription
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                We’d love to hear your thoughts or suggestions for future blog
                posts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div>
                  <h4
                    className="mb-2 font-medium"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    Contact Information
                  </h4>
                  <div
                    className="space-y-1 text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    <p>Email: {BRAND_CONFIG.company.email}</p>
                    <p>Phone: {BRAND_CONFIG.company.phone}</p>
                    <p>Address: {BRAND_CONFIG.company.address}</p>
                  </div>
                </div>
                <div
                  className="border-t pt-4"
                  style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
                >
                  <p
                    className="text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    We typically respond within 2-3 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
