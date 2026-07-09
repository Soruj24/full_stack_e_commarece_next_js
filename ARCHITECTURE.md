# Nexus E-Commerce Platform — Architecture Document

> **Version:** 1.0.0  
> **Framework:** Next.js 16.0.7 (App Router)  
> **Runtime:** Node.js 20+  
> **Database:** MongoDB 7 + Mongoose 9  
> **Auth:** NextAuth v5 (beta.30)  
> **Real-Time:** Socket.io 4 + Express  
> **Cache/Rate-Limit:** Upstash Redis  
> **Payments:** Stripe 20 + PayPal  
> **State:** Redux Toolkit + React Context  
> **Styling:** Tailwind CSS v4 + shadcn/ui  
> **Language:** TypeScript 5 (strict mode)  

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [High-Level Architecture Diagram](#2-high-level-architecture-diagram)
3. [Directory Structure & Layer Map](#3-directory-structure--layer-map)
4. [Clean Architecture Layers](#4-clean-architecture-layers)
5. [Data Flow](#5-data-flow)
6. [Authentication Flow](#6-authentication-flow)
7. [API Route Handling](#7-api-route-handling)
8. [Database Schema Overview](#8-database-schema-overview)
9. [Security Architecture](#9-security-architecture)
10. [Performance Optimizations](#10-performance-optimizations)
11. [Real-Time Architecture](#11-real-time-architecture)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Key Design Decisions](#13-key-design-decisions)

---

## 1. Architecture Philosophy

Nexus is architected around three core principles:

1. **Clean Architecture with Feature Modules** — Business logic is isolated in domain-specific modules under `src/modules/`, each owning its hooks, services, types, validators, and context. This ensures that changes to one domain (e.g., cart) never ripple across unrelated domains.

2. **Server-First by Default** — The Next.js App Router enables React Server Components (RSC) for nearly all page rendering. Client-side interactivity is explicitly opted into via `"use client"` boundaries, keeping bundle sizes small and first-load performance high.

3. **Defense in Depth** — Security is not an afterthought. Every request passes through a middleware pipeline that enforces CSP headers, CSRF tokens, rate limiting (Redis sliding window + in-memory fallback), NoSQL injection detection, and RBAC permissions before reaching any route handler.

---

## 2. High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (Browser)                              │
│  ┌────────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │ Next.js│  │ Socket  │  │ Stripe   │  │ Service   │  │ PWA        │  │
│  │ Pages  │  │ Client  │  │ Elements │  │ Worker    │  │ (manifest) │  │
│  └────┬───┘  └────┬────┘  └────┬─────┘  └─────┬─────┘  └────────────┘  │
└───────┼───────────┼────────────┼───────────────┼────────────────────────┘
        │           │            │               │
        ▼           │            │               │
┌───────────────────┼────────────┼───────────────┼────────────────────────┐
│          NEXT.JS 16 APP SERVER (Port 3000)      │                       │
│                                                  │                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    MIDDLEWARE (src/proxy.ts)                  │      │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │      │
│  │  │  Auth    │  │ Security │  │   Rate    │  │  NoSQL    │  │      │
│  │  │ (NextAuth)│  │ Headers  │  │  Limiting │  │ Detection │  │      │
│  │  │  + CSRF  │  │  (CSP)   │  │  (Redis)  │  │   Filter  │  │      │
│  │  └──────────┘  └──────────┘  └───────────┘  └───────────┘  │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                  │                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    APP ROUTER (src/app/)                      │      │
│  │                                                                │      │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │      │
│  │  │   (auth)/    │  │   (shop)/    │  │     admin/         │  │      │
│  │  │  login       │  │  products/   │  │  dashboard/        │  │      │
│  │  │  register    │  │  cart/       │  │  users/            │  │      │
│  │  │  forgot-pwd  │  │  checkout/   │  │  orders/           │  │      │
│  │  └──────────────┘  │  orders/     │  │  analytics/        │  │      │
│  │                    │  categories/ │  │  settings/         │  │      │
│  │  ┌──────────────┐  └──────────────┘  └────────────────────┘  │      │
│  │  │  api/        │                                             │      │
│  │  │  28 route    │  ┌──────────────┐  ┌────────────────────┐  │      │
│  │  │  groups      │  │  (dashboard)/│  │  Static Pages      │  │      │
│  │  └──────────────┘  │  profile/    │  │  about, contact,   │  │      │
│  │                    │  security/   │  │  faq, careers,     │  │      │
│  │                    │  support/    │  │  pricing, docs     │  │      │
│  │                    └──────────────┘  └────────────────────┘  │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                  │                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                   FEATURE MODULES (src/modules/)              │      │
│  │  23 domains: auth, cart, checkout, products, orders, admin,  │      │
│  │  categories, reviews, search, wishlist, bundles, gift-cards, │      │
│  │  compare, notifications, returns, support, user, vendor,     │      │
│  │  analytics, settings, common, notifications                  │      │
│  │                                                                │      │
│  │  Each module:                                                  │      │
│  │  ┌──────────────────────────────────────────────┐             │      │
│  │  │  hooks/  services/  types/  validators/      │             │      │
│  │  │  context/  components/  index.ts             │             │      │
│  │  └──────────────────────────────────────────────┘             │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                  │                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    CORE INFRASTRUCTURE (src/core/)            │      │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │      │
│  │  │  Database    │  │    Auth      │  │    Express Server  │  │      │
│  │  │  26 models   │  │  NextAuth    │  │  Socket.io (3001)  │  │      │
│  │  │  Repositories│  │  Config     │  │  Controllers       │  │      │
│  │  │  Seed scripts│  │             │  │  Middleware         │  │      │
│  │  └──────────────┘  └──────────────┘  └────────────────────┘  │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                  │                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │               SHARED LAYER (src/shared/ + src/lib/)          │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │      │
│  │  │  Lib     │ │ Security │ │  Data    │ │  Components    │  │      │
│  │  │  stripe  │ │  CSP     │ │  menus   │ │  48 shadcn/ui  │  │      │
│  │  │  redis   │ │  CSRF    │ │  footer  │ │  Layout parts  │  │      │
│  │  │  email   │ │  Audit   │ │  faq     │ │  Forms         │  │      │
│  │  │  utils   │ │  Logger  │ │  pricing │ │  Charts        │  │      │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │      │
│  └──────────────────────────────────────────────────────────────┘      │
└───────────────────┬─────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌─────────┐  │
│  │ MongoDB  │  │  Redis   │  │  Stripe   │  │  PayPal  │  │   SMTP  │  │
│  │ (Atlas)  │  │(Upstash) │  │  Gateway  │  │  API     │  │  Server │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘  └─────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐                              │
│  │ Google   │  │ GitHub   │  │ Cloudinary│                              │
│  │ OAuth    │  │ OAuth    │  │ (images)  │                              │
│  └──────────┘  └──────────┘  └───────────┘                              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure & Layer Map

```
my-app/
├── src/
│   ├── app/                          # PRESENTATION LAYER
│   │   ├── (auth)/                   #   Auth route group (login, register, etc.)
│   │   ├── (shop)/                   #   Shop route group (14 route groups)
│   │   ├── (dashboard)/              #   User dashboard route group
│   │   ├── admin/                    #   Admin panel (26 sub-sections)
│   │   ├── api/                      #   API routes (28 resource groups)
│   │   ├── layout.tsx                #   Root layout with all providers
│   │   ├── providers.tsx             #   Client-side provider composition
│   │   └── globals.css               #   Tailwind v4 + CSS variables
│   │
│   ├── modules/                      # DOMAIN/BUSINESS LOGIC LAYER
│   │   ├── auth/                     #   Authentication domain
│   │   ├── admin/                    #   Admin operations domain
│   │   ├── analytics/                #   Analytics & reporting
│   │   ├── bundles/                  #   Product bundles
│   │   ├── cart/                     #   Shopping cart + stock + save-for-later
│   │   ├── categories/               #   Category tree management
│   │   ├── checkout/                 #   Checkout flow + guest checkout
│   │   ├── common/                   #   Shared contexts (localization, recently-viewed)
│   │   ├── compare/                  #   Product comparison
│   │   ├── gift-cards/               #   Gift card system
│   │   ├── notifications/            #   Notification preferences
│   │   ├── orders/                   #   Order management & tracking
│   │   ├── products/                 #   Products, price history, quick-view
│   │   ├── returns/                  #   Return requests & processing
│   │   ├── reviews/                  #   Product reviews & moderation
│   │   ├── search/                   #   Product search (context-based)
│   │   ├── settings/                 #   Site settings context
│   │   ├── support/                  #   Support tickets
│   │   ├── user/                     #   User profile management
│   │   ├── vendor/                   #   Vendor operations
│   │   └── wishlist/                 #   Wishlist management
│   │   │
│   │   └── Each module typically contains:
│   │       ├── index.ts              #   Barrel export
│   │       ├── hooks/                #   React hooks (data fetching, form handling)
│   │       ├── services/             #   API clients, server actions
│   │       ├── types/                #   Domain-specific TypeScript interfaces
│   │       ├── validators/           #   Zod validation schemas
│   │       ├── context/              #   React Context providers
│   │       └── components/           #   Domain-specific components
│   │
│   ├── core/                         # INFRASTRUCTURE LAYER
│   │   ├── config/                   #   Database connection, env config
│   │   ├── database/
│   │   │   ├── models/               #   26 Mongoose schemas
│   │   │   ├── repositories/         #   Order/Product/User repositories
│   │   │   └── seed/                 #   Database seed scripts
│   │   ├── auth/                     #   Auth re-exports
│   │   ├── middleware/               #   Auth guard utilities
│   │   └── server/                   #   Express + Socket.io server
│   │       ├── config/               #   Server configuration
│   │       ├── controllers/          #   Socket event handlers
│   │       ├── middlewares/          #   Socket auth middleware
│   │       ├── routes/               #   Socket route setup
│   │       ├── services/             #   Server-side services
│   │       └── validators/           #   Server-side validation
│   │
│   ├── components/                   # UI COMPONENT LAYER
│   │   ├── ui/                       #   48 shadcn/ui primitives
│   │   ├── layout/                   #   Header, navbar, mega-menu, cart drawer
│   │   ├── home/                     #   Homepage sections
│   │   ├── products/                 #   Product cards, details, filters
│   │   ├── admin/                    #   Admin panel components
│   │   ├── auth/                     #   Login/register forms
│   │   ├── cart/                     #   Cart components
│   │   ├── checkout/                 #   Checkout form components
│   │   ├── orders/                   #   Order timeline, cards
│   │   ├── search/                   #   Search bar, filters
│   │   ├── support/                  #   LiveChat, FAQ
│   │   ├── dashboard/               #   Dashboard widgets
│   │   ├── pwa/                      #   PWA install banner, offline indicator
│   │   ├── legal/                    #   Cookie consent
│   │   ├── common/                   #   NotificationLayout
│   │   └── ...                       #   Other domain-specific components
│   │
│   ├── shared/                       # SHARED UTILITIES
│   │   ├── components/               #   Theme toggle, mode toggle
│   │   ├── hooks/                    #   useDebounce, useLocalStorage, useMounted
│   │   ├── types/                    #   Shared API, product, user, order types
│   │   ├── utils/                    #   cn(), format(), helpers
│   │   ├── constants/                #   Routes, permissions constants
│   │   ├── lib/                      #   Re-export barrels for lib modules
│   │   └── services/                 #   API client base
│   │
│   ├── lib/                          # SHARED INFRASTRUCTURE
│   │   ├── auth/                     #   NextAuth config, handler
│   │   ├── security/                 #   CSP, CSRF, env, audit, logger, sanitize, upload
│   │   ├── middleware/               #   (reserved for middleware utilities)
│   │   ├── data/                     #   Static data (menus, testimonials, FAQ, footer)
│   │   ├── stripe.ts                 #   Stripe client singleton
│   │   ├── redis.ts                  #   Upstash Redis + rate limiter
│   │   ├── email.ts                  #   Nodemailer + email templates
│   │   ├── socket.ts                 #   Socket.io client singleton
│   │   ├── audit.ts                  #   Audit logging service
│   │   ├── notifications.ts          #   Notification creation service
│   │   ├── permissions.ts            #   RBAC permission definitions
│   │   ├── rbac.ts                   #   Role/permission check helpers
│   │   ├── rate-limit.ts             #   In-memory rate limit fallback
│   │   ├── routes.ts                 #   Public, admin, auth, rate-limited route defs
│   │   ├── validations.ts            #   Zod schemas (register, login, product, settings)
│   │   ├── utils.ts                  #   cn(), formatDate(), formatRole(), etc.
│   │   ├── analytics.ts              #   Analytics tracking
│   │   ├── sms.ts                    #   SMS notifications
│   │   ├── invoice.ts                #   PDF invoice generation
│   │   └── ...                       #   Other utility modules
│   │
│   ├── config/                       #   (reserved, currently empty)
│   └── proxy.ts                      #   Next.js middleware (auth, security, rate-limit)
│
├── server/                           # Standalone Express socket server entry
├── public/                           # Static assets (images, manifest, sw)
├── scripts/                          # Healthcheck, seed, utility scripts
└── docker-compose.yml                # App + MongoDB 7 + Redis 7
```

### Module Anatomy (example: `src/modules/cart/`)

```
src/modules/cart/
├── index.ts                          # Barrel exports
├── context/
│   ├── CartContext.tsx                # Cart state (add, remove, update qty)
│   ├── StockContext.tsx               # Real-time stock tracking
│   └── SaveForLaterContext.tsx        # Save-for-later functionality
├── hooks/
│   └── use-cart-drawer.ts            # Cart sidebar open/close state
├── services/
│   └── cart-service.ts               # API calls for cart operations
├── types/
│   └── index.ts                      # CartItem, CartContextType, etc.
└── validators/
    └── index.ts                      # Cart-specific Zod schemas
```

---

## 4. Clean Architecture Layers

The codebase enforces a strict dependency rule: **outer layers may depend on inner layers, never the reverse.**

```
┌────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│  src/app/ (pages, layouts, API routes)                 │
│  src/components/ (UI components)                       │
│  Depends on: Modules, Shared, Lib                      │
├────────────────────────────────────────────────────────┤
│                     DOMAIN                              │
│  src/modules/*/ (hooks, services, context, types)      │
│  Depends on: Core (models), Shared (types, lib)        │
│  Does NOT depend on: App, Components                   │
├────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE                         │
│  src/core/ (models, server, auth, database)            │
│  src/lib/ (stripe, redis, email, security, utils)      │
│  src/shared/ (types, hooks, utils, components)         │
│  Depends on: Nothing internal (only external packages)  │
└────────────────────────────────────────────────────────┘
```

### Dependency Rules

| Layer | Can Import From | Cannot Import From |
|-------|----------------|-------------------|
| `src/app/` | `src/modules/`, `src/components/`, `src/core/`, `src/lib/`, `src/shared/` | — |
| `src/modules/` | `src/core/`, `src/lib/`, `src/shared/` | `src/app/`, `src/components/` |
| `src/core/` | `src/shared/`, external packages | `src/app/`, `src/modules/`, `src/components/` |
| `src/lib/` | `src/core/` (models), external packages | `src/app/`, `src/modules/`, `src/components/` |
| `src/components/` | `src/modules/`, `src/shared/` | `src/app/` (pages) |

> **Note:** `src/components/` is allowed to import from `src/modules/` because components render domain state. The reverse (modules importing from components) is prohibited — modules must be UI-agnostic.

---

## 5. Data Flow

### Page Request Flow (RSC)

```
1. Browser Request  ──►  Next.js Edge/CDN
2.                          │
3.                    src/proxy.ts  (Middleware)
4.                    ├── Authenticate (NextAuth JWT)
5.                    ├── Set security headers (CSP, HSTS, etc.)
6.                    ├── Set CSRF cookie (GET page requests)
7.                    ├── Rate limiting (Redis sliding window)
8.                    ├── NoSQL injection scan (query params)
9.                    ├── Auth redirects (banned, admin, unauthenticated)
10.                   └── Pass to App Router
11.                          │
12.                    src/app/layout.tsx  (Root Layout - Server Component)
13.                    ├── Read settings (maintenance mode, GA ID)
14.                    ├── Inject global providers
15.                    └── Render children
16.                          │
17.                    Route Page (Server Component)
18.                    ├── Fetch data directly (await dbConnect, query)
19.                    ├── Or delegate to Client Component
20.                    └── Return JSX
```

### API Request Flow

```
1. Client Action / Fetch  ──►  src/proxy.ts
2.  ├── CSRF validation (state-changing methods)
3.  ├── Rate limiting (per-route configuration)
4.  ├── NoSQL injection scan
5.  └── Auth check (JWT session validation)
6.                            │
7.                      src/app/api/<route>/route.ts
8.  ├── Parse & validate input (Zod)
9.  ├── RBAC permission check (checkPermission)
10. ├── Business logic (module services)
11. ├── Database operations (Mongoose models / repositories)
12. ├── Audit logging (logAuditEvent)
13. └── Response { success, data?, error?, pagination? }
```

### Client-Side Data Flow (Context + Redux)

```
User Action (add to cart, etc.)
        │
        ▼
Module Hook (e.g., useAddToCart)
        │
        ▼
Context Dispatch (e.g., CartContext)
        │
        ├── Update local state (immediate UI)
        ├── Persist to localStorage (cart persistence)
        └── API call via Service (e.g., CartService.sync())
                │
                ▼
        API Route ──► Middleware ──► Database
                │
                ▼
        Response ──► Context update (if needed)
```

### Real-Time Data Flow (Socket.io)

```
Server Event (order update, notification)
        │
        ▼
Express Server (port 3001)
        │
        ▼
Socket.io ──► Client Socket (socket.io-client)
        │
        ▼
Client Handler (notification, orderUpdate)
        │
        ▼
Context Update (NotificationContext, OrderTrackingContext)
        │
        ▼
UI Re-render (toast, badge count, etc.)
```

---

## 6. Authentication Flow

### Architecture

Authentication uses **NextAuth v5** with a **JWT session strategy** and three providers:

| Provider | Type | Configuration |
|----------|------|--------------|
| Credentials | Email/Password + optional 2FA OTP | `src/lib/auth/index.ts:94` |
| Google | OAuth 2.0 | `src/lib/auth/index.ts:86` |
| GitHub | OAuth 2.0 | `src/lib/auth/index.ts:90` |

### Credential Login Flow

```
1. User submits email + password
2. authorize() called (src/lib/auth/index.ts:100)
3. ├── dbConnect()
4. ├── Find user by email (.select("+password +twoFactorSecret +refreshToken"))
5. ├── Check: banned? ──► throw "banned"
6. ├── Check: verified? ──► throw "verify email"
7. ├── Check: locked? (5+ failed attempts) ──► throw "locked"
8. ├── bcrypt.compare(password) ──► fail? increment attempts, throw
9. ├── 2FA enabled? ──► validate OTP via otplib
10.├── Success: reset loginAttempts, update lastLogin
11.├── Create Session document (refresh token, 30-day expiry)
12.├── logAction("LOGIN"), recordLoginHistory()
13.└── Return user object → NextAuth creates JWT
```

### Social Login Flow (Google/GitHub)

```
1. User clicks social button → OAuth redirect
2. Callback → signIn() callback (src/lib/auth/index.ts:337)
3. ├── Find existing user by email
4. │   ├── Found? Update image if changed, set user.id/role/status
5. │   └── Not found? Create user (first user = admin), log SIGNUP_SUCCESS
6. └── Return true/false
```

### JWT Callback Flow

```
1. jwt() callback runs on every token access
2. ├── Initial login: Attach id, role, status, refreshToken, sessionId
3. ├── Subsequent accesses:
4. │   ├── Query DB for user status (banned? → expired)
5. │   ├── Query DB for lock status (locked? → expired)
6. │   └── Query Session document (revoked/expired? → expired)
7. └── If expired → session.expires = new Date(0) → forces logout
```

### Session Revocation

```
Sign Out → events.signOut() (src/lib/auth/index.ts:311)
├── Set Session.revoked = true
├── User.refreshToken = undefined (via $unset)
└── logAction("LOGOUT")
```

### Account Lockout

- **Threshold:** 5 consecutive failed login attempts
- **Lockout duration:** 15 minutes (`15 * 60 * 1000` ms)
- **Resets on:** Successful login

### Password Policy

- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character
- Regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`

---

## 7. API Route Handling

### Route Organization

28 API resource groups under `src/app/api/`:

```
api/
├── abandoned-carts/       # Abandoned cart recovery
├── admin/                 # Admin operations
│   ├── users/             # User management
│   ├── db-stats/          # Database statistics
│   └── ...                # Other admin sub-routes
├── auth/                  # NextAuth, 2FA, sessions, login history
│   ├── [...nextauth]/     # NextAuth catch-all handler
│   ├── 2fa/               # 2FA enable/verify/disable
│   ├── sessions/          # Session management
│   ├── login-history/     # Login history queries
│   └── ...                # Other auth routes
├── brands/                # Brand CRUD
├── bundles/               # Product bundle CRUD
├── categories/            # Category tree CRUD
├── contact/               # Contact form submissions
├── coupons/               # Coupon CRUD
├── faqs/                  # FAQ CRUD
├── forgot-password/       # Password reset requests
├── gift-cards/            # Gift card CRUD and redemption
├── health/                # Health check endpoint
├── notifications/         # Notification CRUD
├── orders/                # Order CRUD, status updates
├── payments/              # Payment processing (Stripe/PayPal)
├── payouts/               # Vendor payout management
├── price-alerts/          # Price drop notifications
├── products/              # Product CRUD, search, filtering
├── register/              # User registration
├── returns/               # Return request CRUD
├── search/                # Product search
├── settings/              # Site settings CRUD
├── stock-alerts/          # Stock notification subscriptions
├── tickets/               # Support ticket CRUD
├── upload/                # File/image upload
├── user/                  # Profile, password, preferences
├── vendors/               # Vendor CRUD
└── verify-otp/            # Email verification OTP
```

### Handler Pattern

Every API route follows this pattern:

```typescript
// src/app/api/products/route.ts (example)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { checkPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    // 1. Auth + RBAC check
    const { authorized, response } = await checkPermission(PERMISSIONS.VIEW_PRODUCTS);
    if (!authorized) return response;

    // 2. Parse and validate query params
    // 3. Execute business logic
    await dbConnect();
    const products = await Product.find().lean();

    // 4. Return consistent response
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Response Format

Every API response follows this contract:

```typescript
// Success
{ success: true, data: T, pagination?: { page, limit, total, totalPages } }

// Error
{ success: false, error: string }

// Validation Error
{ success: false, error: string, details?: { field: string, message: string }[] }
```

### HTTP Status Codes Used

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (created) |
| 204 | Successful DELETE |
| 400 | Validation failure, bad request |
| 401 | Unauthenticated |
| 403 | Authenticated but forbidden (RBAC) |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate email) |
| 429 | Rate limited |
| 500 | Internal server error |

---

## 8. Database Schema Overview

### Model Catalog (26 Mongoose Models)

All models reside in `src/core/database/models/` and follow a consistent pattern: TypeScript interface + Mongoose schema with timestamps, indexes, and validation.

| Model | Collection | Key Fields | Indexes |
|-------|-----------|------------|---------|
| **User** | `users` | name, email, password, role, status, 2FA, addresses, wishlist, loginAttempts, lockUntil, membershipTier, referralCode, loyaltyPoints | email (unique), role, status |
| **Product** | `products` | name, slug, price, discountPrice, images, variants[], category, brand, tags, stock, specifications, dimensions, shipping, reviews[], isFeatured, isActive | slug (unique), category, price, tags, isActive |
| **Order** | `orders` | user, items[], shippingAddress, paymentMethod, paymentStatus, orderStatus, totalAmount, trackingNumber | user, orderStatus, createdAt |
| **Category** | `categories` | name, slug, parent, description, image, isActive, order | slug (unique), parent |
| **Bundle** | `bundles` | name, slug, products[], price, discount, isActive, validUntil | slug (unique) |
| **Coupon** | `coupons` | code, discountType, discountValue, minAmount, usageLimit, usedCount, validFrom, validUntil | code (unique) |
| **Brand** | `brands` | name, slug, description, logo, website, isActive | slug (unique) |
| **Banner** | `banners` | title, image, link, isActive, position, order | isActive, position |
| **GiftCard** | `giftcards` | code, balance, originalAmount, senderEmail, recipientEmail, message, expiresAt | code (unique), recipientEmail |
| **Return** | `returns` | order, user, items[], reason, status, refundAmount, trackingNumber | order, user, status |
| **Vendor** | `vendors` | name, email, storeName, storeDescription, commission, payoutMethod, status, totalSales, rating | email (unique), storeName (unique) |
| **Notification** | `notifications` | userId, title, message, type, link, isRead | userId, isRead, createdAt |
| **SupportTicket** | `supporttickets` | user, subject, description, status, priority, messages[] | user, status, priority |
| **AuditLog** | `auditlogs` | action, userId, userEmail, entityType, entityId, changes, ipAddress, userAgent | action, userId, entityType, createdAt |
| **Session** | `sessions` | userId, sessionToken, expires, ipAddress, userAgent, revoked | userId, sessionToken, expires |
| **Token** | `tokens` | userId, token, type, expires | token (unique), userId, type |
| **LoginHistory** | `loginhistories` | userId, email, ipAddress, userAgent, device, browser, os, success, reason | userId, success, createdAt |
| **AbandonedCart** | `abandonedcarts` | user, email, items[], totalAmount, lastActive, notified | email, lastActive |
| **StockAlert** | `stockalerts` | user, email, product, variant, isActive, notified | product, email |
| **PriceHistory** | `pricehistories` | product, variant, price, date | product, date |
| **Payout** | `payouts` | vendor, amount, status, paymentMethod, paidAt | vendor, status |
| **Settings** | `settings` | siteName, contactEmail, allowRegistration, maintenanceMode, currency, stripeEnabled, paypalEnabled, googleAnalyticsId | singleton |
| **PopularSearch** | `popularsearches` | query, count, lastSearched | query (unique) |
| **ContactMessage** | `contactmessages` | name, email, subject, message, isRead | isRead, createdAt |
| **Faq** | `faqs` | question, answer, category, order, isActive | category, isActive |
| **PriceHistory** | `pricehistories` | product, variant, price, date | product + date (compound) |

### Key Relationships

```
User ──1:N──► Order
User ──1:N──► Notification
User ──1:N──► LoginHistory
User ──1:N──► Session
User ──1:N──► SupportTicket
User ──1:N──► AuditLog (as userId)
User ──1:N──► Return
User ──1:N──► AbandonedCart
User ──1:N──► StockAlert
User ──N:M──► Product (wishlist)
User ──N:M──► Product (reviews embedded)

Product ──N:1──► Category
Product ──N:1──► Brand
Product ──1:N──► PriceHistory
Product ──1:N──► OrderItem (embedded in Order)

Order ──1:N──► Return
Order ──N:1──► User

Bundle ──N:M──► Product

Vendor ──1:N──► Payout
```

### Database Connection (src/core/config/database.ts)

- **Caching:** Global mongoose instance cached via `globalThis` (hot module reload safe)
- **Pool:** `maxPoolSize: 10` (configurable)
- **Timeouts:** `serverSelectionTimeoutMS: 30000`, `socketTimeoutMS: 45000`, `connectTimeoutMS: 30000`
- **DNS:** Custom DNS servers (`1.1.1.1`, `8.8.8.8`) for reliability
- **Connection check:** Reuses existing connection if `readyState === 1`

---

## 9. Security Architecture

### Defense in Depth — Middleware Pipeline (src/proxy.ts)

Every request passes through 6 security layers **before reaching any route handler**:

```
Request ──►
  1. Authentication (NextAuth JWT)
  2. Security Headers (CSP, HSTS, XFO, etc.)
  3. CSRF Cookie + Validation
  4. Rate Limiting (Redis sliding window)
  5. NoSQL Injection Detection
  6. RBAC Authorization
  ──► Route Handler
```

### Layer 1: Content Security Policy (src/lib/security/headers.ts)

```
default-src 'self'
script-src  'self' 'unsafe-inline' https://js.stripe.com https://apis.google.com
style-src   'self' 'unsafe-inline' https://fonts.googleapis.com
img-src     'self' data: blob: https://images.unsplash.com (et al.)
font-src    'self' https://fonts.gstatic.com
connect-src 'self' https://api.stripe.com https://*.upstash.io
frame-src   'self' https://js.stripe.com https://hooks.stripe.com
frame-ancestors 'none'
form-action 'self'
base-uri    'self'
object-src  'none'
```

### Layer 2: HTTP Security Headers (src/lib/security/headers.ts + next.config.ts)

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Cross-Origin-Embedder-Policy` | `require-corp` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-DNS-Prefetch-Control` | `off` |
| `X-Download-Options` | `noopen` |
| `X-Permitted-Cross-Domain-Policies` | `none` |

### Layer 3: CSRF Protection (src/lib/security/csrf.ts)

- **Mechanism:** Double-submit cookie pattern
- **Cookie:** `__Host-csrf-token` (httpOnly, secure, sameSite=strict, 24h expiry)
- **Header:** `x-csrf-token`
- **Validation:** Constant-time comparison (`crypto.timingSafeEqual`) to prevent timing attacks
- **Scope:** Applied to all state-changing API requests (POST, PUT, PATCH, DELETE)
- **Exception:** Safe methods (GET, HEAD, OPTIONS) are exempt

### Layer 4: Rate Limiting (src/lib/redis.ts)

**Two implementations:**

| Strategy | Function | Mechanism | Use Case |
|----------|----------|-----------|----------|
| Fixed Window | `redisRateLimit()` | Redis `INCR` + `EXPIRE` | General per-route limits |
| Sliding Window | `slidingWindowRateLimit()` | Redis `ZREMRANGEBYSCORE` + `ZADD` + `ZCARD` | High-precision limits |

**Per-route configuration** (src/lib/routes.ts):

| Route | Limit | Window (s) |
|-------|-------|-----------|
| `/api/register` | 3 | 60 |
| `/api/verify-otp` | 5 | 60 |
| `/api/forgot-password` | 3 | 60 |
| `/api/auth/reset-password` | 5 | 300 |
| `/api/login` | 5 | 60 |
| `/api/contact` | 3 | 300 |
| `/api/reviews` | 10 | 60 |
| `/api/orders` | 30 | 60 |
| `/api/cart` | 60 | 60 |
| `/api/checkout` | 10 | 60 |
| `/api/user/password` | 3 | 300 |
| `/api/user/profile` | 10 | 60 |
| `/api/vendors` | 5 | 60 |
| `/api/bundles` | 10 | 60 |
| `/api/gift-cards` | 10 | 60 |
| `/api/coupons` | 20 | 60 |
| `/api/upload` | 10 | 60 |
| `/api/notifications` | 30 | 60 |
| `/api/tickets` | 10 | 60 |
| `/api/price-alerts` | 10 | 60 |
| `/api/stock-alerts` | 10 | 60 |

**Fallback:** `src/lib/rate-limit.ts` — in-memory `Map<string, { count, lastReset }>` for environments without Redis.

### Layer 5: NoSQL Injection Prevention (src/proxy.ts:10-20)

- Scans all query parameters for MongoDB operator patterns (`$where`, `$ne`, `$regex`, `$gt`, `$in`, etc.)
- Recursive check on nested objects
- Returns `400` with `"Invalid request parameters"` and logs to security log

### Layer 6: Input Sanitization (src/lib/security/sanitize.ts)

```
sanitizeInput() = stripNonPrintable(stripHtml())
  ├── stripHtml(): Remove HTML tags, angle brackets, javascript: protocol, event handlers
  ├── sanitizeObject(): Recursively sanitize all string fields
  ├── escapeRegex(): Escape MongoDB regex special characters
  └── sanitizeFilename(): Remove path traversal, limit to 255 safe chars
```

### Layer 7: Audit Logging (src/lib/audit.ts + src/lib/security/audit.ts)

Every security-relevant action is persisted to the `AuditLog` collection:

**Audited events:** Login, logout, signup, password reset, 2FA, profile update, admin actions (role change, ban), failed auth attempts, session revocation.

**Audit entry format:**
```
{
  action: "LOGIN" | "LOGOUT" | "SIGNUP_SUCCESS" | "ADMIN_UPDATE_USER" | ...,
  userId: ObjectId,
  userEmail: string,
  entityType: "USER" | "ORDER" | "PRODUCT" | ...,
  entityId: string,
  changes: { ... },        // Sensitive fields redacted
  ipAddress: string,
  userAgent: string,
  createdAt: Date
}
```

**Sensitive field redaction:** `password`, `token`, `secret`, `key`, `authorization`, `cookie`, `csrf`, `jwt` patterns are automatically redacted to `[REDACTED]`.

### Layer 8: Security Logging (src/lib/security/logger.ts)

Structured security event logging with levels: `info`, `warn`, `error`, `critical`.

```typescript
securityLog.warn("ratelimit:exceeded", "Rate limit exceeded", {
  path: "/api/login", ip: "192.168.1.1"
});
securityLog.critical("auth:bruteforce", "Brute force detected", { userId, ip });
```

### Layer 9: File Upload Validation (src/lib/security/upload.ts)

| Check | Constraint |
|-------|-----------|
| MIME type | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml` |
| File size | Maximum 5 MB |
| Extension | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg` |
| Dimension limit | 4096 × 4096 px (configurable) |

### Layer 10: RBAC (Role-Based Access Control)

**Roles:** `admin`, `vendor`, `user`

**Permissions** (17 defined, `src/lib/permissions.ts`):

```
admin    → ALL permissions (17)
vendor   → view/create/edit/delete products, manage inventory, view analytics, manage profile, view support
user     → view products, view orders, manage profile, view support
```

**Enforcement points:**
- Middleware (`src/proxy.ts:120`): Admin routes require `role === "admin"`
- API routes: `checkPermission(PERMISSIONS.*)` / `checkRole(["admin"])` / `checkAnyPermission([...])`
- Server Components: `getSessionPermissions(session)`

### Environment Validation (src/lib/security/env.ts)

Runtime environment validation using Zod:
- `AUTH_SECRET`: Required, minimum 32 characters
- `MONGODB_URI`: Required, must be valid URL
- `UPSTASH_REDIS_*`: Optional in dev, validated if provided
- Production: throws on validation failure
- Development: logs warnings, continues with partial config

---

## 10. Performance Optimizations

### Server-Side

| Technique | Implementation |
|-----------|---------------|
| **React Server Components** | All pages are RSC by default; `"use client"` only at interactive boundaries |
| **MongoDB Connection Caching** | Global cached mongoose instance prevents reconnection on HMR |
| **MongoDB Connection Pool** | `maxPoolSize: 10` with 30s timeouts |
| **Redis Rate Limiting** | In-memory `Map` fallback avoids Redis dependency in dev |
| **Next.js Output** | `output: "standalone"` for optimized Docker builds |
| **Image Optimization** | `next/image` with remote patterns for external CDNs |
| **Console Removal** | `removeConsole` in production |
| **Source Maps** | `productionBrowserSourceMaps: false` in production |
| **Bundle Analysis** | `@next/bundle-analyzer` via `ANALYZE=true` |
| **React Strict Mode** | Enabled for development error detection |
| **Socket.io Message Limit** | `maxHttpBufferSize: 1e6` (1 MB) |

### Client-Side

| Technique | Implementation |
|-----------|---------------|
| **Dynamic Imports** | Heavy components loaded via dynamic imports |
| **Context Splitting** | Separate contexts for cart, wishlist, compare, search (avoids re-render cascades) |
| **localStorage** | Cart and wishlist persisted to localStorage for instant hydration |
| **Debounced Search** | `useDebounce` hook for search input |
| **Framer Motion** | Page transitions via `PageTransitionClient` |
| **PWA** | Service worker, manifest, offline page |
| **Lazy Widgets** | Recently viewed, compare floating button, save-for-later — loaded as secondary widgets |

### Database

| Technique | Implementation |
|-----------|---------------|
| **Lean Queries** | `.lean()` used on all read-only queries |
| **Selective Projection** | `.select("+password")` only for auth flows |
| **Compound Indexes** | Key queries indexed (status + date, product + email, etc.) |
| **Bucket Pattern** | Login history stored as separate documents (not embedded arrays) |

---

## 11. Real-Time Architecture

### Socket.io Server (Port 3001)

A standalone Express server running Socket.io for real-time features:

```
server/
└── index.ts                    # Express + Socket.io setup
src/core/server/
├── index.ts                    # Re-export
├── config/index.ts             # Port (3001), CORS origin, MongoDB URI
├── controllers/
│   └── notification-controller.ts  # Notification event handlers
├── middlewares/
│   └── auth.ts                 # Socket JWT authentication
├── routes/index.ts             # Socket event routing
├── services/                   # (reserved)
└── validators/                 # (reserved)
```

### Server Configuration

```typescript
// src/core/server/config/index.ts
{ port: 3001, corsOrigin: "http://localhost:3000" }
```

### Client Integration

```typescript
// src/lib/socket.ts
- Singleton socket instance
- Lazy initialization (created on first `getSocket()` call)
- Auto-reconnect: 5 attempts, 1s delay
- Events: notification, orderUpdate, message
- User events: join, leave, joinRoom, leaveRoom, sendNotification
```

### Event Map

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `join` | Client → Server | `userId: string` | User connects to personal room |
| `leave` | Client → Server | `userId: string` | User disconnects |
| `notification` | Server → Client | `{ id, title, message, type, link, createdAt }` | Real-time in-app notifications |
| `orderUpdate` | Server → Client | `{ orderId, status, message }` | Live order status updates |
| `message` | Server → Client | `{ from, content, timestamp }` | Chat messages |

---

## 12. Deployment Architecture

### Docker Multi-Stage Build (Dockerfile)

```
Stage 1: deps       node:20-alpine    npm ci
Stage 2: builder    node:20-alpine    npm run build
Stage 3: runner     node:20-alpine    node server.js (standalone)
```

- **Base:** `node:20-alpine` (with `libc6-compat`)
- **Output:** `next.config.ts` sets `output: "standalone"` — minimal production image
- **Healthcheck:** 30s interval, 10s timeout, 40s start period, 3 retries
- **User:** Runs as `nextjs` (non-root), UID/GID 1001
- **Port:** 3000

### Docker Compose (docker-compose.yml)

```yaml
Services:
  app:       Node.js 20, port 3000
  mongodb:   MongoDB 7, port 27017, persistent volume
  redis:     Redis 7 Alpine, port 6379, persistent volume

Network:     nexus-network (bridge)
Volumes:     mongodb_data, redis_data
```

### Production Architecture

```
                          ┌──────────────┐
                          │  Load Balancer│
                          │  (HTTPS term) │
                          └──────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ Next.js  │ │ Next.js  │ │ Next.js  │
              │ Instance │ │ Instance │ │ Instance │
              └────┬─────┘ └────┬─────┘ └────┬─────┘
                   │            │            │
                   └────────────┼────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                  ▼
       ┌──────────┐      ┌──────────┐      ┌──────────┐
       │ MongoDB  │      │  Redis   │      │ Socket   │
       │  Atlas   │      │ Upstash  │      │ Server   │
       └──────────┘      └──────────┘      └──────────┘
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development`, `production`, `test` |
| `AUTH_SECRET` | Yes | NextAuth encryption key (32+ chars) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `UPSTASH_REDIS_REST_URL` | No | Redis REST URL (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Redis REST token |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Client-side Stripe key |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |
| `SMTP_HOST` | No | SMTP server hostname |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `EMAIL_FROM_NAME` | No | From name for emails |
| `EMAIL_FROM_ADDRESS` | No | From address for emails |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public-facing base URL |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Socket.io server URL |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |

### Build & Deploy Commands

```bash
# Development
npm run dev                  # Next.js dev server (port 3000)
npm run dev:socket           # Socket.io server (port 3001)
npm run dev:all              # Both concurrently

# Production Build
npm run build                # TypeScript check + Next.js build
npm run start                # Production server (port 3000)

# Docker
npm run docker:build         # docker compose build
npm run docker:up            # docker compose up
npm run docker:prod          # docker compose -f docker-compose.prod.yml up -d

# Quality
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
npm run test                 # Vitest
npm run test:ci              # Vitest verbose

# Database
npm run seed                 # Run seed scripts
```

---

## 13. Key Design Decisions

### Why No Barrel Exports for `core/database/models/`?

Models are imported directly by path (`@/core/database/models/User`) because multiple patterns exist:
- Named exports: `export { User }` for most models
- Default exports: `export default Settings` for singleton models
- Mixed: `export { Notification, INotification }` for typed exports

A barrel file exists (`src/core/database/models/index.ts`) but named imports from individual files are preferred for tree-shaking and explicit dependency tracking.

### Why JWT Sessions Instead of Database Sessions?

NextAuth with JWT strategy (instead of database adapter) was chosen for:
- **Performance:** No database query on every request for session lookup
- **Statelessness:** Deployments can scale horizontally without session affinity
- **Cache:** Session data (role, status) is verified on every access via the `jwt()` callback

### Why Express + Socket.io Separately Instead of WebSocket on Next.js?

- **Process isolation:** Socket.io runs on a separate port (3001) from Next.js (3000)
- **Stability:** The standalone Express server is not affected by Next.js rebuilds during development
- **Scalability:** Socket.io can be scaled independently with Redis adapter for multi-instance deployments

### Why Both Context and Redux?

- **Redux Toolkit** (`@reduxjs/toolkit` + `react-redux`): Used for complex, cross-cutting state that benefits from devtools, middleware, and time-travel debugging
- **React Context:** Used for feature-specific state that is localized to a module (cart, wishlist, compare, search) and benefits from simpler, colocated providers

### Why Zod with Both `zod` v4 and `@standard-schema/...` Dependencies?

The project uses Zod for runtime validation in API routes and forms. The presence of `@standard-schema` packages suggests ongoing migration toward the Standard Schema specification for framework-agnostic validation.

### Why `next.config.ts` Security Headers + `proxy.ts`?

- **`next.config.ts`:** Provides baseline security headers that are set by Next.js's built-in response handler (catches static files and non-middleware-matched routes)
- **`proxy.ts` (middleware):** Sets comprehensive headers (CSP, COEP, COOP, CORP) that require dynamic computation, plus handles CSRF, rate limiting, auth, and NoSQL detection — all before the request reaches the route handler

---

## Appendix A: Package Ecosystem

```
Framework & Build:
  next@16.0.7, react@19.2.0, typescript@5.x
  tailwindcss@4, @tailwindcss/postcss@4, tw-animate-css@1.4

UI Components (shadcn/ui):
  48 primitives built on @radix-ui/react-*
  lucide-react@0.555 (icons)
  framer-motion@12.28 (animations)
  recharts@2.15 (charts)
  sonner@2.0 (toasts)
  vaul@1.1 (drawer)
  cmdk@1.1 (command palette)
  embla-carousel-react@8.6 (carousels)

Forms & Validation:
  react-hook-form@7.68, @hookform/resolvers@5.2
  zod@4.2, zod-validation-error

State:
  @reduxjs/toolkit@2.11, react-redux@9.2

Database:
  mongoose@9.0, mongodb@6.21
  @auth/mongodb-adapter@3.11

Auth:
  next-auth@5.0.0-beta.30 (Google, GitHub, Credentials)
  bcryptjs@3.0, jsonwebtoken@9.0
  otplib@12.0, speakeasy@2.0 (2FA)
  qrcode@1.5 (2FA QR codes)

Payments:
  stripe@20.2, @stripe/stripe-js@8.6, @stripe/react-stripe-js@5.4

Real-Time:
  socket.io@4.8, socket.io-client@4.8
  express@4.21, helmet@8.2

Cache/Rate-Limit:
  @upstash/redis@1.36, @upstash/ratelimit@2.0

Email:
  nodemailer@7.0, @react-email/components@1.0
  resend@6.6

PDF Generation:
  jspdf@4.0, jspdf-autotable@5.0

Image:
  sharp@0.34, slugify@1.6

Dev:
  eslint@9, eslint-config-next@16.0
  @next/bundle-analyzer@16.2
  tsx@4.21, vitest (testing)
  dotenv@17.2
```

---

## Appendix B: Path Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

All imports use `@/` as the root alias pointing to `src/`. Examples:

```typescript
import { auth } from "@/lib/auth";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { useCart } from "@/modules/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/features/products/types";  // legacy path
```

> **Note:** Some imports may still reference `@/features/` (legacy). The canonical path is `@/modules/`. Both resolve correctly via the `@/*` pattern.

---

## Appendix C: Provider Composition (src/app/providers.tsx)

```
SessionProvider (NextAuth)
└── SettingsProvider
    └── CartProvider
        └── WishlistProvider
            └── RecentlyViewedProvider
                └── CompareProvider
                    └── StockProvider
                        └── GuestCheckoutProvider
                            └── OrderTrackingProvider
                                └── SaveForLaterProvider
                                    └── BundleProvider
                                        └── SearchProvider
                                            └── PriceHistoryProvider
                                                └── NotificationWrapper
                                                    └── QuickViewProvider
                                                        └── Page Content
```

**Note:** The deeply nested provider tree is a recognized anti-pattern. Migration to Redux Toolkit or a lighter state solution is recommended for future iterations. Each provider was added incrementally as features were developed, leading to the current nested structure.
