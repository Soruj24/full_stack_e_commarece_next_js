# Nexus E-Commerce Platform

[![Build](https://img.shields.io/github/actions/workflow/status/nexus/nexus-ecommerce/ci.yml?branch=main&style=flat-square)](https://github.com/nexus/nexus-ecommerce/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-strict?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

Nexus is an enterprise-grade, full-stack e-commerce platform built for scalability, security, and performance. Powered by Next.js 16 App Router, MongoDB 7, and TypeScript strict mode, it delivers a complete headless commerce solution with 78+ API endpoints, real-time notifications via Socket.io, dual payment gateway integration (Stripe + PayPal), and role-based access control across three tiers (admin, vendor, customer).

Designed with Clean Architecture and feature-based modular organization, Nexus separates business logic into 21 domain modules, each with its own hooks, services, types, validators, and React Context providers. The platform ships with a 25-module admin panel, customer dashboard, PWA support, Docker multi-stage builds, and a defense-in-depth security posture covering CSP, CSRF, rate limiting, NoSQL injection detection, audit logging, and 2FA.

---

## Architecture Overview

```
Client (Browser)                         External Services
      |                                        |
      v                                        v
+-------------------+   +-------------------+   +-------------------+
|  Next.js 16       |   |  Express +        |   |  MongoDB 7        |
|  App Router :3000  |   |  Socket.io :3001   |   |  Redis 7          |
|  (RSC + API)      |   |  (Real-time)      |   |  Stripe / PayPal  |
+--------+----------+   +---------+---------+   |  Cloudinary       |
         |                        |             |  SMTP / Resend    |
         v                        v             +-------------------+
+------------------------------------------+
|  Middleware Pipeline (src/proxy.ts)       |
|  Auth -> CSP -> CSRF -> Rate Limit ->    |
|  NoSQL Detection -> RBAC                 |
+------------------------------------------+
|  Feature Modules (21 domains)            |
|  auth, cart, checkout, products, orders, |
|  admin, categories, reviews, search,     |
|  wishlist, bundles, gift-cards, compare, |
|  notifications, returns, support, user,  |
|  vendor, analytics, settings, common     |
+------------------------------------------+
|  Core Infrastructure                     |
|  26 Mongoose models, NextAuth v5,        |
|  Redis cache, Stripe/PayPal SDK, Email   |
+------------------------------------------+
```

The platform follows **Clean Architecture** with strict dependency rules: presentation (`src/app/`) depends on domain (`src/modules/`), which depends on infrastructure (`src/core/`, `src/lib/`). Domain modules never import from presentation layers, ensuring business logic remains UI-agnostic and testable.

---

## Key Features

- **Full E-Commerce Engine** -- Products with variants, advanced cart (save-for-later, stock tracking), guest checkout, wishlist, product comparison, bundles, gift cards, coupons, real-time price/stock alerts, order tracking with timeline, PDF invoices, and returns management.
- **Admin Dashboard (25 modules)** -- Sales & revenue analytics, inventory management, user management with RBAC (roles/permissions), order processing, coupon & bundle administration, abandoned cart recovery, audit logs, notification broadcasting, FAQ/contact management, marketing banners, low-stock alerts, vendor payouts, and site-wide settings.
- **Customer Dashboard** -- Order history & tracking, wishlist management, returns & refunds, profile & address management, security settings (2FA, password, login history), support tickets, notification preferences, membership tier & loyalty points.
- **Real-Time Notifications** -- Standalone Express server (port 3001) with Socket.io delivering live order updates, admin alerts, and in-app notifications. Redis pub/sub for horizontal scaling.
- **Enterprise Security** -- 10-layer defense: Content Security Policy headers, CSRF double-submit cookie pattern, Redis + in-memory rate limiting (20 route-specific configurations), NoSQL injection scanning, input sanitization, RBAC (17 permissions across 3 roles), audit logging with sensitive field redaction, file upload validation (MIME, size, dimensions), environment variable validation via Zod, and 2FA via otplib.
- **Performance Optimized** -- React Server Components by default (154 static pages), dynamic imports for heavy components, React.memo on list renders, MongoDB lean queries with compound indexes, connection pooling (maxPoolSize: 10), Redis caching, standalone Next.js output for minimal Docker images, and bundle analysis support.
- **Docker Support** -- Multi-stage Dockerfile (deps -> builder -> runner, node:20-alpine), docker-compose for development (app + MongoDB 7 + Redis 7), docker-compose.prod.yml for production with healthchecks and logging configuration.
- **CI/CD Ready** -- GitHub Actions workflows for lint, typecheck, test, and build. Conventional commits enforced.
- **Fully Typed** -- TypeScript 5 strict mode with `@/*` path alias, 100+ domain-specific interfaces, Zod validation schemas for all API inputs, and exhaustive type exports from every module.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.0.7 (App Router, RSC) |
| **Language** | TypeScript 5 (strict mode) |
| **Database** | MongoDB 7 + Mongoose 9 (26 models) |
| **Authentication** | NextAuth v5 (beta.30) with Credentials, Google, GitHub OAuth + JWT strategy |
| **Payments** | Stripe 20 + PayPal SDK |
| **Real-Time** | Socket.io 4 + Express 4 (standalone server) |
| **Cache & Rate Limit** | Upstash Redis + in-memory fallback |
| **State Management** | Redux Toolkit + React Context + localStorage |
| **UI Library** | shadcn/ui (48 primitives) + Radix UI |
| **Styling** | Tailwind CSS v4 + tw-animate-css |
| **Animation** | Framer Motion 12 |
| **Forms & Validation** | React Hook Form + Zod 4 |
| **Email** | Nodemailer (SMTP) + Resend + React Email |
| **File Storage** | Cloudinary (image upload) |
| **Charts** | Recharts |
| **PDF Generation** | jsPDF + jspdf-autotable |
| **2FA** | otplib + speakeasy + qrcode |
| **Containerization** | Docker multi-stage + docker-compose |
| **Error Tracking** | Sentry (optional) |
| **Analytics** | Google Analytics 4 (optional) |
| **Bundle Analysis** | @next/bundle-analyzer |

---

## Quick Start

### Prerequisites

- Node.js 20+ (LTS)
- MongoDB 7 (local, Docker, or Atlas)
- npm 10+

### 1. Clone

```bash
git clone https://github.com/your-org/nexus-ecommerce.git
cd nexus-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values. At minimum, set:

```env
MONGODB_URI=mongodb://localhost:27017/full_stack_e_commerce_next_js
AUTH_SECRET=<generate with: openssl rand -base64 32>
ACCESS_TOKEN_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
REFRESH_TOKEN_SECRET=<generate with same method>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>
```

See [.env.example](.env.example) for all variables and [ENVIRONMENT.md](ENVIRONMENT.md) for detailed documentation.

### 4. Start Development Server

```bash
# Start Next.js dev server (port 3000)
npm run dev

# Start Socket.io server (port 3001) in a separate terminal
npm run dev:socket

# Or run both concurrently
npm run dev:all
```

### 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000). The platform includes seed data scripts for development.

---

## Project Structure

```
my-app/
├── src/
│   ├── app/                        # Next.js App Router (pages, API routes, layouts)
│   │   ├── (auth)/                 # Login, register, forgot-password, 2FA
│   │   ├── (shop)/                 # Products, cart, checkout, categories, search
│   │   ├── (dashboard)/            # Customer profile, orders, security, support
│   │   ├── admin/                  # 25 admin modules (dashboard, users, analytics...)
│   │   └── api/                    # 78 API endpoints across 28 resource groups
│   ├── modules/                    # 21 domain feature modules
│   │   ├── auth/                   # Authentication hooks, services, types
│   │   ├── cart/                   # Cart context, stock tracking, save-for-later
│   │   ├── checkout/               # Checkout flow, shipping, payment orchestration
│   │   ├── products/               # Products, reviews, price history, quick-view
│   │   ├── orders/                 # Orders, tracking, timeline
│   │   ├── admin/                  # Admin operations services
│   │   └── ...                     # 15 more domains
│   ├── core/                       # Infrastructure layer
│   │   ├── database/models/        # 26 Mongoose models
│   │   ├── database/repositories/  # Data access layer
│   │   ├── auth/                   # NextAuth re-exports
│   │   └── server/                 # Express + Socket.io (config, controllers, middleware)
│   ├── components/                 # UI components by domain
│   │   ├── ui/                     # 48 shadcn/ui primitives
│   │   ├── layout/                 # Header, mega-menu, footer, cart drawer
│   │   ├── home/                   # Homepage sections (hero, featured, testimonials)
│   │   ├── products/               # ProductCard, Gallery, QuickView, Filters
│   │   ├── admin/                  # Admin data tables, charts, forms
│   │   └── ...                     # Domain-specific components
│   ├── shared/                     # Shared types, hooks, utils, constants
│   ├── lib/                        # Infrastructure utilities
│   │   ├── auth/                   # NextAuth configuration
│   │   ├── security/               # CSP, CSRF, sanitize, upload, env, logger
│   │   ├── data/                   # Static data (menus, FAQ, footer, testimonials)
│   │   ├── stripe.ts               # Stripe client singleton
│   │   ├── redis.ts                # Redis + rate limiter
│   │   ├── email.ts                # Nodemailer + React Email templates
│   │   ├── socket.ts               # Socket.io client singleton
│   │   ├── rbac.ts                 # Role/permission checker
│   │   └── utils.ts                # cn(), formatDate(), formatRole()
│   ├── config/                     # Database connection configuration
│   └── proxy.ts                    # Next.js middleware (auth, security, rate-limit)
├── public/                         # Static assets, manifest, icons
├── scripts/                        # Healthcheck, seed, utility scripts
├── Dockerfile                      # Multi-stage build (deps -> builder -> runner)
├── docker-compose.yml              # Dev: app + MongoDB 7 + Redis 7
└── docker-compose.prod.yml         # Production: app with env var passthrough
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server on port 3000 |
| `npm run dev:socket` | Start Socket.io server on port 3001 (standalone) |
| `npm run dev:all` | Run both Next.js and Socket.io concurrently |
| `npm run build` | Production build with Next.js |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint across the codebase |
| `npm run typecheck` | Run TypeScript compiler check (`tsc --noEmit`) |
| `npm run test` | Run unit/integration tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ci` | Run tests with verbose reporter for CI |
| `npm run seed` | Seed database with development data |
| `npm run docker:build` | Build Docker images with Compose |
| `npm run docker:up` | Start Docker services (app, MongoDB, Redis) |
| `npm run docker:prod` | Start production Docker stack |

---

## Docker Usage

### Development

```bash
# Build and start all services
npm run docker:build
npm run docker:up
```

The `docker-compose.yml` starts three services:
- **app** -- Next.js on port 3000, built from local Dockerfile
- **mongodb** -- MongoDB 7 on port 27017 with persistent volume
- **redis** -- Redis 7 Alpine on port 6379 with persistent volume

All services communicate over the `nexus-network` bridge network.

### Production

```bash
npm run docker:prod
```

The production Compose file (`docker-compose.prod.yml`) runs only the app service with environment variables passed through from the host. Configure your MongoDB Atlas or managed Redis instance via environment variables. Includes healthcheck (30s interval), logging (json-file, 10MB max, 3 files), and auto-restart.

### Dockerfile Stages

1. **deps** -- `node:20-alpine`, `npm ci` (cached layer)
2. **builder** -- Copy node_modules, full source, `npm run build`
3. **runner** -- Minimal image with standalone output, non-root `nextjs` user, healthcheck

---

## Environment Variables

Environment configuration is documented in two places:

- **[.env.example](.env.example)** -- Complete variable reference with descriptions, required/optional markers, and generation instructions for secrets
- **[ENVIRONMENT.md](ENVIRONMENT.md)** -- Detailed guide covering all configuration categories (14 sections)

Key variable groups: Application URLs, OAuth providers (Google, GitHub), MongoDB connection, JWT secrets (access + refresh tokens), Upstash Redis, Cloudinary media storage, SMTP/Resend email, Socket.io, Stripe (publishable + secret + webhook), PayPal, Google Analytics, Sentry DSN, and logging level.

---

## Contributing

### Pull Request Process

1. Fork the repository and create a feature branch from `main`
2. Make your changes following the project's code conventions (TypeScript strict, feature-based organization)
3. Ensure all type checks pass: `npm run typecheck`
4. Ensure lint passes: `npm run lint`
5. Write or update tests as needed: `npm run test`
6. Submit a pull request with a clear description of changes

### Branch Naming

```
feature/<description>     # New features
fix/<description>         # Bug fixes
refactor/<description>    # Code refactoring
chore/<description>       # Maintenance, tooling, dependencies
docs/<description>        # Documentation
```

### Commit Convention

This project follows **Conventional Commits**:

```
<type>(<scope>): <description>

feat(auth): add 2FA backup codes
fix(cart): resolve quantity update race condition
refactor(checkout): extract payment orchestration
docs(readme): add Docker usage section
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

Scopes: `auth`, `cart`, `checkout`, `products`, `orders`, `admin`, `search`, `user`, `vendor`, `ui`, `api`, `db`

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
