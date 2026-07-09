# Nexus E-Commerce — Testing Strategy

**Status:** Draft · **Owner:** Engineering Team · **Last Updated:** 2026-07-09

---

## 1. Testing Philosophy

The Nexus platform currently has **zero tests**. This document defines the roadmap to achieve a disciplined, automated testing culture.

### Core Tenets

- **Test-Driven Development (TDD) for bug fixes and new services.** Red-green-refactor for all service-layer and utility code. UI and API routes may use test-first where practical.
- **Coverage targets are floor, not ceiling.** Every PR must maintain or improve coverage in the changed modules.
- **Fail fast, fail locally.** A test suite that catches bugs before CI is worth more than one that catches them after.
- **Flaky tests are a P1 bug.** Any test that fails nondeterministically must be fixed or quarantined within 48 hours.

### Coverage Targets

| Layer         | Target  | Gate          |
|---------------|---------|---------------|
| Unit          | ≥ 80%   | `npm run test:ci` |
| Integration   | ≥ 60%   | CI pipeline   |
| E2E (critical paths) | 100% pass | Pre-merge |
| Component     | ≥ 70%   | PR review     |

---

## 2. Test Pyramid

```
         ╱╲
        ╱  ╲              E2E (5 %)
       ╱    ╲         Playwright · critical user journeys
      ╱──────╲
     ╱        ╲      Integration (25 %)
    ╱          ╲    API routes · DB interactions · auth flows
   ╱────────────╲
  ╱              ╲   Unit (70 %)
 ╱                ╲ Utilities · hooks · services · validations
╱──────────────────╲
```

**Ratio target (40∶5∶1 by file count):** ~70% unit, ~25% integration, ~5% E2E.

---

## 3. Unit Testing

### Framework

- **Vitest** (already referenced in `package.json` scripts as `vitest run`).
- **@testing-library/react** + **@testing-library/jest-dom** for component-level unit tests.
- **happy-dom** or **jsdom** as the DOM environment.

### What to Test

| Category | Examples | Location |
|----------|----------|----------|
| **Utilities** | `cn()`, `formatPrice()`, `formatDate()`, `truncateText()`, `isValidEmail()`, `debounce()`, `throttle()` | `src/shared/utils/`, `src/lib/utils.ts` |
| **Validations** | Zod schemas: `registerSchema`, `productSchema`, `orderSchema`, `settingsSchema` | `src/lib/validations.ts` |
| **API Client** | `ApiClient.get()`, `.post()`, error handling, query params | `src/shared/services/api-client.ts` |
| **Services** | `AuthService`, `CartService`, `OrderService`, `ProductService`, `CategoryService` | `src/modules/*/services/` |
| **Hooks** | `useLoginForm`, `useCheckout`, `useCartDrawer`, `useSearchBar`, `useAdminUsers` — mocking fetches | `src/modules/*/hooks/` |
| **RBAC / Permissions** | `checkRole()`, `hasPermission()`, `getPermissions()` | `src/lib/permissions.ts`, `src/lib/rbac.ts` |
| **Security** | `stripHtml()`, `sanitizeInput()`, `validateCsrf()`, `sanitizeFilename()` | `src/lib/security/` |
| **Checkout Utils** | `calculateTax()`, `validatePhoneBD()`, `getShippingRates()`, `validateAddressIntl()` | `src/lib/checkout-utils.ts` |
| **SKU / Slug logic** | Slug generation, `slugify` usage | `src/app/api/products/route.ts` |
| **Email helpers** | Template rendering (snapshot), URL construction | `src/lib/email.ts`, `src/lib/email-templates.ts` |
| **Stripe / Redis clients** | Null-safety when env vars missing, fallback behavior | `src/lib/stripe.ts`, `src/lib/redis.ts` |

### Mocking Strategy

