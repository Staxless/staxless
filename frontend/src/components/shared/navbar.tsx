/**
 * @file app/Navbar.tsx
 * @description Navigation bar component for the application
 */

import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserMenu from "@/components/shared/user-menu";
import MobileMenu from "@/components/shared/mobile-menu";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Blog", href: "/blog" },
  { name: "Docs", href: "/docs" },
];

/**
 * Navbar component
 * @returns {Promise<JSX.Element>} The rendered navigation bar
 */
export default async function Navbar(): Promise<JSX.Element> {
  const headersList = await headers();
  const userInfoString = headersList.get("x-user-info");
  const user = userInfoString ? JSON.parse(userInfoString) : null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Logo</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="ml-6">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <Link href="/register" passHref>
                  <Button>Get Started</Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <MobileMenu navItems={navItems} user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
