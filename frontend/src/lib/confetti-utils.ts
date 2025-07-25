// Confetti utility functions
export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
}

export function createConfetti(options: ConfettiOptions = {}) {
  // Check if confetti library is available
  if (typeof window === 'undefined' || !window.confetti) {
    return Promise.resolve();
  }

  const defaults: ConfettiOptions = {
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.6 },
    colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc'],
  };

  return window.confetti({
    ...defaults,
    ...options,
  });
}

export function celebrationConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left side
    createConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#000000', '#333333', '#666666'],
    });

    // Right side
    createConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#000000', '#333333', '#666666'],
    });
  }, 250);
}

// Storage keys for tracking confetti state
export const CONFETTI_STORAGE_KEY = 'cosmicsaas_confetti_shown';
export const CHECKOUT_SUCCESS_KEY = 'cosmicsaas_checkout_success';

export function markCheckoutSuccess() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(CHECKOUT_SUCCESS_KEY, 'true');
  }
}

export function shouldShowConfetti(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const checkoutSuccess = sessionStorage.getItem(CHECKOUT_SUCCESS_KEY);
  const confettiShown = localStorage.getItem(CONFETTI_STORAGE_KEY);

  return checkoutSuccess === 'true' && confettiShown !== 'true';
}

export function markConfettiShown() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFETTI_STORAGE_KEY, 'true');
    sessionStorage.removeItem(CHECKOUT_SUCCESS_KEY);
  }
}

export function resetConfettiState() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFETTI_STORAGE_KEY);
    sessionStorage.removeItem(CHECKOUT_SUCCESS_KEY);
  }
}

// Global confetti type declaration
declare global {
  interface Window {
    confetti: (options: Record<string, unknown>) => Promise<void>;
  }
}