- **MongoDB models:** Use `vi.mock()` on model imports (e.g., `@/core/database/models/Product`). Return plain objects that match the expected shape.
- **API responses:** Mock `global.fetch` or the `apiClient` methods directly. Use `vi.stubGlobal('fetch', ...)` in setup files.
- **Next.js primitives:** Mock `headers()`, `cookies()`, `NextResponse`, `NextRequest` via `vi.mock('next/headers')` etc.
- **Auth session:** Mock `auth()` from `@/lib/auth` or `@/core/auth` to return a known session object.
- **`dbConnect()`:** Replace with a no-op mock in unit tests — we don't want real database calls.

### Example: Utility Test (Vitest)

```ts
// src/shared/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from '../format';

describe('formatPrice', () => {
  it('formats USD by default', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
  });

  it('formats EUR when specified', () => {
    expect(formatPrice(10, 'EUR')).toBe('€10.00');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('handles large numbers with separators', () => {
    expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
  });
});
```

### Example: Validation Schema Test

```ts
// src/lib/__tests__/validations.test.ts
import { describe, it, expect } from 'vitest';
import { registerSchema } from '../validations';

describe('registerSchema', () => {
  it('validates a valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'StrongP@ss1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects weak passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'weak',
    });
    expect(result.success).toBe(false);
  });
});
```

### Example: Hook Test (with mocks)

```ts
// src/modules/cart/hooks/__tests__/use-cart-drawer.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCartDrawer } from '../use-cart-drawer';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCartDrawer', () => {
  it('is closed by default', () => {
    const { result } = renderHook(() => useCartDrawer());
    expect(result.current.isOpen).toBe(false);
  });

  it('opens when toggle is called', () => {
    const { result } = renderHook(() => useCartDrawer());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });
});
```

---

## 4. Integration Testing

### API Route Testing

Each Next.js API route (`src/app/api/**/route.ts`) should have at least one happy-path and one error-path integration test.

- **Tool:** Vitest + `mongodb-memory-server`
- **Pattern:** Spin up an in-memory MongoDB, seed minimal data, execute the route handler directly, assert response shape.

### Setup

```ts
// tests/integration/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
```

### Example: POST /api/products

```ts
// tests/integration/api/products/create.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { POST } from '@/app/api/products/route';
import { User } from '@/core/database/models/User';
import { Category } from '@/core/database/models/Category';

// Mock auth to return admin
vi.mock('@/lib/auth', () => ({
  auth: () => ({ user: { id: 'admin-id', role: 'admin' } }),
}));

describe('POST /api/products', () => {
  it('creates a product with valid data', async () => {
    const cat = await Category.create({ name: 'Test', slug: 'test' });
    const req = new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Product',
        description: 'A test',
        price: 19.99,
        images: ['https://example.com/img.jpg'],
        category: cat._id.toString(),
      }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.product.name).toBe('Test Product');
  });

  it('rejects unauthorized vendors', async () => {
    // Override mock for this test
    vi.mocked(auth).mockReturnValueOnce(null);
    const req = new Request('http://localhost/api/products', { method: 'POST', body: '{}' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
```

### Database Integration Tests

- Test repositories (`src/core/database/repositories/`) against `mongodb-memory-server`.
- Test queries with actual MongoDB operators — filtering, pagination, sorting, aggregation.

### Authentication Flow Tests

| Flow | What to Verify |
|------|----------------|
| Register | User created, password hashed, verification email queued |
| Login | Session returned, invalid credentials rejected |
| Forgot password | Token stored, email sent |
| Reset password | Token consumed, password updated |
| 2FA | OTP generated, verified, rejected on wrong code |
| Session expiry | Expired session returns 401 |
| Role-based access | Admin vs. user vs. vendor endpoint restrictions |

### Admin CRUD Tests

- Create → Read → Update → Delete for: Products, Users, Categories, Orders, Coupons, Gift Cards, Brands
- Verify permission checks: role middleware returns 403 for non-admin users
- Test pagination, sorting, and search query parameters

---

## 5. End-to-End Testing

### Framework

