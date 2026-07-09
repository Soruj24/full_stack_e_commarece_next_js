import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CSRF_COOKIE = "__Host-csrf-token";
const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Apply CSRF cookie to response
export function setCsrfCookie(response: NextResponse): NextResponse {
  const token = generateCsrfToken();
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

// Validate CSRF token from request
export function validateCsrf(request: NextRequest): boolean {
  if (SAFE_METHODS.includes(request.method)) {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

// CSRF error response
export function csrfErrorResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Invalid CSRF token" },
    { status: 403 }
  );
}
