import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { PUBLIC_ROUTES, LOGIN, ADMIN_ROUTES, AUTH_API_ROUTES, RATE_LIMITED_ROUTES } from "@/lib/routes";
import { NextResponse } from "next/server";
import { getSecurityHeaders } from "@/lib/security/headers";
import { validateCsrf, setCsrfCookie } from "@/lib/security/csrf";
import { redisRateLimit } from "@/lib/redis";
import { securityLog } from "@/lib/security";

const NOSQL_PATTERNS = /\$where|\$ne|\$gt|\$gte|\$lt|\$lte|\$regex|\$exists|\$mod|\$in|\$nin|\$all|\$or|\$and|\$not/i;

function detectNoSQLInjection(value: unknown): boolean {
  if (typeof value === "string") {
    return NOSQL_PATTERNS.test(value);
  }
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some((v) => detectNoSQLInjection(v));
  }
  return false;
}

const { auth } = NextAuth(authConfig);

export const proxy = auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const status = (req.auth?.user as unknown as { status: string })?.status;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", nextUrl.pathname);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthApiRoute = AUTH_API_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPageRoute = !isApiRoute;

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Apply security headers to ALL responses
  const isDev = process.env.NODE_ENV === "development";
  const securityHeaders = getSecurityHeaders(isDev);
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Set CSRF cookie on page GET requests
  if (isPageRoute && req.method === "GET") {
    setCsrfCookie(response);
  }

  // CSRF validation for state-changing API requests
  if (isApiRoute && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    if (!validateCsrf(req)) {
      securityLog.warn("csrf:invalid", `Invalid CSRF token for ${req.method} ${nextUrl.pathname}`, {
        path: nextUrl.pathname,
        method: req.method,
      });
      return NextResponse.json(
        { success: false, error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  // Rate limiting for API routes
  if (isApiRoute) {
    const rateLimitConfig = RATE_LIMITED_ROUTES[nextUrl.pathname];
    if (rateLimitConfig) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                 req.headers.get("x-real-ip") ||
                 "unknown";
      const result = await redisRateLimit(ip, rateLimitConfig.limit, rateLimitConfig.window);
      if (!result.success) {
        securityLog.warn("ratelimit:exceeded", `Rate limit exceeded for ${nextUrl.pathname}`, {
          path: nextUrl.pathname,
          ip,
        });
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      response.headers.set("X-RateLimit-Limit", String(rateLimitConfig.limit));
      response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    }

    // NoSQL injection detection in query params
    const searchParams = Object.fromEntries(nextUrl.searchParams.entries());
    if (detectNoSQLInjection(searchParams)) {
      securityLog.warn("nosql:injection", `Potential NoSQL injection detected`, {
        path: nextUrl.pathname,
        details: searchParams,
      });
      return NextResponse.json(
        { success: false, error: "Invalid request parameters" },
        { status: 400 }
      );
    }
  }

  // Auth checks
  if (isLoggedIn && status === "banned" && nextUrl.pathname !== "/banned") {
    return NextResponse.redirect(new URL("/banned", nextUrl));
  }

  if (isLoggedIn && (nextUrl.pathname === LOGIN || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isApiRoute) {
    if (isPublicRoute || isAuthApiRoute) {
      return response;
    }

    if (!isLoggedIn) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (isAdminRoute && role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }
  }

  if (!isLoggedIn && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  return response;
});

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/|sw\\.js|manifest\\.json|offline\\.html).*)",
  ],
};
