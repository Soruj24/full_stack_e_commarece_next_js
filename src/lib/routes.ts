
export const LOGIN = '/login';
export const ROOT = '/';

export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/verify-email',
    '/api/auth/verify-email',
    '/api/auth/callback/google',
    '/api/auth/callback/github',
    '/api/auth/callback/credentials',
    '/api/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/validate-token',
    '/api/auth/accept-invite',
    '/banned',
    '/about',
    '/contact',
]

export const AUTH_API_ROUTES = [
    '/api/auth/session',
    '/api/auth/signout',
    '/api/auth/csrf',
]

export const ADMIN_ROUTES = [
    '/admin',
    '/admin/dashboard',
    '/api/admin',
]

export const PROTECTED_SUB_ROUTES = [
]

export const RATE_LIMITED_ROUTES: Record<string, { limit: number; window: number }> = {
    '/api/register': { limit: 3, window: 60 },
    '/api/verify-otp': { limit: 5, window: 60 },
    '/api/forgot-password': { limit: 3, window: 60 },
    '/api/auth/reset-password': { limit: 5, window: 300 },
    '/api/login': { limit: 5, window: 60 },
}