- **Playwright** (Microsoft) — cross-browser, auto-wait, trace viewer, component testing support.
- Install: `npm init playwright@latest -- --ct` for component tests; `npm init playwright` for E2E.

### Key Flows

#### Customer Journey (Primary)

1. **Registration** — Visit `/register`, fill form, submit, verify redirect. (Dev mode: skip email verification.)
2. **Browse Products** — Load homepage → see featured products → navigate to `/products` → apply category filter → sort by price.
3. **Product Detail** — Click product → see images, specs, reviews → select variant.
4. **Add to Cart** — Click "Add to Cart" → cart drawer opens → quantity updates → cart badge reflects count.
5. **Checkout** — Proceed to checkout → fill shipping address → select shipping method → apply coupon → review order.
6. **Payment** — Enter card details (Stripe test card: `4242 4242 4242 4242`) → submit → success page with order number.
7. **Order History** — Visit `/dashboard/orders` → see the placed order → click detail → status visible.

#### Admin Flows

1. **Dashboard** — Log in as admin → verify KPI cards (revenue, orders, users) render.
2. **CRUD Operations** — Create a product via admin form → verify it appears in product list → edit title → verify update → delete → verify removal.
3. **User Management** — List users → change user role → ban user → verify user cannot log in.
4. **Reports** — Navigate to reports → sales chart renders → date range filter works.
5. **Settings** — Update site name → verify change persists after reload.

#### Edge Cases

- **Empty states:** Cart with no items, no orders, no search results
- **Error states:** Network failure toast, invalid coupon code, declined card
- **Responsiveness:** Mobile viewport (375×667), tablet (768×1024), desktop (1920×1080)
- **Guest checkout:** Without logging in → provide email → complete purchase → receive order confirmation

### Cross-Browser Matrix

| Browser        | Desktop          | Mobile           |
|----------------|------------------|------------------|
| Chromium       | ✅ Primary       | ✅ Pixel 7      |
| Firefox        | ✅ Primary       | —                |
| Safari         | ✅ (WebKit)      | ✅ iPhone 14    |
| Edge           | ✅ Smoke         | —                |

Run in CI on 3 shards (Chromium, Firefox, WebKit) in parallel.

### Playwright Config Example

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

---

## 6. Component Testing

### Approach

Use **Vitest + React Testing Library** for all component-level tests. This aligns with the existing toolchain.

### What to Test Per Component

- **Rendering:** Component renders with default props; children appear.
- **Props:** Different prop combinations produce correct output.
- **Interactions:** Click handlers fire, form inputs update, dropdowns open.
- **Accessibility:** `role`, `aria-*`, label associations (baseline).

### Example: ProductCard

```tsx
// src/components/products/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../ProductCard';

const mockProduct = {
  _id: 'abc',
  name: 'Wireless Headphones',
  price: 79.99,
  images: ['/img.jpg'],
  rating: 4.5,
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$79.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct._id);
  });
});
```

### Visual Regression Testing

- **Tool:** `storybook` + `chromatic`, or `playwright` screenshot comparison.
- **Approach:** Capture screenshots of every component in `src/components/ui/` (55 shadcn components) and key composite components.
- Run Chromatic on PRs to catch unintended style changes.

### Accessibility Testing

- **Tool:** `axe-core` via `@axe-core/playwright` in E2E, or `jest-axe` for component-level.
- **Gate:** Every component test must include an `axe` assertion. No violations allowed on critical pages.

