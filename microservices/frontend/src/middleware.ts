/**
 * @file Next.js Middleware
 * @description Middleware for authentication, CSRF protection, and route-specific behaviors.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUser, type User } from './lib/validate-user';

const ROUTES_TO_RELOAD = ['/login', '/register', '/dashboard', ''];
const PROTECTED_ROUTES = ['/dashboard', '/checkout'];

function isValidCsrf(request: NextRequest): boolean {
  if (request.method === 'GET') {
    return true;
  }
  const origin = request.headers.get('Origin');
  const host = request.headers.get('Host');
  return !!(origin && host && new URL(origin).host === host);
}

function handleRouteRedirect(
  request: NextRequest,
  user: User | null,
  pathname: string
): NextResponse | null {
  if (
    (pathname.startsWith('/login') || pathname.startsWith('/register')) &&
    user
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    isProtected &&
    user &&
    user.subscription.status !== 'active' &&
    !pathname.startsWith('/checkout')
  ) {
    return NextResponse.redirect(new URL('/checkout', request.url));
  }

  if (
    pathname.startsWith('/checkout') &&
    user?.subscription.status === 'active'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return null;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (!isValidCsrf(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const userResult = await getUser();
  const user = userResult.success ? userResult.data : null;
  const pathname = request.nextUrl.pathname;

  const redirectResponse = handleRouteRedirect(request, user, pathname);
  if (redirectResponse) {
    return redirectResponse;
  }

  const headers = new Headers(request.headers);
  if (user) {
    headers.set('x-user-info', JSON.stringify(user));
  }
  if (request.headers.get('referer') && ROUTES_TO_RELOAD.includes(pathname)) {
    headers.set('x-reload-on-back', 'true');
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/login',
    '/register',
    '/dashboard',
    '/',
  ],
};
