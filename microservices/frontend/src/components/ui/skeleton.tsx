import { cn } from '@/lib/utils';
import { BRAND_CONFIG } from '@config/brand-config';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  const roundedClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={cn('animate-pulse', roundedClass, className)}
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.border,
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}

// Text line skeleton - mimics text
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

// Circle skeleton - for avatars
export function SkeletonCircle({
  size = '40px',
  className,
}: {
  size?: string;
  className?: string;
}) {
  return (
    <Skeleton width={size} height={size} rounded="full" className={className} />
  );
}
