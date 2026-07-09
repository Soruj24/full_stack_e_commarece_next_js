# Agent Instructions for Nexus E-Commerce Platform

## Project Overview

Nexus is a comprehensive full-stack e-commerce platform built with Next.js 16, MongoDB, and TypeScript. It follows Clean Architecture with feature-based modular organization. Enterprise-grade security, Docker support, CI/CD ready.

## Delivery Readiness

- **Build**: `npm run build` -- 0 errors, 155 static pages, TypeScript strict
- **Lint**: `npm run lint` -- 0 errors (83 pre-existing React Compiler purity warnings, 190 TS warnings)
- **Typecheck**: `npm run typecheck` -- 0 errors
- **Docker**: `docker compose up --build` for dev, `docker compose -f docker-compose.prod.yml up -d` for prod
- **CI/CD**: GitHub Actions in `.github/workflows/` (ci.yml, cd.yml, docker-build.yml)
- **Documentation**: README.md, ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md, ENVIRONMENT.md, TESTING.md
- **Health check**: `GET /api/health` returns `{ status: "ok", timestamp, uptime }`
- **Error tracking**: Sentry ready (configure `NEXT_PUBLIC_SENTRY_DSN`)
- **Security**: CSP headers, CSRF, rate limiting, NoSQL injection protection, audit logging, 2FA
- **Performance**: 155 static pages, dynamic imports, React.memo, caching headers, MongoDB indexes, bundle analyzer

## Package Name and Scripts

```json
{
  "name": "nexus-ecommerce",
  "version": "1.0.0"
}
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run dev:socket` | Start Socket.io server standalone |
| `npm run dev:all` | Start both servers concurrently |
| `npm run build` | Production build (155 static pages) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (tsc --noEmit) |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:ci` | Vitest CI mode (verbose) |
| `npm run seed` | Run database seed |
| `npm run docker:build` | Docker compose build |
| `npm run docker:up` | Docker compose up |
| `npm run docker:prod` | Production Docker up |

## Key Directories

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router (pages, API routes, layouts)
│   │   ├── (auth)/             # Auth route group
│   │   ├── (shop)/             # Shop route group
│   │   ├── (dashboard)/        # Dashboard route group
│   │   ├── admin/              # Admin panel (28 pages)
│   │   └── api/                # API routes (78 endpoints + health)
│   ├── modules/                # Domain-driven feature modules (23 domains)
│   │   ├── admin/              # Admin panel (hooks, services, types)
│   │   ├── auth/               # Authentication & registration
│   │   ├── cart/               # Shopping cart & stock management
│   │   ├── checkout/           # Checkout flow & payments
│   │   ├── products/           # Products, reviews, search
│   │   ├── orders/             # Order management & tracking
│   │   └── ... (15 more modules)
│   ├── core/                   # Core infrastructure
│   │   ├── database/models/    # 26 Mongoose models
│   │   ├── config/             # Database config
│   │   ├── server/             # Express + Socket.io server
│   │   └── middleware/         # Auth guards
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── layout/             # Navbar, header, mega-menu
│   │   ├── admin/              # Admin components
│   │   ├── products/           # Product components
│   │   └── ... (40+ component directories)
│   ├── lib/                    # Shared utilities & infrastructure
│   │   ├── security/           # Enterprise security modules (7 files)
│   │   ├── auth/               # NextAuth configuration
│   │   ├── data/               # Static data (menus, testimonials, etc.)
│   │   ├── routes.ts           # Route constants & rate limits
│   │   └── utils.ts, validations.ts, stripe.ts, email.ts, redis.ts, ...
│   ├── shared/                 # Shared components, hooks, types, utils
│   ├── proxy.ts                # Next.js proxy (middleware) - auth, security, rate limiting
│   └── config/                 # Database configuration
├── .github/workflows/          # CI/CD (ci.yml, cd.yml, docker-build.yml)
├── Dockerfile                  # Multi-stage build
├── docker-compose.yml          # Dev services (app + mongo + redis)
├── docker-compose.prod.yml     # Production overrides
├── scripts/healthcheck.mjs     # Docker health check
├── public/                     # Static assets
└── *.md                        # 7 documentation files
```

