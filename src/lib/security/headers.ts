// Content Security Policy directives
export function getCSPDirectives(isDev = false): Record<string, string[]> {
  return {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      isDev ? "'unsafe-eval'" : "",
      "'unsafe-inline'",
      "https://js.stripe.com",
      "https://apis.google.com",
    ].filter(Boolean) as string[],
    "style-src": [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://images.unsplash.com",
      "https://lh3.googleusercontent.com",
      "https://avatars.githubusercontent.com",
      "https://picsum.photos",
      "https://fastly.picsum.photos",
      "https://img.freepik.com",
      "https://res.cloudinary.com",
    ],
    "font-src": [
      "'self'",
      "https://fonts.gstatic.com",
    ],
    "connect-src": [
      "'self'",
      "https://api.stripe.com",
      "https://*.upstash.io",
    ],
    "frame-src": [
      "'self'",
      "https://js.stripe.com",
      "https://hooks.stripe.com",
    ],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "manifest-src": ["'self'"],
  };
}

export function formatCSP(csp: Record<string, string[]>): string {
  return Object.entries(csp)
    .filter(([_, values]) => values.length > 0)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}

export function getSecurityHeaders(isDev = false): Record<string, string> {
  const csp = getCSPDirectives(isDev);
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "Content-Security-Policy": formatCSP(csp),
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "off",
    "X-Download-Options": "noopen",
    "X-Permitted-Cross-Domain-Policies": "none",
  } as Record<string, string>;
}
