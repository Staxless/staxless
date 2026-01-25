/**
 * Plan Selection Utilities
 * Handles storing and retrieving plan selection across the signup/checkout flow
 */

export interface PlanSelection {
  productId: string;
  priceId: string;
  tier: string;
  interval: 'month' | 'year';
  timestamp: number;
}

const STORAGE_KEY = 'selectedPlan';
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Store plan selection in sessionStorage
 */
export function storePlanSelection(selection: Omit<PlanSelection, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  const data: PlanSelection = {
    ...selection,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store plan selection:', error);
  }
}

/**
 * Retrieve plan selection from sessionStorage
 * Returns null if not found or expired
 */
export function getPlanSelection(): PlanSelection | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: PlanSelection = JSON.parse(stored);

    // Check if expired
    if (Date.now() - data.timestamp > EXPIRY_MS) {
      clearPlanSelection();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to retrieve plan selection:', error);
    return null;
  }
}

/**
 * Clear stored plan selection
 */
export function clearPlanSelection(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear plan selection:', error);
  }
}

/**
 * Check if a plan is pre-selected (from URL or sessionStorage)
 */
export function hasPreSelectedPlan(searchParams: URLSearchParams): boolean {
  const urlPlan = searchParams.get('plan') || searchParams.get('tier');
  if (urlPlan) return true;

  const storedPlan = getPlanSelection();
  return storedPlan !== null;
}

/**
 * Get the pre-selected plan tier from URL or sessionStorage
 */
export function getPreSelectedTier(searchParams: URLSearchParams): string | null {
  // URL params take priority
  const urlPlan = searchParams.get('plan') || searchParams.get('tier');
  if (urlPlan) return urlPlan.toLowerCase();

  // Fall back to sessionStorage
  const storedPlan = getPlanSelection();
  return storedPlan?.tier.toLowerCase() ?? null;
}

/**
 * Get the pre-selected price ID from URL or sessionStorage
 */
export function getPreSelectedPriceId(searchParams: URLSearchParams): string | null {
  const urlPrice = searchParams.get('price') || searchParams.get('priceId');
  if (urlPrice) return urlPrice;

  const storedPlan = getPlanSelection();
  return storedPlan?.priceId ?? null;
}

/**
 * Get the pre-selected billing interval
 */
export function getPreSelectedInterval(searchParams: URLSearchParams): 'month' | 'year' {
  const urlInterval = searchParams.get('interval');
  if (urlInterval === 'month' || urlInterval === 'year') return urlInterval;

  const storedPlan = getPlanSelection();
  return storedPlan?.interval ?? 'year'; // Default to annual
}

/**
 * Build redirect URL with plan parameters
 */
export function buildPlanRedirectUrl(
  basePath: string,
  plan: { tier: string; priceId?: string; interval?: 'month' | 'year' }
): string {
  const params = new URLSearchParams();
  params.set('plan', plan.tier.toLowerCase());
  if (plan.priceId) params.set('price', plan.priceId);
  if (plan.interval) params.set('interval', plan.interval);

  return `${basePath}?${params.toString()}`;
}

/**
 * Determine post-auth redirect based on plan selection
 */
export function getPostAuthRedirect(searchParams: URLSearchParams): string {
  const hasPlan = hasPreSelectedPlan(searchParams);

  if (hasPlan) {
    const tier = getPreSelectedTier(searchParams);
    const priceId = getPreSelectedPriceId(searchParams);
    const interval = getPreSelectedInterval(searchParams);

    const params = new URLSearchParams();
    if (tier) params.set('plan', tier);
    if (priceId) params.set('price', priceId);
    params.set('interval', interval);

    return `/checkout?${params.toString()}`;
  }

  // No plan selected - redirect to pricing
  return '/#pricing';
}
