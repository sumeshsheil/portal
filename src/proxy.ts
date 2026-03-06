import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 Proxy — Portal Route Protection
 *
 * Domain: portal.budgettravelpackages.in
 * Focus: Admin & Agent access.
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";
  const landingUrl = isProduction
    ? process.env.LANDING_URL
    : process.env.LOCAL_LANDING_URL;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isProduction,
  });

  // 1. If customer is logged into portal, send them to the landing dashboard
  if (token && token.role === "customer") {
    return NextResponse.redirect(new URL("/dashboard", landingUrl));
  }

  // 2. Protect Admin & Agent routes
  if (url.pathname.startsWith("/admin") || url.pathname === "/") {
    // PUBLIC: Login page at root
    if (url.pathname === "/") {
      if (token && (token.role === "admin" || token.role === "agent")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // PROTECTED: /admin/*
    if (url.pathname.startsWith("/admin")) {
      // Allow onboarding publicly
      if (url.pathname === "/admin/onboarding") {
        return NextResponse.next();
      }

      if (!token) {
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("callbackUrl", url.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Must Change Password Enforcement
      if (
        token.mustChangePassword &&
        !url.pathname.startsWith("/admin/change-password")
      ) {
        return NextResponse.redirect(
          new URL("/admin/change-password", request.url),
        );
      }

      // Role-based access within Admin
      if (token.role === "agent") {
        const restrictedPaths = [
          "/admin/agents",
          "/admin/settings",
          "/admin/customers",
        ];
        if (restrictedPaths.some((p) => url.pathname.startsWith(p))) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    }
  }

  // 3. Protect Admin API routes
  if (url.pathname.startsWith("/api/admin")) {
    if (!token || token.role === "customer") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (
      token.role === "agent" &&
      url.pathname.startsWith("/api/admin/agents")
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/api/admin/:path*"],
};
