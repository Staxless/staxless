'use client';

import { useEffect } from 'react';
import {
  celebrationConfetti,
  markConfettiShown,
  shouldShowConfetti,
} from '@/lib/confetti-utils';

interface ConfettiTriggerProps {
  trigger?: boolean;
  onComplete?: () => void;
}

export default function ConfettiTrigger({
  trigger = true,
  onComplete,
}: ConfettiTriggerProps) {
  useEffect(() => {
    if (!trigger) {
      return;
    }

    const triggerConfetti = async () => {
      // Check if we should show confetti
      if (!shouldShowConfetti()) {
        return;
      }

      // Small delay to ensure page is fully loaded
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        // Trigger the celebration confetti
        celebrationConfetti();

        // Mark confetti as shown
        markConfettiShown();

        // Call completion callback
        onComplete?.();
      } catch {
        // Ignore confetti errors
      }
    };

    triggerConfetti();
  }, [trigger, onComplete]);

  return null; // This component doesn't render anything
}
