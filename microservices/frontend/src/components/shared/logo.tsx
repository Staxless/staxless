import { BRAND_CONFIG } from '@/lib/brand-config';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Logo({ size = 'medium', className = '' }: LogoProps) {
  const colors = BRAND_CONFIG.brand.colors;
  const sizeMap = {
    small: 28,
    medium: 36,
    large: 52,
  };

  const logoSize = sizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-lg font-bold ${className}`}
      style={{
        width: logoSize,
        height: logoSize,
        fontSize: logoSize * 0.4,
        backgroundColor: colors.primary,
        color: colors.background,
      }}
    >
      {BRAND_CONFIG.company.name.charAt(0)}
    </div>
  );
}
