# Nexus E-Commerce Platform — Environment Configuration Guide

> **Audience:** DevOps / Backend Engineers  
> **Last updated:** July 2026

---

## 1. Environment Files

Next.js loads variables from the following files in order of **precedence** (highest first):

| Priority | File | Environment | Committed? | Notes |
|----------|------|-------------|------------|-------|
| 1 | `.env.local` | All | **No** | Local overrides; ignored by git. |
| 2 | `.env.development` | `development` | Yes | Used when `NODE_ENV=development` or `next dev`. |
| 3 | `.env.production` | `production` | Yes | Used when `NODE_ENV=production` or `next build`/`next start`. |
| 4 | `.env.test` | `test` | Yes | Used when `NODE_ENV=test`. |
| 5 | `.env` | All | Yes | Defaults — lowest priority. |

**Rules:**
- `.env.local` always wins regardless of environment.
- Only `.env.local` (and `.env` with warning) are ignored by `.gitignore`.
- `NEXT_PUBLIC_*` variables are inlined at build time and bundled into the client JS.
- For production deployments, use `.env.production` _plus_ secrets injected via the platform (Vercel, Docker, etc.) rather than committing secrets to the repo.

> **Current files in use:** `.env.example` (template) and `.env.local` (active local config).

---

## 2. Variable Reference Table