```ts
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<ProductCard product={mockProduct} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 7. Performance Testing

### Lighthouse CI

- **Tool:** `@lhci/cli`
- **Targets (mobile simulated):**

| Metric       | Target |
|--------------|--------|
| Performance  | ≥ 85   |
| Accessibility| ≥ 90   |
| Best Practices | ≥ 90   |
| SEO          | ≥ 90   |
| LCP          | ≤ 2.5s |
| CLS          | ≤ 0.1  |
| TBT          | ≤ 200ms |

- Run on every PR against the preview deployment (or local build with `lhci autorun`).

### Load Testing (k6)

- **Tool:** Grafana k6 (open-source, scriptable in JS).
- **Scenarios:**

| Scenario | VUs | Duration | Endpoint |
|----------|-----|----------|----------|
| Browse surge | 100 → 500 (ramp) | 5 min | `GET /api/products` |
| Concurrent checkouts | 50 constant | 3 min | `POST /api/orders` |
| Search load | 200 constant | 5 min | `GET /api/search?q=headphones` |

- **Success criteria:** p95 response time < 500ms, error rate < 1%.
- Run weekly against staging environment.

### API Response Time Benchmarks

| Endpoint              | p50    | p95    | p99    |
|-----------------------|--------|--------|--------|
| GET /api/products     | < 80ms | < 200ms | < 400ms |
| GET /api/products/:id | < 50ms | < 150ms | < 300ms |
| POST /api/orders      | < 150ms| < 400ms | < 800ms |
| POST /api/auth/login  | < 100ms| < 300ms | < 500ms |
| POST /api/register    | < 200ms| < 500ms | < 1000ms |

---

## 8. Security Testing

### SAST & DAST

- **SAST:** ESLint with `eslint-plugin-security` rules (already in `eslint.config.mjs` — extend or add plugin).
- **DAST:** OWASP ZAP (zap-cli) against staging every release.

### Injection Tests

| Type | Test Case | Expected |
|------|-----------|----------|
| NoSQL | `username[$ne]=admin&password[$ne]=x` | 400 or 401 — not a successful login |
| XSS | `name=<script>alert(1)</script>` | `<script>` stripped, stored value is `alert(1)` |
| CSRF | POST without `x-csrf-token` header | 403 — `csrfErrorResponse()` |
| Path traversal | `filename=../../../etc/passwd` | Filename sanitized to `etc_passwd` |

### Tools & Automation

- **OWASP ZAP** — `zap-full-scan.py -t https://staging.nexus.com` before every release.
- **`csrf.ts`** — Already implemented. Verify with integration tests that CSRF-protected routes reject missing/mismatched tokens.
- **`sanitize.ts`** — Already implemented. Unit test the sanitization pipeline for all edge cases.

---

## 9. Test Infrastructure

### Test Database

- **`mongodb-memory-server`** — download and manage a mongod binary in-process. Used for integration tests only.
- **Setup file** (`tests/setup.ts`): Start memory server before all tests, connect mongoose, drop collections between test suites.
- **Seed helpers** — Factory functions for `createTestProduct()`, `createTestUser()`, `createTestOrder()`.

```ts
// tests/helpers/factories.ts
import { Product } from '@/core/database/models/Product';
import { User } from '@/core/database/models/User';
import { Types } from 'mongoose';

export const createTestUser = async (overrides = {}) =>
  User.create({
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: '$2b$10$...',
    role: 'user',
    ...overrides,
  });

export const createTestProduct = async (overrides = {}) =>
  Product.create({
    name: 'Test Product',
    slug: `test-${Date.now()}`,
    price: 29.99,
    images: ['https://example.com/img.jpg'],
    category: new Types.ObjectId(),
    ...overrides,
  });
```

### CI Pipeline Integration

