'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BRAND_CONFIG } from '@/lib/brand-config';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component to catch React errors
 * Displays a user-friendly error message and provides a way to recover
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const colors = BRAND_CONFIG.brand.colors;

    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-screen items-center justify-center p-4"
          style={{ backgroundColor: colors.background }}
        >
          <div className="w-full max-w-md space-y-4">
            <Alert
              variant="destructive"
              style={{
                backgroundColor: colors.error,
                borderColor: colors.error,
              }}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle style={{ color: colors.background }}>
                Something went wrong
              </AlertTitle>
              <AlertDescription style={{ color: colors.background }}>
                An unexpected error occurred. Please try refreshing the page.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="w-full transition-colors"
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
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
