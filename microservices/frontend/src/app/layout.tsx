import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import type React from 'react';
import '@/styles/globals.css';
import Script from 'next/script';
import { BRAND_CONFIG } from '@/lib/brand-config';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/user-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `Home | ${BRAND_CONFIG.seo.title}`,
  description: BRAND_CONFIG.seo.description,
  keywords: BRAND_CONFIG.seo.keywords,
  authors: [{ name: BRAND_CONFIG.company.name }],
  creator: BRAND_CONFIG.company.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BRAND_CONFIG.company.website,
    title: BRAND_CONFIG.seo.title,
    description: BRAND_CONFIG.seo.description,
    siteName: BRAND_CONFIG.company.name,
    images: [
      {
        url: BRAND_CONFIG.seo.ogImage,
        width: 1200,
        height: 630,
        alt: BRAND_CONFIG.company.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND_CONFIG.seo.title,
    description: BRAND_CONFIG.seo.description,
    images: [BRAND_CONFIG.seo.ogImage],
    creator: BRAND_CONFIG.social.twitter,
  },
  generator: 'v0.dev',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bgColor = BRAND_CONFIG.brand.colors.background;

  // Get initial user from middleware headers for SSR
  const headersList = await headers();
  const userInfoString = headersList.get('x-user-info');
  const initialUser = userInfoString ? JSON.parse(userInfoString) : null;

  return (
    <html lang="en" style={{ backgroundColor: bgColor }}>
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={inter.className}
        style={{
          backgroundColor: bgColor,
          minHeight: '100vh',
        }}
      >
        <UserProvider initialUser={initialUser}>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