Suggested stages (GitHub Actions):

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run typecheck

  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:ci

  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:integration

  e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npm run test:e2e -- --project=${{ matrix.browser }}

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npx lhci autorun
```

### Test Reporting & Dashboards

- **Vitest:** Built-in reporter + `@vitest/ui` for local debugging.
- **Playwright:** HTML report (`playwright-report/`) with trace viewer.
- **Coverage:** Generate `lcov` reports, upload to Codecov or Coveralls.
- **Dashboard:** Publish badge to README showing branch coverage.

### Flaky Test Management

- Tag flaky tests with `@flaky` annotation.
- `test.retry(3)` on flaky-tagged tests only.
- Weekly triage: CI dashboard → identify flaky tests → assign owner → fix or quarantine.
- Quarantine directory: `tests/flaky/` — excluded from CI, tracked separately.

---

## 10. Coverage Targets by Module

| Module | Target | Priority | Risk if Low |
|--------|--------|----------|-------------|
| `src/shared/utils/` (cn, format, helpers) | 90% | P0 | Style breaks, currency formatting wrong |
| `src/lib/validations.ts` | 90% | P0 | Bad data enters the system |
| `src/lib/security/` (sanitize, csrf) | 95% | P0 | XSS, CSRF vulnerabilities |
| `src/lib/permissions.ts` | 95% | P0 | Authorization bypass |
| `src/lib/checkout-utils.ts` | 90% | P0 | Tax/shipping miscalculated |
| `src/lib/rbac.ts` | 90% | P0 | Unauthorized access |
| `src/lib/redis.ts` | 85% | P1 | Rate limiting bypass |
| `src/lib/stripe.ts` | 85% | P1 | Payment failures |
| `src/lib/email.ts` | 80% | P1 | Missed transactional emails |
| `src/shared/services/api-client.ts` | 90% | P0 | API calls fail silently |
| API routes (`src/app/api/**/route.ts`) | 80% | P0 | Backend contract violations |
| Repositories (`src/core/database/repositories/`) | 85% | P0 | Data access bugs |
| Modules — Services (`src/modules/*/services/`) | 75% | P1 | Business logic bugs |
| Modules — Hooks (`src/modules/*/hooks/`) | 85% | P1 | UI state bugs |
| Components — UI (`src/components/ui/`) | 70% | P2 | Visual regressions |
| Components — Layout (`src/components/layout/`) | 70% | P2 | Navigation breaks |
| Components — Feature (`src/components/*/`) | 60% | P2 | Feature-specific regressions |
| Pages (`src/app/**/page.tsx`) | 50% | P2 | Page rendering bugs |
| Middleware (`src/core/middleware/`) | 85% | P1 | Auth guard bypass |
| Seed scripts (`src/core/database/seed/`) | 0% (manual) | P3 | Dev data drift |

**Priorities:** P0 = required for launch, P1 = required within 1 sprint of launch, P2 = nice-to-have, P3 = on-ice.

---

## 11. Running Tests

### Commands

```bash
# Run all unit tests (once)
npm run test

# Watch mode (development)
npm run test:watch

# CI mode (verbose, full coverage)
npm run test:ci

# Run specific test file
npx vitest src/shared/utils/__tests__/format.test.ts

# Run tests matching a pattern
npx vitest --reporter=verbose -- "use-checkout"

# Coverage report
npx vitest run --coverage

# Integration tests (requires special config)
npx vitest run --config vitest.integration.config.ts

# E2E tests (Playwright)
npx playwright test
npx playwright test --ui           # Interactive UI mode
npx playwright test --debug        # Step-through debug
npx playwright show-report         # View HTML report

# E2E for specific file
npx playwright test tests/e2e/checkout.spec.ts

# Component tests (Playwright CT)
npx playwright test --config playwright-ct.config.ts

# Accessibility scan
npx axe --dir . --show-errors

# Lighthouse CI
npx lhci autorun

# Load test (k6)
k6 run tests/load/scenario-browse.js
```

### Package.json Scripts (to add)

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ci": "vitest run --reporter=verbose --coverage",
  "test:integration": "vitest run --config vitest.integration.config.ts",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:component": "playwright test --config playwright-ct.config.ts",
  "test:lighthouse": "lhci autorun",
  "test:security": "zap-cli quick-scan --self-contained http://localhost:3000",
  "test:load": "k6 run tests/load/scenario-browse.js"
}
```

---

## 12. Continuous Testing

### Pre-commit Hooks (Husky + lint-staged)

