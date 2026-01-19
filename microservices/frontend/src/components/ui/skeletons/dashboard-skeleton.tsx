import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { BRAND_CONFIG } from '@/lib/brand-config';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height="32px" width="200px" />
          <Skeleton height="16px" width="300px" />
        </div>
        <Skeleton height="40px" width="120px" rounded="md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border p-6 space-y-3"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <Skeleton height="20px" width="60%" />
            <Skeleton height="36px" width="40%" />
            <Skeleton height="14px" width="50%" />
          </div>
        ))}
      </div>

      {/* Chart/Table Section */}
      <div
        className="rounded-lg border p-6 space-y-4"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <Skeleton height="24px" width="150px" />
        <Skeleton height="300px" width="100%" />
      </div>

      {/* Activity List */}
      <div
        className="rounded-lg border"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderColor: BRAND_CONFIG.brand.colors.border,
        }}
      >
        <div
          className="border-b p-6"
          style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
        >
          <Skeleton height="24px" width="150px" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b p-4 last:border-b-0"
            style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
          >
            <SkeletonCircle size="40px" />
            <div className="flex-1 space-y-2">
              <Skeleton height="16px" width="60%" />
              <Skeleton height="14px" width="40%" />
            </div>
            <Skeleton height="32px" width="80px" rounded="md" />
          </div>
        ))}
      </div>
    </div>
  );
}
