import { Skeleton } from '@/components/ui/skeleton';
import { BRAND_CONFIG } from '@config/brand-config';

export function ProductCardSkeleton() {
  return (
    <div
      className="rounded-lg border p-6 space-y-4"
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
        borderColor: BRAND_CONFIG.brand.colors.border,
      }}
    >
      {/* Icon/Image */}
      <Skeleton height="48px" width="48px" rounded="lg" />

      {/* Title */}
      <Skeleton height="24px" width="70%" />

      {/* Price */}
      <Skeleton height="32px" width="40%" />

      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="90%" />
        <Skeleton height="16px" width="60%" />
      </div>

      {/* Features list */}
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton height="16px" width="16px" />
            <Skeleton height="16px" width="80%" />
          </div>
        ))}
      </div>

      {/* Button */}
      <Skeleton height="44px" width="100%" rounded="md" />
    </div>
  );
}

// Grid of product cards
export function ProductGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
