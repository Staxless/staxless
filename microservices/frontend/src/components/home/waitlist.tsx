/**
 * @file WaitlistHeroSimple Component
 * @module WaitlistHeroSimple
 * @description A React component that displays a section for users to join a waitlist by entering their email address.
 */

'use client';

import { Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { toast } from '@/components/ui/use-toast';

/**
 * @function WaitlistHeroSimple
 * @description Renders a section where users can join a waitlist by entering their email address.
 * @returns {JSX.Element} The WaitlistHeroSimple component
 */
export default function WaitlistHeroSimple() {
  const [email, setEmail] = useState<string>('');
  const colors = useTheme();

  /**
   * @function handleSubmit
   * @description Handles the form submission for the waitlist.
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your API

    // toast({
    //   title: "You're on the list!",
    //   description: "We'll notify you when we launch. Stay tuned!",
    // });
    setEmail('');
  };

  return (
    <section className="py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="mb-4 font-extrabold text-4xl md:text-5xl"
            style={{ color: colors.primary }}
          >
            The Future of [Your Product] is Coming
          </h1>
          <p className="mb-8 text-xl" style={{ color: colors.muted }}>
            Be the first to experience our revolutionary new platform. Join the
            waitlist today and get early access when we launch!
          </p>
          <form
            className="mb-8 flex flex-col justify-center gap-4 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <Input
              className="max-w-sm"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                backgroundColor: colors.secondary,
                color: colors.text,
                borderColor: colors.muted,
              }}
              type="email"
              value={email}
            />
            <Button
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
              size="lg"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
              type="submit"
            >
              Join the Waitlist
            </Button>
          </form>
          <p className="text-sm" style={{ color: colors.muted }}>
            Join {Math.floor(Math.random() * 900) + 100} others eagerly waiting.
            Limited spots available!
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div
            className="inline-flex items-center rounded-lg p-6"
            style={{ backgroundColor: `${colors.primary}1A` }}
          >
            <Zap className="mr-2 h-6 w-6" style={{ color: colors.primary }} />
            <span className="font-semibold" style={{ color: colors.primary }}>
              Early birds get 50% off at launch!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Remove broken import and use a fallback for theme colors
// import { useTheme } from '@/contexts/ThemeContext';
const useTheme = () => ({
  primary: '#000',
  hover: '#333',
  background: '#fff',
  muted: '#888',
  secondary: '#f5f5f5',
  text: '#222',
});
