# Nexus E-Commerce Platform - Deployment Guide

A production-grade deployment reference for the Nexus Next.js 16 e-commerce platform with MongoDB, Redis, Socket.io, Stripe, and Cloudinary.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Local Development](#3-local-development)
4. [Docker Deployment](#4-docker-deployment)
5. [Production Build](#5-production-build)
6. [Platform Deployment Guides](#6-platform-deployment-guides)
7. [Database Setup](#7-database-setup)
8. [Redis Setup](#8-redis-setup)
9. [Email Setup](#9-email-setup)
10. [Stripe Setup](#10-stripe-setup)
11. [Cloudinary Setup](#11-cloudinary-setup)
12. [CI/CD Pipeline](#12-cicd-pipeline)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Scaling Considerations](#14-scaling-considerations)
15. [Rollback Strategy](#15-rollback-strategy)
16. [Post-Deployment Checklist](#16-post-deployment-checklist)

---

## 1. Prerequisites

| Dependency | Version | Purpose |
|---|---|---|
| Node.js | >= 20.x | Runtime |
| Docker & Docker Compose | Latest | Containerization |
| MongoDB Atlas (or self-hosted) | 7.x | Primary database |
| Upstash Redis (or self-hosted) | 7.x | Caching, rate limiting, Socket.io adapter |
| Stripe account | — | Payment processing |
| Cloudinary account | — | Image/media storage |
| SMTP provider (SendGrid, Mailgun, Gmail) | — | Transactional emails |
| Resend account (optional) | — | Alternative email delivery |

### Required Accounts

- **MongoDB Atlas** — `https://cloud.mongodb.com`
- **Upstash Redis** — `https://console.upstash.com`
- **Stripe** — `https://dashboard.stripe.com`
- **Cloudinary** — `https://cloudinary.com`
- **Resend** (optional) — `https://resend.com`
- **Sentry** (optional) — `https://sentry.io`
- **Google Cloud Console** (optional, for OAuth) — `https://console.cloud.google.com`
- **GitHub OAuth App** (optional) — `https://github.com/settings/developers`

---

## 2. Environment Setup

### Environment Files

Copy the example file and configure per environment:

```bash
cp .env.example .env.local        # Development
cp .env.example .env.staging      # Staging
cp .env.example .env.production   # Production
```

### Key Variables by Category

#### Application (Required)

```bash
AUTH_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### Database (Required)

```bash
# Development (local)
MONGODB_URI=mongodb://localhost:27017/full_stack_e_commerce_next_js

# Production (Atlas)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
```

#### JWT (Required)

```bash
ACCESS_TOKEN_SECRET=<node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
REFRESH_TOKEN_SECRET=<node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

#### Redis / Upstash

```bash
UPSTASH_REDIS_REST_URL=https://<region>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
```

#### Socket.io

```bash
NEXT_PUBLIC_SOCKET_URL=https://socket.yourdomain.com
SOCKET_PORT=3001
```

#### Stripe

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Cloudinary

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123...
```

#### Email (SMTP)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-api-key>
EMAIL_FROM_NAME="Nexus Support"
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# Alternative: Resend
RESEND_API_KEY=re_...
```

#### OAuth (Optional)

```bash
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<secret>
GITHUB_CLIENT_ID=<client-id>
GITHUB_CLIENT_SECRET=<secret>
```

#### Monitoring (Optional)

```bash
SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
LOG_LEVEL=info
```

### Environment-Specific Configuration Guide

| Variable | Development | Staging | Production |
|---|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | `https://staging.yourdomain.com` | `https://yourdomain.com` |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:3001` | `https://socket-staging.yourdomain.com` | `https://socket.yourdomain.com` |
| `MONGODB_URI` | Local Docker | Staging Atlas cluster | Production Atlas cluster |
| `UPSTASH_REDIS_REST_URL` | Local Docker or Upstash dev | Staging Upstash | Production Upstash |
| `STRIPE_WEBHOOK_SECRET` | Test (`whsec_test_...`) | Test (`whsec_test_...`) | Live (`whsec_live_...`) |
| `NODE_ENV` | `development` | `production` | `production` |
| `LOG_LEVEL` | `debug` | `info` | `warn` |

---

## 3. Local Development

### Quick Start

```bash
# Install dependencies
npm install

# Run database and cache locally
docker compose up -d mongodb redis

# Start development server (Next.js on :3000)
npm run dev

# Start Socket.io server (Express on :3001)
npm run dev:socket

# Or run both concurrently
npm run dev:all
```

### Docker Compose for Local Services

The `docker-compose.yml` starts MongoDB 7 and Redis 7 for local development:

```bash
docker compose up -d mongodb redis
docker compose ps

# View logs
docker compose logs -f mongodb redis

# Reset data
docker compose down -v
```

### Seed Data

```bash
npm run seed
```

### Verify Health

```bash
curl http://localhost:3000/api/health
# → {"status":"ok","timestamp":"...","uptime":...}
```

---

## 4. Docker Deployment

### Multi-Stage Dockerfile

The project uses a three-stage Dockerfile (`Dockerfile`) for optimized production images:

```dockerfile
# Stage 1: deps - Install production dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: builder - Build the Next.js standalone output
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: runner - Minimal production image
FROM node:20-alpine AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node scripts/healthcheck.mjs
CMD ["node", "server.js"]
```

Key notes:
- Uses `libc6-compat` for native module compatibility (bcrypt, sharp)
- Standalone output reduces image size (no `node_modules` bloat)
- Static assets are copied separately for CDN serving
- Runs as non-root `nextjs` user (security best practice)
- Healthcheck hits `GET /api/health` every 30s

### Development Docker Compose

**File: `docker-compose.yml`**

Builds and runs the full stack locally:

```bash
docker compose up --build
```

Services:
- `app` — Next.js production build on port 3000
- `mongodb` — MongoDB 7 on port 27017
- `redis` — Redis 7 on port 6379

### Production Docker Compose

**File: `docker-compose.prod.yml`**

Designed for production VM/VMSS deployments. Reads all secrets from the host environment:

```bash
export $(cat .env.production | xargs)
docker compose -f docker-compose.prod.yml up -d --build
```

Production-specific features:
- `restart: always` for self-healing
- JSON-file logging with rotation (10 MB max, 3 files)
- Healthcheck with 40s startup grace period
- No exposed database ports (internal network only)

### Building and Tagging Images

```bash
# Build with version tag
docker build -t nexus-ecommerce:1.0.0 .
docker tag nexus-ecommerce:1.0.0 registry.com/nexus-ecommerce:1.0.0
docker push registry.com/nexus-ecommerce:1.0.0

# Latest tag
docker tag nexus-ecommerce:1.0.0 registry.com/nexus-ecommerce:latest
docker push registry.com/nexus-ecommerce:latest
```

---

## 5. Production Build

### Standard Build

```bash
npm run build
```

This generates:
- `.next/standalone/` — Self-contained server with all JS dependencies bundled
- `.next/static/` — Static assets (JS chunks, CSS, images)
- `public/` — Static files (robots.txt, favicon, etc.)

### Standalone Output

The `next.config.ts` sets `output: "standalone"`, which creates a minimal production server:

```
.next/standalone/
├── server.js          # Next.js server entry point
├── package.json       # Only production dependencies
├── node_modules/      # Pruned to production only
└── .next/
    ├── build-manifest.json
    ├── server/        # Server-side chunks
    └── static/        # Client-side chunks
```

To run standalone:

```bash
cd .next/standalone
cp -r ../static .next/static
cp -r ../../public public
NODE_ENV=production node server.js
```

### Build Configuration Flags

| Flag | File | Effect |
|---|---|---|
| `output: "standalone"` | `next.config.ts` | Minimal deployment artifact |
| `productionBrowserSourceMaps: false` | `next.config.ts` | Disables client source maps in prod |
| `compiler.removeConsole` | `next.config.ts` | Strips `console.*` in production |
| `poweredByHeader: false` | `next.config.ts` | Removes `X-Powered-By` header |

### Static Page Generation

Pages using `generateStaticParams` or `force-static` are pre-rendered at build time. If using ISR, ensure `revalidate` is set on the page or use `generateStaticParams` for high-traffic product/category pages.

---

## 6. Platform Deployment Guides

### 6.1 Vercel (Recommended)

Vercel is the native deployment platform for Next.js and offers zero-configuration builds.

#### Steps

1. Push your repository to GitHub/GitLab/Bitbucket
2. Import the project on [vercel.com](https://vercel.com/new)
3. Configure build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm ci`
4. Add all environment variables from `.env.production`
5. Configure domains in Vercel dashboard

#### Environment Variables on Vercel

| Category | Notes |
|---|---|
| `AUTH_SECRET` | Mark as "Encrypted" |
| `MONGODB_URI` | Use Atlas connection string |
| `UPSTASH_REDIS_*` | From Upstash console |
| `STRIPE_*` | Use live keys |
| `NEXT_PUBLIC_*` | Public, visible to client |

#### Serverless Function Limitations

- Socket.io server **cannot** run on Vercel serverless functions
- Deploy the Socket.io server separately (see below)

#### Separating Socket.io on Vercel

The Express + Socket.io server (`src/core/server/index.ts`) must run on a separate infrastructure:

**Option A:** Deploy the Socket.io server to a small VM or container on Railway, Fly.io, or AWS ECS and set `NEXT_PUBLIC_SOCKET_URL` to point there.

**Option B:** Use a WebSocket gateway service like [Pusher](https://pusher.com) or [Ably](https://ably.com) as an alternative to Socket.io.

#### Vercel Production Checklist

- [ ] Connect custom domain with SSL
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure `vercel.json` for rewrites/headers if needed
- [ ] Set up Preview/Production branches

### 6.2 AWS ECS (Elastic Container Service)

For full control with Docker images on AWS.

#### Architecture

```
Application Load Balancer (port 443)
    └── Target Group (port 3000)
        ├── ECS Task (az-1)
        ├── ECS Task (az-2)
        └── ECS Task (az-3)
```

#### Step 1: Push Image to ECR

```bash
aws ecr create-repository --repository-name nexus-ecommerce
docker tag nexus-ecommerce:latest <account>.dkr.ecr.<region>.amazonaws.com/nexus-ecommerce:latest
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker push <account>.dkr.ecr.<region>.amazonaws.com/nexus-ecommerce:latest
```

#### Step 2: ECS Task Definition

```json
{
  "family": "nexus-ecommerce",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::<account>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "<account>.dkr.ecr.<region>.amazonaws.com/nexus-ecommerce:latest",
      "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        { "name": "MONGODB_URI", "valueFrom": "arn:aws:ssm:<region>:<account>:parameter/nexus/MONGODB_URI" },
        { "name": "AUTH_SECRET", "valueFrom": "arn:aws:ssm:<region>:<account>:parameter/nexus/AUTH_SECRET" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nexus-ecommerce",
          "awslogs-region": "<region>",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "node scripts/healthcheck.mjs || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3,
        "startPeriod": 40
      }
    }
  ]
}
```

#### Step 3: ALB Setup

```bash
# Create target group (HTTP :3000, health check path /api/health)
aws elbv2 create-target-group \
  --name nexus-tg \
  --protocol HTTP --port 3000 \
  --vpc-id <vpc-id> \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --target-type ip

# Create ALB
aws elbv2 create-load-balancer \
  --name nexus-alb \
  --subnets <subnet-1> <subnet-2> \
  --security-groups <sg-id>

# Create HTTPS listener (port 443 with ACM cert)
aws elbv2 create-listener \
  --load-balancer-arn <alb-arn> \
  --protocol HTTPS --port 443 \
  --certificates CertificateArn=<acm-arn> \
  --default-actions Type=forward,TargetGroupArn=<tg-arn>
```

#### Step 4: Auto-Scaling

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/<cluster>/nexus-ecommerce \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --policy-name cpu-target \
  --service-namespace ecs \
  --resource-id service/<cluster>/nexus-ecommerce \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration \
    TargetValue=70.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization}
```

### 6.3 Docker Swarm / Kubernetes

#### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml nexus

# View services
docker service ls

# Scale
docker service scale nexus_app=3

# Rolling update
docker service update --image nexus-ecommerce:2.0.0 nexus_app
```

#### Kubernetes (Minikube / K8s)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexus-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nexus-app
  template:
    metadata:
      labels:
        app: nexus-app
    spec:
      containers:
        - name: app
          image: nexus-ecommerce:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
          envFrom:
            - secretRef:
                name: nexus-secrets
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 40
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: nexus-service
spec:
  selector:
    app: nexus-app
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

Apply and manage:

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get svc
kubectl rollout restart deployment/nexus-app
```

### 6.4 DigitalOcean App Platform

Deploy using Docker from source or container registry.

#### Option A: Source-Based Deployment

1. Create App → GitHub → Select repo
2. Set **Resource Type** to Dockerfile
3. Add environment variables from the **Settings** tab
4. Set HTTP port to **3000**
5. Add health check path to `/api/health`
6. Enable auto-deploy from `main` branch

#### Option B: Container Registry

1. Push image to DO Container Registry:

   ```bash
   doctl registry login
   docker tag nexus-ecommerce registry.digitalocean.com/nexus/app:latest
   docker push registry.digitalocean.com/nexus/app:latest
   ```

2. Create App → Docker Hub → enter image URL
3. Configure as above

#### DigitalOcean Specifics

- **App Spec** supports `internal_ports` for inter-service communication
- **Redis** integration: create a managed DB, get connection string
- **MongoDB** integration: DigitalOcean managed MongoDB available in certain regions, or use Atlas
- **Autoscaling**: Set min/max instances in App Platform settings
- **Staging**: Use DigitalOcean's branch-based deployments for preview apps

---

## 7. Database Setup

### MongoDB Atlas Cluster

#### Step 1: Create Cluster

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Build a Database** → Choose **Shared** (M0 free tier for dev) or **Dedicated** for production
3. Select cloud provider and region (prefer same region as your app deployment)
4. Configure cluster tier (M10+ recommended for production)

#### Step 2: Create Database User

```bash
Username: nexus_admin
Password: <secure-password>
Database User Privileges: Atlas admin (or readWrite on specific database)
```

#### Step 3: IP Whitelist

- **Production:** Whitelist the VPC CIDR or specific static IPs of your deployment
- **Development:** Add your current IP or use `0.0.0.0/0` (not recommended for production)
- **Vercel:** Use [Vercel IP ranges](https://vercel.com/docs/security/vercel-ip-ranges) or Atlas Network Peering

#### Step 4: Connection String

```
mongodb+srv://nexus_admin:<password>@cluster0.xxxxx.mongodb.net/nexus?retryWrites=true&w=majority
```

Replace `<password>` and `nexus` with your chosen values.

#### Step 5: Create Indexes

Run the seed script or create indexes manually for performance-critical queries:

```javascript
// Products
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1, status: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ "ratings.average": -1 });
db.products.createIndex({ tags: 1 });
db.products.createIndex({ createdAt: -1 });

// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Orders
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ "paymentInfo.stripePaymentId": 1 });

// Sellers
db.categories.createIndex({ slug: 1 }, { unique: true });

// Sessions / Tokens
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Connection Pooling

The Mongoose connection is configured automatically. For production tuning:

```typescript
// src/lib/mongodb/connection.ts (example)
const opts = {
  maxPoolSize: 50,          // Adjust based on workload
  minPoolSize: 10,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  w: "majority",
};
```

---

## 8. Redis Setup

### Upstash Redis

Upstash is the recommended Redis provider (serverless, REST-based, no persistent connection needed).

#### Step 1: Create Database

1. Sign in to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database
3. Select region closest to your application (e.g., `us-east-1`)
4. Choose **Global** for multi-region (higher latency, better availability)
5. Enable TLS encryption
6. Set eviction policy to `allkeys-lru` for caching use cases

#### Step 2: Get Credentials

```bash
UPSTASH_REDIS_REST_URL=https://us1-adequate-bear-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXdCAAIjcDE... (Base64-encoded token)
```

#### Step 3: Configure in Application

The app uses `@upstash/redis` for all caching and `@upstash/ratelimit` for rate limiting:

```typescript
// src/lib/redis.ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

#### Rate Limit Tuning

Rate limits are defined in `src/lib/routes.ts`. Adjust per environment:

| Route | Default Limit | Window | Purpose |
|---|---|---|---|
| `/api/auth/*` | 10 | 60s | Brute force protection |
| `/api/register` | 5 | 300s | Registration spam |
| `/api/contact` | 3 | 3600s | Contact form abuse |
| `/api/checkout/*` | 30 | 60s | Checkout throttling |
| `/api/search` | 60 | 60s | Search API |
| General API | 100 | 60s | Catch-all |

Increase limits for production under heavy legitimate traffic—but keep auth endpoints strict.

#### Local Development with Redis

When running locally without Upstash, the `docker-compose.yml` provides Redis 7 on port 6379. The application will connect to it if `UPSTASH_REDIS_REST_URL` is set to `http://localhost:6379`. Note: Upstash SDK expects HTTP REST API format. For local development, consider using a mock or switching to `ioredis`-based fallback.

---

## 9. Email Setup

### SMTP Configuration

Transactional emails include: welcome, email verification, password reset, order confirmation, shipping updates, and support ticket replies.

#### SendGrid (Recommended)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
EMAIL_FROM_NAME="Nexus Support"
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

1. Create a SendGrid account
2. Generate an API key with "Mail Send" permission
3. Verify sender identity (domain or single sender)
4. Set up Domain Authentication (SPF, DKIM) for deliverability

#### Gmail (Development Only)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASS=<app-password>
```

Generate an [App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled).

### Resend API

Alternative to SMTP with better deliverability:

```bash
RESEND_API_KEY=re_<your-api-key>
EMAIL_FROM_NAME="Nexus"
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (DKIM/SPF)
3. Create API key
4. Set `RESEND_API_KEY` in environment

### Email Template Customization

Email templates are in `src/features/emails/` or built with React Email (`@react-email/components`):

```bash
src/
└── features/
    └── emails/
        ├── welcome.tsx
        ├── order-confirmation.tsx
        ├── password-reset.tsx
        └── shipping-update.tsx
```

Preview emails during development:

```bash
npm run dev:email   # or npx react-email dev
```

### Production Email Checklist

- [ ] Verify sender domain (SPF, DKIM, DMARC)
- [ ] Set up email tracking (opens, clicks) if needed
- [ ] Configure a custom return path (bounce handling)
- [ ] Monitor delivery rates in SendGrid/Resend dashboard
- [ ] Add unsubscribe links per CAN-SPAM regulations

---

## 10. Stripe Setup

### Step 1: Create Stripe Account

Sign up at [stripe.com](https://stripe.com) and activate your account.

### Step 2: Get API Keys

```bash
# From Stripe Dashboard > Developers > API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

Test keys start with `pk_test_` / `sk_test_`.

### Step 3: Configure Webhooks

Stripe webhooks notify your app about payment events (success, failure, refunds, disputes).

#### Endpoints to Register

| Event | Webhook URL | Purpose |
|---|---|---|
| `checkout.session.completed` | `POST /api/payments/webhook` | Order fulfillment trigger |
| `payment_intent.succeeded` | `POST /api/payments/webhook` | Payment confirmation |
| `payment_intent.payment_failed` | `POST /api/payments/webhook` | Failed payment handling |
| `charge.refunded` | `POST /api/payments/webhook` | Refund processing |
| `charge.dispute.created` | `POST /api/payments/webhook` | Dispute notification |

#### Setup in Stripe Dashboard

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Enter endpoint URL: `https://yourdomain.com/api/payments/webhook`
3. Select events listed above
4. Copy signing secret:

   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### Local Webhook Testing

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to http://localhost:3000/api/payments/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

### Step 4: Test Mode

Always test in Stripe's test environment before going live:

```bash
# Test card numbers
4242424242424242    # Success
4000000000003220    # 3D Secure required
4000000000000002    # Decline
```

Run through the full checkout flow in test mode:
- Add items to cart
- Complete checkout as guest and registered user
- Test refund flow
- Verify webhook handling in your application logs

### Step 5: Going Live

1. Flip the toggle in Stripe Dashboard from "Test" to "Live"
2. Replace all `pk_test_` / `sk_test_` keys with live keys
3. Update webhook endpoint URL to production (if different)
4. Replace `whsec_test_...` with live webhook secret
5. Test a real transaction (refund it immediately)
6. Set up email receipts in Stripe Dashboard → Settings → Emails

### Secret Key Rotation

Rotate Stripe secret keys periodically:

1. Stripe Dashboard → Developers → API Keys
2. Click "Roll" next to the key to generate a new one
3. Update the environment variable
4. Verify the app still processes payments
5. Delete the old key after 24 hours

---

## 11. Cloudinary Setup

### Step 1: Create Account

Sign up at [cloudinary.com](https://cloudinary.com) and note your cloud name.

### Step 2: Get Credentials

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name  # Public
CLOUDINARY_API_KEY=123456789                        # Semi-public
CLOUDINARY_API_SECRET=abc123def456                  # Private
```

### Step 3: Configure Upload Presets

Upload presets define transformation and validation rules for uploads.

1. Cloudinary Dashboard → Settings → Upload
2. Create a new upload preset:
   - **Preset name:** `nexus_product_images`
   - **Signing mode:** `signed` (for server-side uploads)
   - **Type:** `upload`
   - **Folder:** `products`
   - **Auto-tagging:** Enable if needed
   - **Responsive breakpoints:** Enable
3. Apply image transformation defaults (e.g., `w_1200,h_1200,c_limit`)

### Step 4: Transformation URLs

Use Cloudinary's URL-based transformations for responsive images:

```typescript
// Helper in src/lib/cloudinary.ts
export function getOptimizedImageUrl(publicId: string, width = 800) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},f_auto,q_auto/${publicId}`;
}
```

Common transformations:

| URL Suffix | Effect |
|---|---|
| `w_400,h_400,c_fill` | Product thumbnails (square crop) |
| `w_800,f_auto,q_auto` | Product detail page (auto format + quality) |
| `w_1200,h_600,c_fill` | Hero/banner images |
| `e_blur:1000` | Blur placeholder for lazy loading |

### Step 5: Backups

Enable automatic backup in Cloudinary:

1. **Account** → **Settings** → **Backup**
2. Enable "Automatic backup" with your cloud storage provider (AWS S3, Google Cloud Storage)
3. Set up daily or weekly backup frequency

Alternatively, periodically sync images to a secondary bucket:

```bash
# Using cloudinary CLI or API to sync to S3
curl -X POST https://api.cloudinary.com/v1_1/<cloud>/backup \
  -H "Authorization: Basic $(echo -n '$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET' | base64)" \
  -d '{"target":"s3://backup-bucket/cloudinary/"}'
```

---

## 12. CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "20"
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - run: npm run test:ci
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          AUTH_SECRET: test-secret
          ACCESS_TOKEN_SECRET: test-access-secret
          REFRESH_TOKEN_SECRET: test-refresh-secret

  build:
    name: Build & Docker
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_URL: ${{ vars.NEXT_PUBLIC_BASE_URL }}
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ vars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ vars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}

      - name: Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,format=short
            type=semver,pattern={{version}}
            type=ref,event=branch
            latest

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          echo "Deploying ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}"
        # Replace with actual deploy step:
        # - SSH into VM and pull + restart
        # - Or deploy to ECS with ecs deploy
        # - Or invoke Vercel deploy hook
```

### Running Jobs Locally

```bash
# Simulate CI locally
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

### Deploy Strategies by Platform

| Platform | Deploy Command / Action |
|---|---|
| **Vercel** | `vercel --prod` or Vercel Deploy Hook |
| **AWS ECS** | `aws ecs update-service --force-new-deployment` |
| **Docker Swarm** | `docker service update --image <image> nexus_app` |
| **Kubernetes** | `kubectl set image deployment/nexus-app app=<image>` |
| **DO App Platform** | Auto-deploy from registry push or `doctl apps update` |

### Environment-Specific Pipelines

```yaml
# .github/workflows/deploy-staging.yml for develop branch
# Uses staging env vars, deploys to staging environment
```

---

## 13. Monitoring & Observability

### Health Check Endpoint

The application exposes a health check at `GET /api/health`:

```json
{
  "status": "ok",
  "timestamp": "2026-07-09T12:00:00.000Z",
  "uptime": 12345.67
}
```

The Docker health check uses `scripts/healthcheck.mjs` which queries this endpoint and exits with status 0 (healthy) or 1 (unhealthy).

### Structured Logging

The app uses structured logging output. Log levels:

| Level | Usage | Config |
|---|---|---|
| `error` | Unhandled exceptions, payment failures | `LOG_LEVEL=error` |
| `warn` | Rate limit exceeded, suspicious activity | `LOG_LEVEL=warn` |
| `info` | Order placed, user registered (default production) | `LOG_LEVEL=info` |
| `debug` | API request details, DB queries (default development) | `LOG_LEVEL=debug` |
| `trace` | Full request/response payloads | `LOG_LEVEL=trace` |

### Uptime Monitoring

Set up external monitoring to ping the health endpoint:

| Service | Configuration |
|---|---|
| **Better Uptime** | Monitor `https://yourdomain.com/api/health`, 1-min intervals |
| **Pingdom** | HTTP check, expected status 200 |
| **Checkly** | Browser + API checks from multiple regions |
| **AWS Route 53** | Health checks on ALB target group |

Configure alert channels: email, Slack, PagerDuty.

### Error Tracking (Sentry)

Sentry is available as an optional integration:

1. Sign up at [sentry.io](https://sentry.io)
2. Create a Next.js project
3. Set `SENTRY_DSN` in environment variables
4. (Optional) Install `@sentry/nextjs` for advanced features:

   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard -i nextjs
   ```

### Application Metrics to Monitor

| Metric | Source | Alert Threshold |
|---|---|---|
| CPU utilization | Docker/ECS | > 80% for 5 min |
| Memory usage | Docker/ECS | > 85% |
| 5xx error rate | ALB/Reverse proxy | > 1% of requests |
| 4xx error rate | ALB/Reverse proxy | > 5% of requests |
| API response time (p95) | Application | > 2000ms |
| Payment failure rate | Stripe logs | > 3% |
| MongoDB connections | Atlas metrics | > 80% of pool |
| Redis cache hit rate | Upstash dashboard | < 60% |

### Log Aggregation

| Platform | Setup |
|---|---|
| **AWS CloudWatch** | `awslogs` log driver in ECS |
| **Datadog** | `dd-trace` APM integration |
| **Logtail / Better Stack** | Structured JSON logs via HTTP |
| **Grafana Loki** | Promtail agent to collect Docker logs |

---

## 14. Scaling Considerations

### 1. CDN for Static Assets

- **Next.js static assets** (`.next/static/`) are served by Vercel's edge network automatically
- **User uploads** go through Cloudinary (already CDN-backed)
- For self-hosted deployments, configure a CDN like CloudFront in front of the ALB:

  ```
  CloudFront → ALB → ECS Tasks
  ```

  Cache static paths with long TTLs:
  - `/_next/static/*` → 1 year
  - `/images/*` → 1 month

### 2. Redis Caching Strategy

| Cache Key Pattern | TTL | Purpose |
|---|---|---|
| `product:{id}` | 300s (5 min) | Product details |
| `category:{slug}` | 600s (10 min) | Category pages |
| `search:{query}:{page}` | 120s (2 min) | Search results |
| `user:{id}:cart` | 3600s (1 hour) | Cart data |
| `settings:global` | 3600s (1 hour) | Site settings |

Cache invalidation events:
- Product update → delete `product:{id}` cache key
- Category change → delete matching `category:*` keys
- Settings saved → delete `settings:global`

### 3. MongoDB Indexing

Critical indexes already listed in [Section 7](#step-5-create-indexes). Monitor slow queries:

```javascript
// Enable profiling in production (use sparingly)
db.setProfilingLevel(1, { slowms: 200 });

// Review slow queries
db.system.profile.find().sort({ millis: -1 }).limit(10).pretty();
```

### 4. Connection Pooling

**MongoDB:**
- Default pool: 50 connections per instance
- Tune `maxPoolSize` based on concurrent request volume:
  - Low traffic (< 100 RPS): 20-30
  - Medium traffic (100-500 RPS): 50-100
  - High traffic (> 500 RPS): 100-200

**HTTP Server:**
- Node.js can handle 1000s of concurrent connections
- Socket.io connections are lightweight (< 100 KB each)

### 5. Horizontal Scaling

- Application: Stateless Docker containers behind a load balancer (2-10 instances)
- MongoDB: Atlas supports auto-scaling storage and cluster tier
- Redis: Upstash Global handles multi-region replication
- Socket.io: Use Redis adapter for sticky sessions across instances

### 6. Build Performance

```bash
# Analyze bundle sizes
ANALYZE=true npm run build

# Use output: "standalone" (already configured)
# Enable SWC minification (default in Next.js 16)
# Keep productionBrowserSourceMaps: false
```

---

## 15. Rollback Strategy

### Docker Image Tags

All images should be tagged with a version and never overwritten:

```bash
docker build -t nexus-ecommerce:1.0.0 .
docker build -t nexus-ecommerce:1.0.1 .
# NEVER: docker build -t nexus-ecommerce:latest . (overwrites)
```

Tag IDs are tracked in the CI/CD pipeline (git SHA, semver). To rollback:

```bash
# Docker Swarm
docker service update --image nexus-ecommerce:1.0.0 nexus_app

# Kubernetes
kubectl rollout undo deployment/nexus-app

# ECS
aws ecs update-service --service nexus-app \
  --force-new-deployment \
  --region us-east-1 \
  --task-definition nexus-ecommerce:1.0.0

# Vercel
# Deploy previous successful deployment from Vercel dashboard
```

### Database Backups

**MongoDB Atlas:**
- Enable **Continuous Cloud Backup** (PITR) for production clusters
- Restore to any point in the last 24 hours
- Schedule **Snapshot Schedules** (daily/weekly) for long-term retention

**Manual Backup & Restore:**

```bash
# Backup
mongodump --uri="$MONGODB_URI" --out=./backups/$(date +%Y-%m-%d)

# Restore
mongorestore --uri="$MONGODB_URI" --drop ./backups/2026-07-09
```

### Feature Flags

Implement simple feature flags using environment variables or Redis:

```typescript
// Example: Feature flags in env
ENABLE_NEW_CHECKOUT=false
ENABLE_RECOMMENDATIONS=true
```

Or use Redis for runtime toggles:

```typescript
const isEnabled = await redis.get(`feature:new-checkout`);
// Toggle via admin panel or API
```

This allows deploying code without immediately enabling it, reducing rollback pressure.

### Rollback Steps

1. **Assess impact** — Is the issue critical (payments, auth, checkout)?
2. **Revert code** — Revert the commit and push a fix, or rollback the Docker image
3. **Database** — If migrations are involved, run the down migration
4. **Verify** — Confirm health endpoint, test checkout flow
5. **Communicate** — Post an incident report

---

## 16. Post-Deployment Checklist

Verify the following after every production deployment:

### Core Functionality

- [ ] **Health endpoint** returns 200: `curl https://yourdomain.com/api/health`
- [ ] **SSL certificate** is valid and not expired
- [ ] **Homepage** loads without errors (check console/browser devtools)
- [ ] **Product listing** page renders and products are searchable
- [ ] **Product detail** page loads with images from Cloudinary
- [ ] **User registration** works end-to-end (including verification email)
- [ ] **User login** works (email/password and OAuth if configured)
- [ ] **Add to cart** flow works (both authenticated and guest)
- [ ] **Checkout** flow completes a test transaction (use a $0 or refunded item)
- [ ] **Order history** shows completed order

### Integrations

- [ ] **Stripe webhooks** are being received (check Stripe Dashboard → Webhooks → Recent)
- [ ] **Emails** are being delivered (SendGrid/Resend dashboard showing sent events)
- [ ] **Cloudinary uploads** work (upload a test product image)
- [ ] **Redis cache** is populated (check Upstash dashboard for keys)
- [ ] **MongoDB Atlas** connection count is within normal range

### Performance & Security

- [ ] **Page load time** is under 3 seconds (Lighthouse, WebPageTest)
- [ ] **API response times** are within acceptable range (p95 < 500ms)
- [ ] **Security headers** are present (use `curl -I` or securityheaders.com)
- [ ] **Rate limiting** is active (try hitting `/api/auth/` rapidly and verify 429)
- [ ] **CORS** headers are correct for your domain
- [ ] **Image optimization** is working (serve WebP/AVIF formats)

### Monitoring

- [ ] **Sentry** (if configured) shows no new errors since deployment
- [ ] **Logs** are flowing to your log aggregator
- [ ] **Uptime monitor** is configured and reporting healthy
- [ ] **Error alerts** are set up with appropriate thresholds
- [ ] **Database backups** are configured and recent

### Infrastructure

- [ ] **Number of running instances** matches desired count
- [ ] **CPU/memory** metrics are stable (no unexpected spikes)
- [ ] **Disk space** is adequate (check log rotation)
- [ ] **Container restart count** is zero (indicates no crashes)
- [ ] **DNS records** are resolving correctly (A/AAAA records, CNAMEs)

### SEO & Analytics

- [ ] **Robots.txt** is accessible: `curl https://yourdomain.com/robots.txt`
- [ ] **Sitemap** is generated: `curl https://yourdomain.com/sitemap.xml`
- [ ] **Google Analytics** (if configured) is receiving pageviews
- [ ] **Meta tags** (title, description, OG) render correctly
- [ ] **Canonical URLs** are correct

---

## Appendix: Quick Reference

### Useful Commands

```bash
# Development
npm run dev              # Next.js dev server
npm run dev:socket       # Socket.io server
npm run dev:all          # Both concurrently
npm run seed             # Seed test data

# Quality
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run test             # Vitest
npm run test:ci          # CI test runner

# Build
npm run build            # Production build
ANALYZE=true npm run build  # Build with bundle analysis

# Docker
docker compose up -d              # Start all services
docker compose up -d mongodb redis # Start only DBs
docker compose -f docker-compose.prod.yml up -d  # Production stack
docker compose down -v            # Stop and remove volumes

# Production
npm run start                     # Start Next.js production server
node .next/standalone/server.js   # Run standalone output
```

### Environment Check Script

```bash
#!/bin/bash
# verify-env.sh - Check required variables are set

required_vars=(
  "AUTH_SECRET"
  "MONGODB_URI"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "STRIPE_SECRET_KEY"
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
  "CLOUDINARY_API_KEY"
  "CLOUDINARY_API_SECRET"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: $var is not set"
    exit 1
  fi
done

echo "All required variables are set."
```

### Port Reference

| Port | Service | Purpose |
|---|---|---|
| 3000 | Next.js | Main application |
| 3001 | Express + Socket.io | Real-time server |
| 27017 | MongoDB | Database |
| 6379 | Redis | Cache / pub-sub |
| 443 | ALB / Reverse proxy | HTTPS traffic |
| 80 | ALB / Reverse proxy | HTTP redirect |

---

> **Last updated:** July 2026  
> **Next.js version:** 16.x  
> **Node.js requirement:** 20.x  
> **Docker base image:** `node:20-alpine`
