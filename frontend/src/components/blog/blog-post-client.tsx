'use client';

import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  Share2,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useMemo, useState } from 'react';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BRAND_CONFIG } from '@/lib/brand-config';

// Define types for content structures
interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

interface DescriptionNode {
  children?: TextNode[];
}

interface ContentNode {
  type?: string;
  _type?: string;
  slug?: string;
  children?: (TextNode | ContentNode)[];
  content?: (ContentNode | string)[];
  code?: string;
  language?: string;
  mdxContent?: string;
  url?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: DescriptionNode[] | null;
  slug: string;
  publishedDate: string;
  category: { name: string; slug: string };
  content: ContentNode[];
  image: { url: string; alt?: string };
  authors: {
    id: string;
    firstname: string;
    lastname?: string;
    email: string;
  }[];
  relatedPosts: {
    id: string;
    title: string;
    slug: string;
    category: { slug: string };
  }[];
  metaDescription?: string;
}

interface BlogPostClientProps {
  post: BlogPost;
}

const calculateReadTime = (content: ContentNode[]): number => {
  let words = 0;

  content.forEach((block) => {
    const blockType = block._type || block.slug || block.type;
    switch (blockType) {
      case 'richText':
      case 'rich_text': {
        const blockContent = (block.content || block.children || []) as (
          | ContentNode
          | string
        )[];
        const wordCount = blockContent.reduce(
          (total: number, node: ContentNode | string): number =>
            total + extractTextFromNode(node).split(' ').filter(Boolean).length,
          0
        );
        words += wordCount;
        break;
      }
      case 'code':
        words += (block.code || '').split(' ').filter(Boolean).length;
        break;
      case 'mdx':
        words += (block.mdxContent || '').split(' ').filter(Boolean).length;
        break;
      default:
        // Handle other block types with text content
        words += extractTextFromNode(block).split(' ').filter(Boolean).length;
        break;
    }
  });

  return Math.max(1, Math.ceil(words / 200));
};

// Custom Code Block Component
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div
      className="relative my-6 overflow-hidden rounded-lg border"
      style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 text-sm"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
          borderBottom: `1px solid ${BRAND_CONFIG.brand.colors.border}`,
        }}
      >
        <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
          {language || 'code'}
        </span>
        <Button
          className="h-6 px-2"
          onClick={handleCopy}
          size="sm"
          variant="ghost"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="ml-1 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <pre
          className="p-4 text-sm leading-relaxed"
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
            color: BRAND_CONFIG.brand.colors.textPrimary,
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Helper function to extract text from rich text nodes
const extractTextFromNode = (node: ContentNode | TextNode | string): string => {
  if (typeof node === 'string') return node;
  if ('text' in node && node.text) return node.text;

  // Type guard for ContentNode with children
  if ('children' in node && node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join('');
  }

  // Type guard for ContentNode with content
  if ('content' in node && node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('');
  }

  return '';
};

// Helper function to render rich text with proper formatting
const renderRichTextNode = (
  node: ContentNode | TextNode | string,
  index: number
): React.ReactNode => {
  if (typeof node === 'string') {
    return node;
  }

  if ('text' in node && node.text) {
    const text = node.text;
    let element = <span key={index}>{text}</span>;

    if (node.bold) {
      element = <strong key={index}>{text}</strong>;
    }
    if (node.italic) {
      element = <em key={index}>{element}</em>;
    }
    if (node.underline) {
      element = <u key={index}>{element}</u>;
    }
    if (node.code) {
      element = (
        <code
          className="rounded px-1 py-0.5 text-sm"
          key={index}
          style={{
            backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
            color: BRAND_CONFIG.brand.colors.textPrimary,
          }}
        >
          {text}
        </code>
      );
    }

    return element;
  }

  if ('children' in node && node.children && Array.isArray(node.children)) {
    return node.children.map(
      (child: ContentNode | TextNode | string, childIndex: number) =>
        renderRichTextNode(child, childIndex)
    );
  }

  return null;
};

