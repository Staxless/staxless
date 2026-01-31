/**
 * @file Mobile Menu Component
 * @description Mobile navigation menu with slide-out sheet
 */

'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BRAND_CONFIG } from '@config/brand-config';
import { SignOutButton } from '../auth/sign-out-button';
import Logo from './logo';

interface NavItem {
  name: string;
  href: string;
}

interface User {
  name: string;
  email: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  user: User | null;
}

export default function MobileMenu({ navItems, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost"
          aria-label="Open menu"
          style={{
            color: BRAND_CONFIG.brand.colors.textPrimary,
          }}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="w-80" 
        side="right"
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
          borderLeft: `1px solid ${BRAND_CONFIG.brand.colors.border}`,
        }}
      >
        {/* Header with Logo */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            className="flex items-center space-x-2"
            href="/"
            onClick={() => setIsOpen(false)}
          >
            <Logo size="medium" />
            <span 
              className="font-semibold text-xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              {BRAND_CONFIG.company.name}
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg transition-colors"
              style={{ 
                color: BRAND_CONFIG.brand.colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = BRAND_CONFIG.brand.colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = BRAND_CONFIG.brand.colors.textSecondary;
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div 
          className="mt-8 border-t pt-8"
          style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
        >
          {user ? (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full font-medium text-white"
                  style={{ 
                    backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    {user.name}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full justify-start" 
                    variant="ghost"
                    style={{
                      color: BRAND_CONFIG.brand.colors.textPrimary,
                    }}
                  >
                    Dashboard
                  </Button>
                </Link>
                
                <SignOutButton />
              </div>
            </div>
          ) : (
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button 
                className="w-full"
                style={{
                  backgroundColor: BRAND_CONFIG.brand.colors.primary,
                  color: BRAND_CONFIG.brand.colors.background,
                }}
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}