'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from '@/components/shared/logo';
import MobileMenu from '@/components/shared/mobile-menu';
import UserMenu from '@/components/shared/user-menu';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface User {
  name: string;
  email: string;
}

export interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = BRAND_CONFIG.navigation.main;

  return (
    <header
      className={`fixed z-50 w-full px-4 py-4 transition-all duration-300 sm:px-6 lg:px-8 ${
        isScrolled
          ? 'border-gray-200 border-b bg-white shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center space-x-3" href="/">
          <Logo size="medium" />
          <span className="font-medium text-gray-900 text-xl">
            {BRAND_CONFIG.company.name}
          </span>
        </Link>

        <nav className="hidden space-x-8 md:flex">
          {navItems.map((item) => (
            <Link
              className="font-medium text-gray-600 transition-colors hover:text-black"
              href={item.href}
              key={item.name}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button className="font-medium text-gray-600" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-lg bg-black px-6 font-medium text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <MobileMenu navItems={navItems} user={user} />
        </div>
      </div>
    </header>
  );
}
