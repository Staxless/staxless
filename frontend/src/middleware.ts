import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import getUser from "./app/validateRequest";

// Define protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  try {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    let user;
    try {
      user = await getUser();
    } catch (error) {
      console.error("Error fetching user:", error);
    }

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isProtectedRoute && path.startsWith("/dashboard")) {
      return NextResponse.next();
    }

    if (path.startsWith("/logout")) {
      try {
        const response = await axios.post("/api/logout");
        return NextResponse.json(response.data);
      } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.redirect(new URL("/error", req.nextUrl));
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
