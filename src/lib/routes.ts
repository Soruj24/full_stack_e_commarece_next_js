
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
    '/api/forgot-password',
    '/banned',
    '/about',
    '/contact',
]

export const ADMIN_ROUTES = [
    '/admin',
    '/admin/dashboard',
    '/api/admin',
]

export const PROTECTED_SUB_ROUTES = [
]