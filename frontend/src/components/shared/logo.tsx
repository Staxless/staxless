import { BRAND_CONFIG } from '@/lib/brand-config';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Logo({ size = 'medium', className = '' }: LogoProps) {
  const sizeMap = {
    small: 28,
    medium: 36,
    large: 52,
  };

  const logoSize = sizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-black font-bold text-white ${className}`}
      style={{
        width: logoSize,
        height: logoSize,
        fontSize: logoSize * 0.4,
      }}
    >
      {BRAND_CONFIG.company.name.charAt(0)}
    </div>
  );
}