const renderSlateContent = (
  slateContent: (ContentNode | TextNode | string)[]
) => {
  if (!Array.isArray(slateContent)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {slateContent.map(
        (node: ContentNode | TextNode | string, index: number) => {
          const key = `slate-${index}`;

          if (typeof node === 'string') {
            return (
              <p
                className="mb-4 leading-relaxed"
                key={key}
                style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
              >
                {node}
              </p>
            );
          }

          if (!('type' in node)) {
            // Handle TextNode - render as plain text
            return (
              <p
                className="mb-4 leading-relaxed"
                key={key}
                style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
              >
                {renderRichTextNode(node, index)}
              </p>
            );
          }

          switch (node.type) {
            case 'h1':
              return (
                <h1
                  className="mt-8 mb-4 font-bold text-3xl"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        child: ContentNode | TextNode | string,
                        childIndex: number
                      ) => renderRichTextNode(child, childIndex)
                    )}
                </h1>
              );
            case 'h2':
              return (
                <h2
                  className="mt-6 mb-3 font-semibold text-2xl"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        child: ContentNode | TextNode | string,
                        childIndex: number
                      ) => renderRichTextNode(child, childIndex)
                    )}
                </h2>
              );
            case 'h3':
              return (
                <h3
                  className="mt-4 mb-2 font-medium text-xl"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        child: ContentNode | TextNode | string,
                        childIndex: number
                      ) => renderRichTextNode(child, childIndex)
                    )}
                </h3>
              );
            case 'paragraph':
              return (
                <p
                  className="mb-4 leading-relaxed"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        child: ContentNode | TextNode | string,
                        childIndex: number
                      ) => renderRichTextNode(child, childIndex)
                    )}
                </p>
              );
            case 'ul':
              return (
                <ul
                  className="mb-4 ml-4 list-inside list-disc space-y-2"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        item: ContentNode | TextNode | string,
                        itemIndex: number
                      ) => (
                        <li key={`${key}-item-${itemIndex}`}>
                          {typeof item === 'string'
                            ? item
                            : 'children' in item &&
                              item.children?.map(
                                (
                                  child: ContentNode | TextNode | string,
                                  childIndex: number
                                ) => renderRichTextNode(child, childIndex)
                              )}
                        </li>
                      )
                    )}
                </ul>
              );
            case 'ol':
              return (
                <ol
                  className="mb-4 ml-4 list-inside list-decimal space-y-2"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        item: ContentNode | TextNode | string,
                        itemIndex: number
                      ) => (
                        <li key={`${key}-item-${itemIndex}`}>
                          {typeof item === 'string'
                            ? item
                            : 'children' in item &&
                              item.children?.map(
                                (
                                  child: ContentNode | TextNode | string,
                                  childIndex: number
                                ) => renderRichTextNode(child, childIndex)
                              )}
                        </li>
                      )
                    )}
                </ol>
              );
            case 'blockquote':
              return (
                <blockquote
                  className="mb-4 border-l-4 py-2 pl-4 italic"
                  key={key}
                  style={{
                    borderColor: BRAND_CONFIG.brand.colors.primary,
                    backgroundColor: `${BRAND_CONFIG.brand.colors.primary}10`,
                    color: BRAND_CONFIG.brand.colors.textSecondary,
                  }}
                >
                  {'children' in node &&
                    node.children?.map(
                      (
                        child: ContentNode | TextNode | string,
                        childIndex: number
                      ) => renderRichTextNode(child, childIndex)
                    )}
                </blockquote>
              );
            default:
              return (
                <p
                  className="mb-4 leading-relaxed"
                  key={key}
                  style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                >
                  {('children' in node &&
                    node.children?.map(
                      (
                        child: ContentNode | TextNode | string,
                        childIndex: number
                      ) => renderRichTextNode(child, childIndex)
                    )) ||
                    extractTextFromNode(node)}
                </p>
              );
          }
        }
      )}
    </div>
  );
};

