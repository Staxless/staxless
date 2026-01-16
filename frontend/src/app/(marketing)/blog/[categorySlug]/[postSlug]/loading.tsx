import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function BlogPostLoading() {
  return (
    <div
      className="container mx-auto max-w-4xl px-4 py-20"
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
      }}
    >
      <Card
        className="border"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <CardHeader>
          {/* Image skeleton */}
          <div
            aria-hidden="true"
            className="mb-6 h-64 w-full animate-pulse rounded-lg"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
            }}
          />

          {/* Title skeleton */}
          <div
            aria-hidden="true"
            className="mb-4 h-8 w-3/4 animate-pulse rounded"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
            }}
          />

          {/* Metadata skeleton */}
          <div className="mb-6 flex gap-4">
            <div
              aria-hidden="true"
              className="h-4 w-24 animate-pulse rounded"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
              }}
            />
            <div
              aria-hidden="true"
              className="h-4 w-20 animate-pulse rounded"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {/* Content skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                aria-hidden="true"
                className={`h-4 animate-pulse rounded ${
                  index % 4 === 3 ? 'w-2/3' : 'w-full'
                }`}
                key={index}
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.backgroundTertiary,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
