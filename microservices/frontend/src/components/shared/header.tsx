'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from '@/components/shared/logo';
import MobileMenu from '@/components/shared/mobile-menu';
import UserMenu from '@/components/shared/user-menu';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { useUser } from '@/contexts/user-context';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const colors = BRAND_CONFIG.brand.colors;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = BRAND_CONFIG.navigation.main;

  // Format user for UserMenu component
  const formattedUser = user
    ? {
        name: user.name || user.email.split('@')[0],
        email: user.email,
      }
    : null;

  return (
    <header
      className="fixed z-50 w-full px-4 py-4 transition-all duration-300 sm:px-6 lg:px-8"
      style={{
        backgroundColor: isScrolled ? colors.backgroundSecondary : 'transparent',
        borderBottom: isScrolled ? `1px solid ${colors.border}` : 'none',
        boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center space-x-3" href="/">
          <Logo size="medium" />
          <span
            className="font-medium text-xl"
            style={{ color: colors.textPrimary }}
          >
            {BRAND_CONFIG.company.name}
          </span>
        </Link>

        <nav className="hidden space-x-8 md:flex">
          {navItems.map((item) => (
            <Link
              className="font-medium transition-colors"
              href={item.href}
              key={item.name}
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {formattedUser ? (
            <UserMenu user={formattedUser} />
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  className="font-medium"
                  variant="ghost"
                  style={{ color: colors.textSecondary }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="rounded-lg px-6 font-medium transition-colors"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <MobileMenu navItems={navItems} user={formattedUser} />
        </div>
      </div>
    </header>
  );
}
