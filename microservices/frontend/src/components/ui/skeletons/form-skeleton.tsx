import { Skeleton } from '@/components/ui/skeleton';
import { BRAND_CONFIG } from '@config/brand-config';

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div
      className="rounded-lg border p-6 space-y-6"
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
        borderColor: BRAND_CONFIG.brand.colors.border,
      }}
    >
      {/* Form title */}
      <Skeleton height="28px" width="200px" />

      {/* Form fields */}
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height="16px" width="100px" />
          <Skeleton height="44px" width="100%" rounded="md" />
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Skeleton height="44px" width="120px" rounded="md" />
        <Skeleton height="44px" width="100px" rounded="md" />
      </div>
    </div>
  );
}
