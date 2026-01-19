/**
 * @file Waitlist Component
 * @module Waitlist
 * @description A React component that displays a section for users to join a waitlist by entering their email address.
 */

'use client';

import { Zap } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { useToast } from '@/hooks/use-toast';

/**
 * @function Waitlist
 * @description Renders a section where users can join a waitlist by entering their email address.
 * @returns {JSX.Element} The Waitlist component
 */
export default function Waitlist() {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * @function handleSubmit
   * @description Handles the form submission for the waitlist.
   * @param {FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/waitlist', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "You're on the list!",
        description: "We'll notify you when we launch. Stay tuned!",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="py-20" 
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.background }}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="mb-4 font-extrabold text-4xl md:text-5xl"
            style={{ color: BRAND_CONFIG.brand.colors.primary }}
          >
            The Future of {BRAND_CONFIG.company.name} is Coming
          </h1>
          <p 
            className="mb-8 text-xl" 
            style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
          >
            Be the first to experience our revolutionary new platform. Join the
            waitlist today and get early access when we launch!
          </p>
          
          <form
            className="mb-8 flex flex-col justify-center gap-4 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <Input
              className="max-w-sm"
              disabled={isSubmitting}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
                color: BRAND_CONFIG.brand.colors.textPrimary,
                borderColor: BRAND_CONFIG.brand.colors.border,
              }}
              type="email"
              value={email}
            />
            <Button
              disabled={isSubmitting}
              size="lg"
              style={{
                backgroundColor: BRAND_CONFIG.brand.colors.primary,
                color: BRAND_CONFIG.brand.colors.background,
              }}
              type="submit"
            >
              {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </Button>
          </form>
          
          <p 
            className="text-sm" 
            style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
          >
            Join {Math.floor(Math.random() * 900) + 100} others eagerly waiting.
            Limited spots available!
          </p>
        </div>
        
        <div className="mt-12 flex justify-center">
          <div
            className="inline-flex items-center rounded-lg p-6"
            style={{ 
              backgroundColor: `${BRAND_CONFIG.brand.colors.primary}1A` // 10% opacity
            }}
          >
            <Zap 
              className="mr-2 h-6 w-6" 
              style={{ color: BRAND_CONFIG.brand.colors.primary }} 
            />
            <span 
              className="font-semibold" 
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              Early birds get 50% off at launch!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}