| # | Variable | Description | Required | Default | Example | Sensitive | Used In |
|---|----------|-------------|----------|---------|---------|-----------|---------|
| **Application Core** | | | | | | | |
| 1 | `AUTH_SECRET` | NextAuth.js JWT/cookie encryption key (≥32 chars base64). | **Yes** | — | `RIZzprCOq8Ao1pMM1AeJM3Hwi0HrP33WNH5iYFp8gEU=` | **Yes** | `src/lib/auth/index.ts`, `src/core/server/middlewares/auth.ts`, `src/lib/security/env.ts` |
| 2 | `AUTH_URL` | Canonical site URL used by NextAuth callbacks & invite/password-reset links. | No | `http://localhost:3000` | `http://localhost:3000` | No | `src/app/api/admin/invite/route.ts`, `src/app/api/forgot-password/route.ts` |
| 3 | `NEXTAUTH_URL` | Alias for `AUTH_URL` (legacy/fallback). | No | `http://localhost:3000` | `http://localhost:3000` | No | `src/app/api/admin/invite/route.ts:54`, `src/app/api/forgot-password/route.ts:57` |
| 4 | `NEXT_PUBLIC_BASE_URL` | Public base URL for sitemap, robots.txt, SEO metadata, and CORS origin. | **Yes** | — | `http://localhost:3000` | No | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/core/server/config/index.ts` |
| 5 | `NEXT_PUBLIC_APP_URL` | URL used in email links (cart, order confirmations). | No | `http://localhost:3000` | `http://localhost:3000` | No | `src/lib/email-templates.ts`, `src/app/api/admin/orders/route.ts`, `src/app/api/orders/guest/route.ts` |
| 6 | `NODE_ENV` | Runtime environment. | No | `development` | `development` / `production` / `test` | No | Throughout the app — controls HTTPS, CSRF, logging, console removal |
| 7 | `NEXT_PUBLIC_SITE_NAME` | Brand name in email templates and page titles. | No | `Nexus` | `Nexus` | No | `src/lib/email.ts:89`, `src/lib/email-templates.ts:24,68` |
| 8 | `NEXT_PUBLIC_SITE_URL` | Public site URL alias. | No | — | `http://localhost:3000` | No | SEO / metadata |
| **Authentication (OAuth)** | | | | | | | |
| 9 | `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID. | 🟡* | — | `857674939829-xxxx.apps.googleusercontent.com` | No | `src/lib/auth/index.ts:87` |
| 10 | `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret. | 🟡* | — | `GOCSPX-xxxx` | **Yes** | `src/lib/auth/index.ts:88` |
| 11 | `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID. | 🟡* | — | `Ov23liDYjrMfRxNQXws7` | No | `src/lib/auth/index.ts:91` |
| 12 | `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret. | 🟡* | — | `9778536df036ec...` | **Yes** | `src/lib/auth/index.ts:92` |
| 13 | `AUTH_GOOGLE_ID` | Alternative Google OAuth ID (NextAuth v5 naming). | 🟡* | — | — | No | Validation only (`src/lib/security/env.ts`) |
| 14 | `AUTH_GOOGLE_SECRET` | Alternative Google OAuth secret (NextAuth v5 naming). | 🟡* | — | — | **Yes** | Validation only (`src/lib/security/env.ts`) |
| 15 | `AUTH_GITHUB_ID` | Alternative GitHub OAuth ID (NextAuth v5 naming). | 🟡* | — | — | No | Validation only (`src/lib/security/env.ts`) |
| 16 | `AUTH_GITHUB_SECRET` | Alternative GitHub OAuth secret (NextAuth v5 naming). | 🟡* | — | — | **Yes** | Validation only (`src/lib/security/env.ts`) |
| **Database** | | | | | | | |
| 17 | `MONGODB_URI` | MongoDB connection string (local or Atlas). | **Yes** | — | `mongodb://localhost:27017/full_stack_e_commerce_next_js` | **Yes** | `src/core/config/database.ts`, `src/core/server/config/index.ts`, `src/core/database/seed/seed.ts` |
| **JWT (API Tokens)** | | | | | | | |
| 18 | `ACCESS_TOKEN_SECRET` | Secret for signing access tokens (≥32 hex chars). | **Yes** | — | `273ef1e372b15c48...` | **Yes** | API authentication middleware |
| 19 | `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens (≥32 hex chars). | **Yes** | — | `52f501ce80251d0b...` | **Yes** | Token refresh endpoints |
| 20 | `ACCESS_TOKEN_EXPIRY` | Access token TTL. | No | `15m` | `15m` / `5m` / `1h` | No | Token generation logic |
| 21 | `REFRESH_TOKEN_EXPIRY` | Refresh token TTL. | No | `7d` | `7d` / `30d` | No | Token generation logic |
| **Redis / Upstash** | | | | | | | |
| 22 | `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint. | 🟡† | — | `https://your-region.upstash.io` | No | `src/lib/redis.ts`, `src/shared/lib/redis.ts`, `src/core/server/config/index.ts` |
| 23 | `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token. | 🟡† | — | `fb9c07f7...` | **Yes** | `src/lib/redis.ts`, `src/shared/lib/redis.ts` |
| **Cloudinary** | | | | | | | |
| 24 | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (public). | **Yes** | — | `dbe49mmnp` | No | Image upload components |
| 25 | `CLOUDINARY_API_KEY` | Cloudinary API key. | **Yes** | — | `157624479465722` | No | Server-side upload API |
| 26 | `CLOUDINARY_API_SECRET` | Cloudinary API secret. | **Yes** | — | `ucUzpBYeuy24...` | **Yes** | Server-side upload API |
| **Email / SMTP** | | | | | | | |
| 27 | `SMTP_HOST` | SMTP server hostname. | 🟡‡ | `smtp.gmail.com` | `smtp.gmail.com` | No | `src/lib/email.ts:15` |
| 28 | `SMTP_PORT` | SMTP server port. | 🟡‡ | `587` | `587` / `465` | No | `src/lib/email.ts:16` |
| 29 | `SMTP_SECURE` | Use SSL/TLS for SMTP. | No | `false` | `false` | No | `src/lib/email.ts` (inferred from port) |
| 30 | `SMTP_USER` | SMTP auth username (usually email). | 🟡‡ | — | `sorujmahmudb2h@gmail.com` | No | `src/lib/email.ts:19` |
| 31 | `SMTP_PASS` | SMTP auth password or app password. | 🟡‡ | — | — | **Yes** | `src/lib/email.ts:20` |
| 32 | `EMAIL_FROM_NAME` | Display name for outgoing emails. | 🟡‡ | `Nexus Support` | `Nexus Support` | No | `src/lib/email.ts:52` |
| 33 | `EMAIL_FROM_ADDRESS` | "From" address for outgoing emails. | 🟡‡ | — | `noreply@example.com` | No | `src/lib/email.ts:53` |
| 34 | `RESEND_API_KEY` | Resend.com API key (alternative to SMTP). | No | — | `re_xxxx` | **Yes** | Email service resolver |
| 35 | `EMAIL_SERVER` | Legacy SMTP server URL. | No | — | — | No | Fallback (legacy) |
| 36 | `EMAIL_FROM` | Legacy from address. | No | — | — | No | Fallback (legacy) |
| 37 | `EMAIL_PASSWORD` | Legacy SMTP password. | No | — | — | **Yes** | Fallback (legacy) |
| **Socket.io** | | | | | | | |
| 38 | `NEXT_PUBLIC_SOCKET_URL` | Client-facing Socket.io server URL. | 🟡§ | `http://localhost:3001` | `http://localhost:3001` | No | `src/lib/socket.ts`, `src/shared/lib/socket.ts`, `src/modules/notifications/hooks/use-notification-socket.ts` |
| 39 | `SOCKET_PORT` | Socket.io server listen port. | 🟡§ | `3001` | `3001` | No | `src/core/server/config/index.ts` |
| **Stripe** | | | | | | | |
| 40 | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_test_ or pk_live_). | **Yes** | — | `pk_test_51TDyBp...` | No | Checkout frontend |
| 41 | `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_ or sk_live_). | **Yes** | — | `sk_test_51TDyBp...` | **Yes** | `src/lib/stripe.ts`, `src/shared/lib/stripe.ts` |
| 42 | `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (whsec_). | 🟡¶ | — | `whsec_xxxx` | **Yes** | Stripe webhook handler route |
| **PayPal** | | | | | | | |
| 43 | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID (frontend). | No | — | — | No | Checkout frontend |
| 44 | `PAYPAL_CLIENT_ID` | PayPal client ID (server-side). | No | — | — | No | `src/app/api/payments/paypal/create-order/route.ts`, `src/app/api/payments/paypal/capture-order/route.ts` |
| 45 | `PAYPAL_CLIENT_SECRET` | PayPal client secret. | No | — | — | **Yes** | `src/app/api/payments/paypal/create-order/route.ts`, `src/app/api/payments/paypal/capture-order/route.ts` |
| **Analytics & SEO** | | | | | | | |
| 46 | `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID. | No | — | `G-XXXXXXXXXX` | No | Google Analytics script |
| 47 | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification string. | No | — | — | No | SEO `<meta>` tag |
| **Monitoring** | | | | | | | |
| 48 | `SENTRY_DSN` | Sentry DSN for error tracking. | No | — | `https://key@o123.ingest.sentry.io/project` | No | Sentry SDK config |
| 49 | `LOG_LEVEL` | Logging verbosity. | No | `info` (prod) / `debug` (dev) | `error` / `warn` / `info` / `debug` / `trace` | No | Logger configuration |
| **Build** | | | | | | | |
| 50 | `ANALYZE` | Enable Next.js Bundle Analyzer. | No | `false` | `true` / `false` | No | `next.config.ts:2` |

