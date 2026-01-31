import { Skeleton } from '@/components/ui/skeleton';
import { BRAND_CONFIG } from '@config/brand-config';

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
        borderColor: BRAND_CONFIG.brand.colors.border,
      }}
    >
      {/* Header */}
      <div
        className="flex gap-4 border-b p-4"
        style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton height="20px" width="80%" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 border-b p-4 last:border-b-0"
          style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton
                height="16px"
                width={`${60 + Math.random() * 30}%`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
