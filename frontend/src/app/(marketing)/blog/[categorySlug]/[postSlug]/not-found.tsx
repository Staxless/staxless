import { FileX } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function BlogPostNotFound() {
  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
      }}
    >
      <Header user={null} />
      <div className="pt-20">
        <main className="container mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mb-8 flex justify-center">
            <div
              aria-hidden="true"
              className="rounded-full p-6"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              }}
            >
              <FileX
                className="h-16 w-16"
                style={{
                  color: BRAND_CONFIG.brand.colors.textMuted,
                }}
              />
            </div>
          </div>

          <h1
            className="mb-4 font-bold text-3xl md:text-4xl"
            style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
          >
            Blog Post Not Found
          </h1>

          <p
            className="mb-8 text-lg leading-relaxed"
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            Sorry, we couldn&apos;t find the blog post you&apos;re looking for.
            It may have been moved, deleted, or the URL might be incorrect.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/blog">
              <Button
                className="w-full focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  color: 'white',
                }}
              >
                Browse All Posts
              </Button>
            </Link>
            <Link href="/">
              <Button
                className="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto"
                style={{
                  borderColor: BRAND_CONFIG.brand.colors.border,
                  color: BRAND_CONFIG.brand.colors.textPrimary,
                  backgroundColor: 'transparent',
                }}
                variant="outline"
              >
                Go Home
              </Button>
            </Link>
          </div>

          <div className="mt-12">
            <h2
              className="mb-4 font-semibold text-lg"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Need Help?
            </h2>
            <p
              className="text-sm"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              If you believe this is an error, please contact us at{' '}
              <a
                className="rounded hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1"
                href={`mailto:${BRAND_CONFIG.company.email}`}
                style={{ color: BRAND_CONFIG.brand.colors.primary }}
              >
                {BRAND_CONFIG.company.email}
              </a>
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