```json
// .husky/pre-commit
{
  "scripts": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "vitest related --run --reporter=verbose"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

Only run tests related to the changed files (`vitest related`) to keep pre-commit fast.

### CI Pipeline Stages (Suggested)

```
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│   Lint  │ → │ Typecheck│ → │   Unit   │ → │Integrate │ → │    E2E   │ → │Lighthouse│
│  (2 min)│   │  (3 min) │   │  (4 min) │   │  (5 min) │   │ (12 min) │   │  (3 min) │
└─────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                    ↓
                              Coverage Gate
                              ≥80% unit
                              ≥60% integration
```

1. **Lint** — ESLint with security plugins.
2. **Typecheck** — `tsc --noEmit`.
3. **Unit** — All `src/**/*.test.ts` (Vitest), including coverage report.
4. **Integration** — `mongodb-memory-server` tests, slow but thorough.
5. **E2E** — 3 parallel Playwright shards (Chromium, Firefox, WebKit).
6. **Lighthouse** — Performance budget checks against built output.

| Gate | Condition | Action |
|------|-----------|--------|
| Fast-fail | Lint or typecheck fails | Pipeline stops immediately |
| Coverage | Unit < 80% integration < 60% | PR blocked, report posted as comment |
| E2E | Any critical flow fails | PR blocked |
| Lighthouse | Any metric below target | Warning posted as comment |

### Post-Merge

- Security scan (OWASP ZAP) runs against staging after every merge to `main`.
- Weekly load test (k6) against staging.
- Monthly audit of flaky test reports.

---

## Appendix A: Directory Structure for Tests

```
my-app/
├── tests/
│   ├── setup.ts                  # Global test setup (jsdom, polyfills)
│   ├── helpers/
│   │   ├── factories.ts          # Test data factories (createTestUser, etc.)
│   │   ├── mocks.ts              # Shared mocks (NextRequest, NextResponse)
│   │   └── db.ts                 # mongodb-memory-server lifecycle
│   ├── integration/
│   │   ├── setup.ts              # Memory server beforeAll/afterAll
│   │   └── api/
│   │       ├── products/
│   │       ├── auth/
│   │       ├── orders/
│   │       ├── admin/
│   │       └── ...
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── registration.spec.ts
│   │   │   └── login.spec.ts
│   │   ├── checkout/
│   │   │   ├── guest-checkout.spec.ts
│   │   │   └── logged-in-checkout.spec.ts
│   │   ├── admin/
│   │   │   ├── crud-products.spec.ts
│   │   │   └── user-management.spec.ts
│   │   └── fixtures/
│   │       └── test-account.json
│   ├── load/
│   │   ├── scenario-browse.js    # k6 script
│   │   └── scenario-checkout.js
│   └── flaky/                    # Quarantined flaky tests
├── src/
│   ├── shared/utils/__tests__/
│   ├── lib/__tests__/
│   ├── modules/*/*/__tests__/
│   └── components/*/__tests__/
```

---

## Appendix B: Tools & Dependencies to Install

```bash
# Testing framework
npm install -D vitest @vitest/coverage-v8 @vitest/ui

# React Testing Library
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# DOM environment
npm install -D jsdom happy-dom

# MongoDB memory server
npm install -D mongodb-memory-server

# E2E
npm install -D @playwright/test

# Accessibility
npm install -D jest-axe @axe-core/playwright

# Performance
npm install -D @lhci/cli

# Security (SAST)
npm install -D eslint-plugin-security

# Pre-commit
npm install -D husky lint-staged

# Optional: Storybook for visual regression
npm install -D @storybook/nextjs @chromatic-com/storybook
```

---

## Appendix C: Configuration Files

### `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.*',
        'src/**/index.ts',
        'src/app/**/layout.tsx',
        'src/app/**/page.tsx',
        'src/components/ui/**',      // shadcn primitives — low value to unit test
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
```

### `vitest.integration.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/integration/setup.ts'],
    include: ['tests/integration/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
    hookTimeout: 30000,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
```

---

*This document is a living strategy. Update it as tools, patterns, and coverage targets evolve.*
