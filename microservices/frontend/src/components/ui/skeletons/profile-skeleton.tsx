import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@/components/ui/skeleton';
import { BRAND_CONFIG } from '@/lib/brand-config';

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header with avatar */}
      <div className="flex items-center gap-6">
        <SkeletonCircle size="96px" />
        <div className="flex-1 space-y-2">
          <Skeleton height="32px" width="200px" />
          <Skeleton height="16px" width="300px" />
          <div className="mt-4 flex gap-2">
            <Skeleton height="36px" width="100px" rounded="md" />
            <Skeleton height="36px" width="100px" rounded="md" />
          </div>
        </div>
      </div>

      {/* Info sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border p-6 space-y-4"
            style={{
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              borderColor: BRAND_CONFIG.brand.colors.border,
            }}
          >
            <Skeleton height="20px" width="120px" />
            <SkeletonText lines={4} />
          </div>
        ))}
      </div>
    </div>
  );
}
