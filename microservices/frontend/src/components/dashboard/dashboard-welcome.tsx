'use client';

import { useUser } from '@/contexts/user-context';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function DashboardWelcome() {
  const { user } = useUser();

  const displayName = user?.name || user?.email?.split('@')[0] || 'there';

  return (
    <p style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
      Welcome back, {displayName}! Here&apos;s what&apos;s happening with your
      SaaS.
    </p>
  );
}
