import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { PUBLIC_ROUTES, LOGIN, ADMIN_ROUTES, AUTH_API_ROUTES } from "@/lib/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
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

  if (isLoggedIn && status === "banned" && nextUrl.pathname !== "/banned") {
    return NextResponse.redirect(new URL("/banned", nextUrl));
  }

  if (
    isLoggedIn &&
    (nextUrl.pathname === LOGIN || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isApiRoute) {
    if (isPublicRoute || isAuthApiRoute) {
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
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

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/|sw\\.js|manifest\\.json|offline\\.html).*)",
  ],
};