**Legend:**
- 🟡* Required if the corresponding OAuth provider is enabled.
- 🟡† Required if Redis/Upstash is used (caching, rate limiting, Socket.io adapter).
- 🟡‡ Required if SMTP email is used (transactional emails).
- 🟡§ Required if Socket.io is used (real-time notifications).
- 🟡¶ Required if Stripe webhooks are used (payment confirmations, refunds).

---

## 3. Configuration Sections

### 3.1 Application Core

These variables define the application identity and base URLs.

```
AUTH_SECRET         # NextAuth encryption key (required, ≥32 chars base64)
AUTH_URL            # Canonical site URL for auth callbacks
NEXT_PUBLIC_BASE_URL  # Public URL for sitemap/robots/CORS (required)
NEXT_PUBLIC_APP_URL   # URL used in email links (cart, orders, etc.)
NEXT_PUBLIC_SITE_NAME # Brand name shown in emails and page titles
```

- `AUTH_SECRET` is consumed by NextAuth to encrypt cookies and JWT tokens. Rotating this key invalidates all active sessions.
- `AUTH_URL` is used in invite and password-reset email links.
- `NEXT_PUBLIC_BASE_URL` is read by `src/app/sitemap.ts` and `src/app/robots.ts` and also used as the CORS origin in the Socket.io server.
- `NEXT_PUBLIC_APP_URL` appears in transactional email templates (abandoned cart, order confirmation).

