'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BRAND_CONFIG } from '@/lib/brand-config';
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
        <Button size="sm" variant="ghost">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80" side="right">
        <div className="mb-8 flex items-center justify-between">
          <Link
            className="flex items-center space-x-2"
            href="/"
            onClick={() => setIsOpen(false)}
          >
            <Logo size="medium" />
            <span className="font-semibold text-xl">
              {BRAND_CONFIG.company.name}
            </span>
          </Link>
        </div>

        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              className="block text-gray-600 text-lg hover:text-gray-900"
              href={item.href}
              key={item.name}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t pt-8">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    Settings
                  </Button>
                </Link>
                {/* <Button variant="ghost" className="w-full justify-start text-red-600">
                  Sign out
                </Button> */}
                <SignOutButton />
              </div>
            </div>
          ) : (
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
