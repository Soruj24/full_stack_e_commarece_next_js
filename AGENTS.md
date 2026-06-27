# Agent Instructions for Nexus E-Commerce Platform

## Project Overview

Nexus is a comprehensive full-stack e-commerce platform built with Next.js 16, MongoDB, and TypeScript. It follows Clean Architecture with feature-based modular organization.

## Key Directories

```
my-app/
├── app/                    # Next.js App Router (pages, API routes, layouts)
├── features/               # Domain-driven feature modules (business logic)
│   ├── admin/              # Admin panel (hooks, services, types)
│   ├── analytics/          # Analytics tracking
│   ├── auth/               # Authentication & registration
│   ├── bundles/            # Product bundles
│   ├── cart/               # Shopping cart & stock management
│   ├── categories/         # Category management
│   ├── checkout/           # Checkout flow & payments
│   ├── common/             # Shared hooks & utilities
│   ├── compare/            # Product comparison
│   ├── gift-cards/         # Gift card system
│   ├── notifications/      # Real-time notifications
│   ├── orders/             # Order management & tracking
│   ├── products/           # Products, reviews, search
│   ├── returns/            # Return requests
│   ├── reviews/            # Product reviews
│   ├── search/             # Search functionality
│   ├── settings/           # Site settings
│   ├── support/            # Support tickets & FAQ
│   ├── user/               # User profile management
│   ├── vendor/             # Vendor management
│   └── wishlist/           # Wishlist
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui primitives (47 components)
│   └── layout/             # Layout components (navbar, header, mega-menu)
├── lib/                    # Shared utilities & infrastructure
│   ├── data/               # Static data (menus, testimonials, etc.)
│   ├── utils.ts            # cn(), formatDate, formatRole, etc.
│   ├── validations.ts      # Zod schemas
│   ├── rbac.ts             # Role-based access control
│   ├── audit.ts            # Audit logging
│   ├── stripe.ts           # Stripe client
│   ├── email.ts            # Email sending (nodemailer)
│   ├── redis.ts            # Upstash Redis client
│   └── ...                 # Other utilities
├── models/                 # Mongoose database models (23 models)
├── controllers/            # API controllers (thin wrappers)
├── config/                 # Database configuration
├── types/                  # Global TypeScript types (index.ts only)
└── server/                 # Standalone Express + Socket.io server
```

## Important Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
```

## Architecture Principles

1. **Feature-Based Organization**: Code is grouped by business domain, not file type
2. **Separation of Concerns**: UI (components/) separated from logic (features/)
3. **Single Responsibility**: Each feature module handles one domain
4. **Barrel Exports**: Each feature has an `index.ts` for clean imports
5. **Shared Utilities**: Cross-cutting concerns in `lib/`

## Code Style Guidelines

1. **Component Structure**
   - Use functional components with hooks
   - Export named components
   - Use TypeScript for all components
   - Follow single responsibility principle

2. **Naming Conventions**
   - Components: PascalCase (e.g., `ProductCard.tsx`)
   - Hooks: camelCase with `use` prefix (e.g., `useCart.ts`)
   - Services: camelCase with `-service` suffix (e.g., `product-service.ts`)
   - Types: PascalCase (e.g., `Product.ts`)

3. **File Organization**
   - Components in `components/` organized by feature
   - Business logic in `features/<domain>/`
   - UI components in `components/ui/`
   - Layout components in `components/layout/`

4. **Import Patterns**
   - Use `@/` path alias for root imports
   - Import from feature barrel exports: `import { useCart } from '@/features/cart'`
   - Import types from feature types: `import type { IProduct } from '@/types'`

5. **Styling**
   - Use Tailwind CSS classes
   - Follow shadcn/ui patterns
   - Support dark mode
   - Use `cn()` utility for class merging

6. **State Management**
   - Use React Context for global state (contexts in feature modules)
   - Use local state for component-specific
   - Store cart/wishlist in localStorage

## Database Conventions

1. **Mongoose Models**
   - Schema with proper types
   - Index frequently queried fields
   - Use virtuals for computed fields
   - Enable timestamps

2. **API Routes**
   - RESTful naming in `app/api/`
   - Error handling with try/catch
   - Return consistent response format: `{ success, data?, error?, pagination? }`
   - Use proper HTTP status codes

## Important Patterns

### Adding New Features

1. Create feature directory in `features/<domain>/`
2. Add subdirectories: `hooks/`, `services/`, `types/`, `context/` (as needed)
3. Create barrel export `index.ts`
4. Add components in `components/<domain>/`
5. Add API routes in `app/api/<domain>/`

### Adding New Components

1. Create in appropriate `components/` subfolder
2. Export from `index.ts` if it's a barrel export
3. Add TypeScript interfaces
4. Support dark mode
5. Add animations with Framer Motion

### Adding New API Routes

1. Create route in `app/api/`
2. Follow existing patterns
3. Add authentication if needed
4. Validate input with Zod
5. Return consistent response format

### Adding New Pages

1. Create in `app/` directory
2. Use App Router patterns
3. Add metadata for SEO
4. Support loading states
5. Handle error states

## Performance Considerations

1. Use `next/image` for all images
2. Lazy load heavy components
3. Memoize expensive computations
4. Use proper pagination
5. Implement proper caching

## Accessibility Requirements

1. Use semantic HTML
2. Add ARIA labels
3. Support keyboard navigation
4. Test with screen readers
5. Meet WCAG 2.1 AA standards

## Security Requirements

1. Validate all user input
2. Sanitize output
3. Use parameterized queries
4. Implement rate limiting
5. Follow OWASP guidelines

## Deployment Checklist

1. Run `npm run build`
2. Fix any TypeScript errors
3. Run `npm run lint`
4. Test all features
5. Verify environment variables
6. Check database migrations
7. Test payment integrations

## Commit Message Best Practices

1. **Use Conventional Commits format:**
   ```
   <type>(<scope>): <description>
   ```
   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`
   Scopes: `auth`, `cart`, `checkout`, `products`, `orders`, `admin`, `search`, `user`, `vendor`, `ui`, `api`, `db`

2. **Keep subject line under 50 characters**

3. **Use imperative mood** (e.g., "add feature" not "added feature")

4. **Separate subject from body with a blank line**

5. **Body should explain what and why, not how**

6. **Reference issues: Fixes #123, Closes #456**

7. **Example:**
   ```
   feat(cart): add wishlist functionality
   
   - Add wishlist button to product cards
   - Store wishlist in localStorage
   - Add wishlist page to view saved items
   
   Closes #42
   ```
