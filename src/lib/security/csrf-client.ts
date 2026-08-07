const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function csrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { [CSRF_HEADER]: token } : {};
}

export async function csrfFetch(url: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const headers = new Headers(init?.headers);

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = getCsrfToken();
    if (token) {
      headers.set(CSRF_HEADER, token);
    }
  }

  return fetch(url, { ...init, headers });
}