const renderBlock = (block: ContentNode, index: number) => {
  const blockType = block._type || block.slug || block.type;
  const key = `block-${index}`;

  try {
    switch (blockType) {
      case 'code': {
        // Safely extract code content
        let codeContent = '';
        if (block.code) {
          codeContent = block.code;
        } else if (block.content && typeof block.content === 'string') {
          codeContent = block.content;
        }

        return (
          <CodeBlock code={codeContent} key={key} language={block.language} />
        );
      }

      case 'richText':
      case 'rich_text':
        return (
          <div className="my-4" key={key}>
            {renderSlateContent(
              ('content' in block && block.content) ||
                ('children' in block && block.children) ||
                []
            )}
          </div>
        );

      case 'mdx':
        return (
          <div
            className="my-4 rounded border p-4"
            key={key}
            style={{
              backgroundColor: '#fef3c7',
              borderColor: '#fbbf24',
              color: '#92400e',
            }}
          >
            <p className="text-sm">
              ⚠️ MDX content blocks cannot be rendered in client components.
              Please use rich text or code blocks instead.
            </p>
          </div>
        );

      case 'image': {
        // Convert image URL to relative path
        let imageSrc =
          block.url || block.src || '/placeholder.svg?height=400&width=800';

        // If it's an absolute URL from our domain, convert to relative
        if (imageSrc.startsWith('http')) {
          imageSrc = imageSrc.replace(/^https?:\/\/[^/]+/, '');
        }

        return (
          <div className="my-8" key={key}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                alt={block.alt || 'Blog post image'}
                className="object-cover"
                fill
                onError={(e) => {
                  console.error('Image failed to load:', imageSrc);
                  e.currentTarget.src = '/placeholder.svg?height=400&width=800';
                }}
                sizes="(max-width: 1200px) 100vw, 1200px"
                src={imageSrc}
              />
            </div>
            {block.caption && (
              <p
                className="mt-2 text-center text-sm italic"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                {block.caption}
              </p>
            )}
          </div>
        );
      }

      case 'paragraph':
        return (
          <p
            className="mb-4 leading-relaxed"
            key={key}
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            {extractTextFromNode(block)}
          </p>
        );

      default: {
        const textContent = extractTextFromNode(block);
        if (textContent) {
          return (
            <div className="my-4" key={key}>
              <p
                className="leading-relaxed"
                style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
              >
                {textContent}
              </p>
            </div>
          );
        }

        if (
          ('content' in block && block.content) ||
          ('children' in block && block.children)
        ) {
          return (
            <div className="my-4" key={key}>
              {renderSlateContent(
                ('content' in block && block.content) ||
                  ('children' in block && block.children) ||
                  []
              )}
            </div>
          );
        }

        return null;
      }
    }
  } catch (error) {
    console.error('Error rendering block:', error);
    return (
      <div
        className="my-4 rounded border p-4"
        key={key}
        style={{
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#dc2626',
        }}
      >
        <p className="text-sm">Error rendering content block</p>
        <pre className="mt-2 overflow-auto text-xs">
          {JSON.stringify(block, null, 2)}
        </pre>
      </div>
    );
  }
};

