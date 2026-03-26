import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PUBLIC_ROUTES, LOGIN, ADMIN_ROUTES } from "@/lib/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Renamed from middleware to proxy as per Next.js deprecation warning
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const status = (req.auth?.user as unknown as { status: string })?.status;

  // Add x-pathname header for layout maintenance check
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", nextUrl.pathname);

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Block banned users from everything except maybe a "banned" page or logout
  if (isLoggedIn && status === "banned" && nextUrl.pathname !== "/banned") {
    return NextResponse.redirect(new URL("/banned", nextUrl));
  }

  // If logged in and trying to access login/register, redirect to dashboard
  if (
    isLoggedIn &&
    (nextUrl.pathname === LOGIN || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Admin access control
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // If not logged in and trying to access protected route, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads/|sw\\.js|manifest\\.json|offline\\.html).*)"],
};