**Validation rules:**
- `AUTH_SECRET` must be ≥32 characters (base64).
- `NEXT_PUBLIC_BASE_URL` should be a full URL without trailing slash.

### 3.2 Authentication (OAuth)

Two OAuth providers are supported — Google and GitHub. Credentials can be supplied under two naming conventions:

| Convention | Google | GitHub |
|-----------|--------|--------|
| Legacy | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` |
| NextAuth v5 | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` |

Both sets are optional but **at least one credential pair must be complete** if the provider is enabled in the auth configuration. The schema at `src/lib/security/env.ts` validates both naming conventions.

**Usage chain:**
```
.env.local  →  src/lib/auth/index.ts  →  NextAuth providers (GoogleProvider, GitHubProvider)
```

### 3.3 Database (MongoDB)

```
MONGODB_URI=mongodb://localhost:27017/full_stack_e_commerce_next_js
```

- **Local development:** Use the local connection string with a running `mongod` instance.
- **Atlas:** Use the SRV connection string from the Atlas dashboard.
- The URI is consumed in `src/core/config/database.ts` (connection via Mongoose with a cached singleton pattern).
- Connection pool: `maxPoolSize=10`, `serverSelectionTimeoutMS=30000`, `socketTimeoutMS=45000`.

**Validation:** Must be a valid URL (`z.string().url()` in env schema).

### 3.4 JWT (API Access & Refresh Tokens)

```
ACCESS_TOKEN_SECRET   # 32+ hex chars — sign access tokens
REFRESH_TOKEN_SECRET  # 32+ hex chars — sign refresh tokens
ACCESS_TOKEN_EXPIRY   # e.g. 15m, 5m, 1h
REFRESH_TOKEN_EXPIRY  # e.g. 7d, 30d
```

These are separate from NextAuth's JWT and are used for API-level authentication (e.g., mobile clients, programmatic API access).