## Architecture

- **Framework**: Next.js 16 App Router + React 19
- **Language**: TypeScript strict
- **Database**: MongoDB 7 + Mongoose 9 (26 models)
- **Auth**: NextAuth v5 (Credentials, Google, GitHub) + JWT
- **Styling**: Tailwind CSS v4 + shadcn/ui (55 Radix primitives)
- **Payments**: Stripe + PayPal
- **Real-time**: Socket.io (Express standalone on port 3001)
- **Caching/Rate limiting**: Upstash Redis
- **State**: React Context + Redux Toolkit
- **Email**: Nodemailer (SMTP) + Resend

## Code Style Guidelines

1. **Component Structure**: Functional components with hooks, named exports, TypeScript
2. **Naming**: PascalCase for components, camelCase with `use` prefix for hooks, PascalCase for types
3. **Imports**: Use `@/` path alias, double-quote strings, barrel exports from modules
4. **Styling**: Tailwind CSS, shadcn/ui patterns, `cn()` for class merging, dark mode support
5. **State**: React Context for global state, local state for component-specific, localStorage for cart/wishlist

## Enterprise Security (10 layers)

| Layer | Implementation |
|-------|---------------|
| CSP Headers | `src/lib/security/headers.ts` |
| CSRF Protection | `src/lib/security/csrf.ts` (double-submit cookie) |
| Rate Limiting | `src/lib/redis.ts` (sliding window, 22 routes in routes.ts) |
| NoSQL Injection | `src/proxy.ts` (regex detection on query params) |
| XSS Sanitization | `src/lib/security/sanitize.ts` |
| File Upload | `src/lib/security/upload.ts` (type/size/extension validation) |
| Audit Logging | `src/lib/security/audit.ts` (sensitive field redaction) |
| Security Logging | `src/lib/security/logger.ts` (structured JSON logs) |
| Env Validation | `src/lib/security/env.ts` (Zod schema) |
| RBAC | `src/lib/rbac.ts` (role-based access control) |

## Important Patterns

### Adding New Features
1. Create feature directory in `src/modules/<domain>/`
2. Add subdirectories: `hooks/`, `services/`, `types/`, `context/` (as needed)
3. Create barrel export `index.ts`
4. Add components in `src/components/<domain>/`
5. Add API routes in `src/app/api/<domain>/`

### Adding New API Routes
1. Create route in `src/app/api/`
2. Add rate limit config to `src/lib/routes.ts` if needed
3. Follow response format: `{ success: boolean, data?: any, error?: string, pagination? }`
4. Validate input with Zod
5. Add auth check via `auth()` from `@/lib/auth`

### Adding New Pages
1. Create in `src/app/` directory
2. Use App Router patterns
3. Add metadata for SEO
4. Support loading/error states

## Performance Optimizations

1. 155 static pages with ISR (revalidate)
2. Dynamic imports with `next/dynamic` + `ssr: false` + skeletons
3. React.memo on 12 components
4. useMemo on expensive computations
5. Cache-Control headers on 10+ API routes
6. MongoDB indexes on frequently queried fields
7. Pagination on list API routes
8. Bundle analyzer (`ANALYZE=true`)

## Deployment Checklist

1. `npm run build` -- must pass
2. `npm run typecheck` -- must pass (0 errors)
3. `npm run lint` -- review warnings
4. Configure environment variables per ENVIRONMENT.md
5. Run `docker compose -f docker-compose.prod.yml up -d`
6. Verify `GET /api/health` returns 200
7. Configure Sentry DSN for error tracking
8. Set up Stripe webhooks in production dashboard
9. Configure MongoDB Atlas IP whitelist
10. Set up Upstash Redis production instance

## Commit Message Best Practices

Use Conventional Commits: `<type>(<scope>): <description>`
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`
Scopes: `auth`, `cart`, `checkout`, `products`, `orders`, `admin`, `search`, `user`, `vendor`, `ui`, `api`, `db`, `security`, `docker`, `ci`, `docs`
