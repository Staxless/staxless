import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register"];

// Backend API URLs
const VERIFY_TOKEN_URL = "/api/validate-token";
const GENERATE_ACCESS_TOKEN_URL = "/api/generate-access-token";
const LOGIN_URL = "/api/login";
const LOGOUT_URL = "/api/logout";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute) {
    console.log("public");
    return NextResponse.next();
  }

  try {
    // Extract access token from request headers
    const accessToken = req.cookies.get("accessTokeToken");

    // Verify access token
    const verifyTokenResponse = await axios.post("/api/validate-token", {
      token: accessToken,
    });

    const { valid, decoded } = verifyTokenResponse.data;

    // Redirect unauthorized users
    if (!valid) {
      console.log("not valid");
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // If access token is expired or missing, use refresh token to generate new access token
    if (!decoded && isProtectedRoute) {
      const refreshToken = req.cookies.get("refreshToken");

      // Generate new access token
      const generateAccessTokenResponse = await axios.post(
        GENERATE_ACCESS_TOKEN_URL,
        {
          refreshToken,
        },
      );

      const { accessToken: newAccessToken } = generateAccessTokenResponse.data;

      // Set the new access token in the response headers
      return NextResponse.redirect(req.nextUrl);
    }

    // Redirect authenticated users for protected routes
    if (isProtectedRoute && decoded && path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (isPublicRoute && decoded && path.startsWith("/logout")) {
      try {
        const response = await axios.post(LOGOUT_URL);

        return response.data;
      } catch (error) {
        console.error("Logout error:", error);
        throw new Error("Logout failed");
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    // Handle error appropriately, such as redirecting to an error page
    return NextResponse.redirect(new URL("/error", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