function ShareButton({ post }: { post: BlogPost }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      className="flex items-center space-x-2 bg-transparent"
      disabled={isSharing}
      onClick={handleShare}
      size="sm"
      variant="outline"
    >
      <Share2 className="h-4 w-4" />
      <span>{isSharing ? 'Sharing...' : 'Share'}</span>
    </Button>
  );
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const readTime = useMemo(
    () => calculateReadTime(post.content),
    [post.content]
  );

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      image: post.image?.url,
      datePublished: post.publishedDate,
      author: post.authors.map((a) => ({
        '@type': 'Person',
        name: `${a.firstname}${a.lastname ? ` ${a.lastname}` : ''}`,
      })),
      publisher: {
        '@type': 'Organization',
        name: BRAND_CONFIG.company.name,
      },
    }),
    [post]
  );

  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      <Header user={null} />

      <main className="pt-20">
        <article className="container mx-auto max-w-4xl px-4 py-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center space-x-2 text-sm"
          >
            <Link
              className="flex items-center space-x-1 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
              href="/blog"
              style={{
                color: BRAND_CONFIG.brand.colors.primary,
              }}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              <span>Blog</span>
            </Link>
            <span
              aria-hidden="true"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              /
            </span>
            <Link
              className="hover:underline"
              href={`/blog/${post.category.slug}`}
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              {post.category.name}
            </Link>
            <span
              aria-hidden="true"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              /
            </span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              {post.title}
            </span>
          </nav>

          <header className="mb-10">
            <div className="mb-4">
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: `${BRAND_CONFIG.brand.colors.primary}20`,
                  color: BRAND_CONFIG.brand.colors.primary,
                }}
                variant="secondary"
              >
                {post.category.name}
              </Badge>

              <h1
                className="mb-4 font-bold text-3xl leading-tight md:text-4xl lg:text-5xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                className="flex flex-wrap items-center gap-4 text-sm"
                style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
              >
                <div className="flex items-center space-x-2">
                  <Calendar aria-hidden="true" className="h-4 w-4" />
                  <time dateTime={post.publishedDate}>
                    {post.publishedDate}
                  </time>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock aria-hidden="true" className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Tag aria-hidden="true" className="h-4 w-4" />
                  <span>{post.category.name}</span>
                </div>
              </div>

              <ShareButton post={post} />
            </div>
          </header>

          {post.image?.url && (
            <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                alt={post.image.alt || `Featured image for ${post.title}`}
                className="object-cover"
                fill
                onError={(e) => {
                  console.error('Image failed to load:', post.image.url);
                  e.currentTarget.src =
                    '/placeholder.svg?height=400&width=800&text=Image+Not+Found';
                }}
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                src={post.image.url || '/placeholder.svg'}
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              padding: '2rem',
              borderRadius: '0.75rem',
              border: `1px solid ${BRAND_CONFIG.brand.colors.border}`,
            }}
          >
            {post.content && post.content.length > 0 ? (
              post.content.map((block, index) => renderBlock(block, index))
            ) : (
              <div className="py-8 text-center">
                <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
                  No content available for this post.
                </p>
              </div>
            )}
          </div>

          {post.authors.length > 0 && (
            <Card
              className="mt-10"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  {post.authors.length === 1 ? 'Author' : 'Authors'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {post.authors.map((author) => (
                    <div
                      className="flex items-center space-x-3"
                      key={author.id}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full font-medium text-white"
                        style={{
                          backgroundColor: BRAND_CONFIG.brand.colors.primary,
                        }}
                      >
                        {(author.firstname || author.email)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{
                            color: BRAND_CONFIG.brand.colors.textPrimary,
                          }}
                        >
                          {author.firstname ? ` ${author.firstname}` : ''}
                          {author.lastname ? ` ${author.lastname}` : ''}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                        >
                          {author.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {post.relatedPosts?.length > 0 && (
            <Card
              className="mt-10"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                >
                  Related Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {post.relatedPosts.slice(0, 4).map((related) => (
                    <Link
                      className="block rounded-lg border p-4 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                      href={`/blog/${related.category.slug}/${related.slug}`}
                      key={related.id}
                      style={{
                        borderColor: BRAND_CONFIG.brand.colors.border,
                        backgroundColor:
                          BRAND_CONFIG.brand.colors.backgroundTertiary,
                      }}
                    >
                      <h3
                        className="font-medium hover:underline"
                        style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                      >
                        {related.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card
            className="mt-12"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <CardContent className="p-8 text-center">
              <h3
                className="mb-4 font-semibold text-xl"
                style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
              >
                Enjoyed This Article?
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
              >
                We&apos;d love to hear your thoughts! Share your feedback or
                reach out with questions about this blog post.
              </p>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Button
                  asChild
                  style={{
                    backgroundColor: BRAND_CONFIG.brand.colors.primary,
                    color: 'white',
                  }}
                >
                  <a href={`mailto:${BRAND_CONFIG.company.email}`}>
                    Get in Touch
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog">Read More Articles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  );
}
