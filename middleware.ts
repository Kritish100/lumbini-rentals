import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. IMMEDIATELY BYPASS NEXT.JS INTERNAL ASSETS
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes(".") // Skips files like favicon.ico, images, etc.
  ) {
    return NextResponse.next();
  }

  // If the path is login, allow access without checking for the cookie
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // since /admin/login is already checked, if the path starts with /admin, check for the cookie
  if (pathname.startsWith("/admin")) {
    const hasSessionCookie = request.cookies.has("auth_session");

    // If cookie doesn't exist, block the HTML payload and redirect immediately
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
