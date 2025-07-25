/**
 * @file Next.js Middleware
 * @module middleware
 * @description Middleware for handling authentication, CSRF protection, and route-specific behaviors.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUser, type User } from './lib/validate-user';

/**
 * Routes that should force a reload when navigating back
 * @constant {string[]}
 */
const ROUTES_TO_RELOAD = ['/login', '/register', '/dashboard'];

/**
 * Protected routes that require authentication
 * @constant {string[]}
 */
const PROTECTED_ROUTES = ['/dashboard', '/checkout'];

/**
 * Protected routes that require admin access
 * @constant {string[]}
 */
const ADMIN_ROUTES = ['/admin'];

/**
 * Validates CSRF for non-GET requests by checking Origin and Host headers
 */
function isValidCsrf(request: NextRequest): boolean {
  if (request.method === 'GET') {
    return true;
  }

  const originHeader = request.headers.get('Origin');
  const hostHeader = request.headers.get('Host');
  return !!(
    originHeader &&
    hostHeader &&
    new URL(originHeader).host === hostHeader
  );
}

/**
 * Checks if the request targets a specific route
 */
function matchesRoute(request: NextRequest, routes: string[]): boolean {
  return routes.some((route) => request.nextUrl.pathname.startsWith(route));
}

/**
 * Creates a redirect response to the specified path
 */
function redirectTo(path: string, request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

/**
 * Middleware function to handle authentication and route-specific behaviors
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Validate CSRF
  if (!isValidCsrf(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const user: User | null = await getUser();
  const pathname = request.nextUrl.pathname;

  // Handle admin routes
  if (matchesRoute(request, ADMIN_ROUTES) && !user?.roles.includes('admin')) {
    return redirectTo('/login', request);
  }

  // Handle auth pages for logged-in users
  if (
    (pathname.startsWith('/login') || pathname.startsWith('/register')) &&
    user
  ) {
    return redirectTo('/dashboard', request);
  }

  // Handle protected routes
  const isProtected = matchesRoute(request, PROTECTED_ROUTES);
  if (isProtected && !user) {
    return redirectTo('/login', request);
  }

  // Handle subscription status for protected routes
  if (
    isProtected &&
    user &&
    user.subscription.status !== 'active' &&
    !pathname.startsWith('/checkout')
  ) {
    return redirectTo('/checkout', request);
  }

  // Handle active subscription on checkout
  if (
    pathname.startsWith('/checkout') &&
    user &&
    user.subscription.status === 'active'
  ) {
    return redirectTo('/dashboard', request);
  }

  // Set headers
  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set('x-user-info', JSON.stringify(user));
  }
  if (request.headers.get('referer') && ROUTES_TO_RELOAD.includes(pathname)) {
    requestHeaders.set('x-reload-on-back', 'true');
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * Configuration for the middleware
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ...ROUTES_TO_RELOAD,
  ],
};
