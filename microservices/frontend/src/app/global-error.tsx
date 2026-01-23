'use client';

import { useEffect } from 'react';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const colors = BRAND_CONFIG.brand.colors;
  const navItems = BRAND_CONFIG.navigation.main;

  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en" style={{ backgroundColor: colors.background }}>
      <body
        style={{
          backgroundColor: colors.background,
          minHeight: '100vh',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Navigation */}
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '1rem 1.5rem',
            backgroundColor: colors.backgroundSecondary,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: colors.primary,
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.background,
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                }}
              >
                {BRAND_CONFIG.company.name.charAt(0)}
              </div>
              <span
                style={{
                  fontWeight: '500',
                  fontSize: '1.25rem',
                  color: colors.textPrimary,
                }}
              >
                {BRAND_CONFIG.company.name}
              </span>
            </a>

            <nav style={{ display: 'flex', gap: '2rem' }}>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  style={{
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                fontSize: '8rem',
                color: colors.textMuted,
                lineHeight: 1,
              }}
            >
              500
            </h1>

            <p
              style={{
                marginBottom: '2rem',
                fontSize: '1.125rem',
                color: colors.textSecondary,
              }}
            >
              Something went wrong.
            </p>

            {process.env.NODE_ENV === 'development' && error.message && (
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: colors.backgroundSecondary,
                  border: `1px solid ${colors.border}`,
                  textAlign: 'left',
                  maxWidth: '28rem',
                  margin: '0 auto 2rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: colors.error,
                    margin: 0,
                  }}
                >
                  {error.message}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: colors.primary,
                  color: colors.background,
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>

              <a
                href="/"
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
