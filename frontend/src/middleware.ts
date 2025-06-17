/**
 * @file Next.js Middleware
 * @module middleware
 * @description Middleware for handling authentication, CSRF protection, and route-specific behaviors.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser, User } from "./lib/validate-user";

/**
 * Routes that should force a reload when navigating back
 * @constant {string[]}
 */
const ROUTES_TO_RELOAD = ["/login", "/register", "/dashboard"];

/**
 * Protected routes that require authentication
 * @constant {string[]}
 */
const PROTECTED_ROUTES = ["/dashboard", "/checkout"];

/**
 * Protected routes that require admin access
 * @constant {string[]}
 */
const ADMIN_ROUTES = ["/admin"];

/**
 * Middleware function to handle various checks and modifications for incoming requests
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response or redirection based on the middleware logic
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // CSRF protection for non-GET requests
  if (request.method !== "GET") {
    const originHeader = request.headers.get("Origin");
    const hostHeader = request.headers.get("Host");
    if (
      !originHeader ||
      !hostHeader ||
      new URL(originHeader).host !== hostHeader
    ) {
      return new NextResponse(null, {
        status: 403,
      });
    }
  }

  const user: User | null = await getUser();

  // Check if the user is an admin and trying to access admin routes
  // If the user is an admin, redirect them to the admin dashboard
  // If the user is not an admin, redirect them to the login page
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && user && user?.roles.includes("admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Redirect to dashboard if user is logged in and trying to access auth page
  if (request.nextUrl.pathname.startsWith("/login") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute && user && user.subscription.type === "free" 
    && request.nextUrl.pathname.startsWith("/checkout") === false
  ) {
    return NextResponse.redirect(new URL("/checkout", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set("x-user-info", JSON.stringify(user));
  }

  // Force reload logic
  const previousPage = requestHeaders.get("referer");
  if (
    previousPage &&
    ROUTES_TO_RELOAD.includes(new URL(request.url).pathname)
  ) {
    requestHeaders.set("x-reload-on-back", "true");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configuration for the middleware
 * @constant {Object}
 * @property {string[]} matcher - Array of route patterns to apply the middleware to
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ...ROUTES_TO_RELOAD,
  ],
};
