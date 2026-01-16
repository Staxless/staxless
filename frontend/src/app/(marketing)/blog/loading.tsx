import { FileText } from 'lucide-react';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

// Skeleton card component
function SkeletonCard({ index }: { index: number }) {
  return (
    <Card
      aria-label={`Loading blog post ${index + 1}`}
      className="h-full border"
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
        borderColor: BRAND_CONFIG.brand.colors.border,
      }}
    >
      <CardHeader>
        <div className="mb-2 flex items-start space-x-3">
          <div
            aria-hidden="true"
            className="mt-1 h-5 w-5 animate-pulse rounded"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
            }}
          />
          <div className="flex-1 space-y-2">
            <div
              aria-hidden="true"
              className="h-4 animate-pulse rounded"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
              }}
            />
            <div
              aria-hidden="true"
              className="h-4 w-3/4 animate-pulse rounded"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, lineIndex) => {
            const lineKey = `skeleton-line-${index}-${lineIndex}-${Math.random().toString(36).substr(2, 9)}`;
            return (
              <div
                aria-hidden="true"
                className={`h-3 animate-pulse rounded ${lineIndex === 2 ? 'w-2/3' : 'w-full'}`}
                key={lineKey}
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                }}
              />
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div
            aria-hidden="true"
            className="h-3 w-20 animate-pulse rounded"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
            }}
          />
          <div
            aria-hidden="true"
            className="h-5 w-16 animate-pulse rounded"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogLoading() {
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
        <section aria-label="Blog loading" className="px-4 py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div
                aria-hidden="true"
                className="rounded-full p-4"
                style={{
                  backgroundColor:
                    BRAND_CONFIG.brand.colors.backgroundSecondary,
                }}
              >
                <FileText
                  className="h-12 w-12"
                  style={{
                    color: BRAND_CONFIG.brand.colors.primary,
                  }}
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
              aria-live="polite"
              className="text-xl"
              style={{
                color: BRAND_CONFIG.brand.colors.textSecondary,
              }}
            >
              Loading latest articles...
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          {/* Skeleton Grid */}
          <section
            aria-label="Loading blog posts"
            className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const uniqueKey = `skeleton-card-${Date.now()}-${index}`;
              return <SkeletonCard index={index} key={uniqueKey} />;
            })}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