**Generate secrets:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Expiry format:** Any string accepted by [`ms`](https://www.npmjs.com/package/ms) library (e.g., `900` (ms), `15m`, `1h`, `7d`).

### 3.5 Redis / Upstash

```
UPSTASH_REDIS_REST_URL=https://<region>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
```

Used for:
- **Caching:** Frequently accessed data (product catalogs, session data).
- **Rate limiting:** API endpoint rate enforcement.
- **Socket.io adapter:** Pub/sub for horizontal scaling of real-time notifications.

**Validation:** Both URL and token must be provided together (cross-field validation in `src/lib/security/env.ts:35-43`).

### 3.6 Cloudinary

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  # Public (frontend-safe)
CLOUDINARY_API_KEY                  # Server-side
CLOUDINARY_API_SECRET               # Secret — never expose client-side
```

Handles all media uploads: product images, user avatars, category banners, etc.

### 3.7 Email / SMTP

**Primary SMTP configuration:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false          # true for port 465
SMTP_USER=your@email.com
SMTP_PASS=<app-password>
EMAIL_FROM_NAME="Nexus Support"
EMAIL_FROM_ADDRESS=noreply@example.com
```

**Alternative: Resend API**
```
RESEND_API_KEY=re_xxxx
```

**Legacy fallback (will be deprecated):**
```
EMAIL_SERVER=<url>
EMAIL_FROM=<address>
EMAIL_PASSWORD=<password>
```

The email system (`src/lib/email.ts`) uses Nodemailer with:
- 3 retry attempts with exponential backoff.
- Self-signed certs allowed in development only.
- TLS `rejectUnauthorized: true` in production.

### 3.8 Socket.io

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001   # Client-facing URL
SOCKET_PORT=3001                                # Server listen port
```

The Socket.io server is configured in `src/core/server/config/index.ts`:
```typescript
export const SERVER_CONFIG = {
  port: parseInt(process.env.SOCKET_PORT || "3001", 10),
  corsOrigin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "",
};
```

The client connects from `src/lib/socket.ts` and `src/modules/notifications/hooks/use-notification-socket.ts`.

### 3.9 Stripe

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # pk_test_xxx or pk_live_xxx (public)
STRIPE_SECRET_KEY                    # sk_test_xxx or sk_live_xxx (secret)
STRIPE_WEBHOOK_SECRET                # whsec_xxx (secret)
```

- The Stripe client (`src/lib/stripe.ts`) instantiates the SDK only when a valid key is present.
- `STRIPE_WEBHOOK_SECRET` is used to verify webhook payload signatures.

### 3.10 PayPal

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID  # Frontend
PAYPAL_CLIENT_ID               # Server-side
PAYPAL_CLIENT_SECRET           # Secret
```

Used in `src/app/api/payments/paypal/create-order/route.ts` and `capture-order/route.ts` for PayPal order creation and capture flow.

### 3.11 Analytics & SEO

```
NEXT_PUBLIC_GA_ID                    # G-XXXXXXXXXX — Google Analytics 4
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION # Search Console verification
```

### 3.12 Monitoring

```
SENTRY_DSN  # Sentry Data Source Name
LOG_LEVEL   # error | warn | info | debug | trace
```

### 3.13 Build

```
ANALYZE=true   # Run next build with bundle analyzer
```

Set `ANALYZE=true` before `npm run build` to generate an interactive treemap of JS bundle sizes (`next.config.ts:2`).

---

## 4. Environment Setup Guides

### 4.1 Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create a project (or select existing).
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth 2.0 Client ID**.
5. Set **Application type** → **Web application**.
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (dev)
   - `https://yourdomain.com` (production)
7. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
8. Copy **Client ID** → `GOOGLE_CLIENT_ID`
9. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

### 4.2 GitHub OAuth Credentials

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **OAuth Apps > New OAuth App**.
3. Fill in:
   - **Application name:** `Nexus (Dev)`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**.
5. Copy **Client ID** → `GITHUB_CLIENT_ID`
6. Click **Generate a new client secret** → copy → `GITHUB_CLIENT_SECRET`

### 4.3 MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/log in.
2. Create a new cluster (free tier M0 is sufficient for development).
3. Go to **Database Access** → **Add New Database User**.
4. Create a user and save credentials.
5. Go to **Network Access** → **Add IP Address** → `0.0.0.0/0` (dev) or your deployment IPs.
6. Click **Connect > Drivers** → copy the connection string.
7. Replace `<password>`, `<dbname>` with your values → set as `MONGODB_URI`.
8. For local development, ensure MongoDB is running locally:
   ```powershell
   mongod --dbpath C:\data\db
   ```
   Connection: `mongodb://localhost:27017/full_stack_e_commerce_next_js`

### 4.4 Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com).
2. Click **Create Database**.
3. Select region closest to your server.
4. In the database details, copy:
   - `UPSTASH_REDIS_REST_URL` → the REST API endpoint
   - `UPSTASH_REDIS_REST_TOKEN` → the REST API token
5. Both must be set (the env schema validates them as a pair).

### 4.5 Cloudinary

1. Go to [Cloudinary Console](https://cloudinary.com/console).
2. Sign up or log in.
3. From the dashboard, copy:
   - **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`
4. Configure upload presets if needed for unsigned uploads.

### 4.6 Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com).
2. Toggle **Viewing test data** (top-left) to work with test keys.
3. Under **Developers > API keys**:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - **Secret key** → `STRIPE_SECRET_KEY` (starts with `sk_test_`)
4. For webhooks (development):
   - Install Stripe CLI: `winget install stripe`
   - Forward events: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Copy the signing secret (`whsec_xxx`) → `STRIPE_WEBHOOK_SECRET`
5. For production:
   - Stripe Dashboard > **Developers > Webhooks > Add endpoint**
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### 4.7 Generate JWT Secrets

Use Node.js to generate cryptographically secure hex strings:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output: `273ef1e372b15c48dd99a30511c4a4cf1f4c995da56a2c47c224062ef2b8edef`

Set the results as:
- `ACCESS_TOKEN_SECRET` (one value)
- `REFRESH_TOKEN_SECRET` (a **different** value — never reuse secrets)

---

## 5. Security Best Practices

### 5.1 Never Commit `.env` Files

The `.gitignore` already excludes `.env.local`. Verify with:
```powershell
git check-ignore .env.local   # Should return the filename
```

Before committing, always confirm no secrets are staged:
```powershell
git diff --cached | Select-String -Pattern "(SECRET|PASS|KEY)"  # Should be empty
```

### 5.2 Rotate Secrets Regularly

| Secret | Recommended Rotation | Notes |
|--------|---------------------|-------|
| `AUTH_SECRET` | Every 90 days | Invalidates all active sessions |
| `ACCESS_TOKEN_SECRET` | Every 90 days | Invalidates all access tokens |
| `REFRESH_TOKEN_SECRET` | Every 90 days | Invalidates all refresh tokens |
| `GOOGLE_CLIENT_SECRET` | Every 180 days | GitHub OAuth supports rotation |
| `GITHUB_CLIENT_SECRET` | Every 180 days | Regenerate in developer settings |
| Stripe / Cloudinary keys | On suspected compromise | Immediate rotation required |
| SMTP passwords | Every 90 days | Use app-specific passwords for Gmail |

### 5.3 Environment-Specific Keys

- **Development:** Use test/fake keys (Stripe test mode, local MongoDB, Upstash dev DB).
- **Staging:** Use a separate set of keys from production (separate Stripe account, separate Atlas cluster).
- **Production:** Use live keys, restrict network access, enable audit logging.

**Never** use production keys in `.env.local` or `.env.development`.

### 5.4 Restrict API Keys

| Service | Restriction |
|---------|-------------|
| MongoDB Atlas | Limit **Network Access** to your deployment IPs or VPC CIDR. |
| Upstash Redis | Enable **IP whitelist** in the Upstash console. |
| Cloudinary | Configure **allowed CORS origins** to your domain only. |
| Google OAuth | Restrict **Authorized JavaScript origins** to known domains. |
| Stripe | Webhook endpoints should be restricted to Stripe's IP range. |
| GitHub OAuth | No IP restriction — protect the client secret. |

### 5.5 Key Rotation Procedure

```powershell
# 1. Generate new secrets
$newAuthSecret = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
$newAccessSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
$newRefreshSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Update .env.local (or platform secrets manager)
# 3. Deploy the updated configuration
# 4. Verify the application starts and sessions are recreated
# 5. Revoke old keys at the provider (OAuth, Stripe, etc.)
```

---

## 6. Environment Validation

### 6.1 Schema Validation (`src/lib/security/env.ts`)

The runtime schema at `src/lib/security/env.ts` validates variables using **Zod**:

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  AUTH_SECRET: z.string().min(32),
  MONGODB_URI: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // ... cross-field validation
}).refine(
  (data) => !(data.UPSTASH_REDIS_REST_URL && !data.UPSTASH_REDIS_REST_TOKEN),
  { message: "UPSTASH_REDIS_REST_TOKEN required when UPSTASH_REDIS_REST_URL is set" }
);
```

**Behavior:**

| Environment | Validation Failure |
|-------------|-------------------|
| `development` | Logs warnings, continues with partial config |
| `production` | Throws error — application will not start |

Call `validateEnv()` early in the application lifecycle (e.g., at the top of `layout.tsx` or in the root config) to fail fast in production.

### 6.2 Minimal Validation (`src/core/config/env.ts`)

A simpler validation in `src/core/config/env.ts` checks only three required variables:

```typescript
const requiredEnvVars = ["MONGODB_URI", "AUTH_SECRET", "NEXT_PUBLIC_BASE_URL"];
```

This is used during server startup (Socket.io) and database connection.

### 6.3 Quick Validation Command

```powershell
# Validate your current .env.local against the schema
node -e "
  const { validateEnv } = require('./src/lib/security/env');
  try { validateEnv(); console.log('✅ All env vars valid'); }
  catch (e) { console.error('❌', e.message); }
"
```
