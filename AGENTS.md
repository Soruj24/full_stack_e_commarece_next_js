# Agent Instructions for Nexus E-Commerce Platform

## Project Overview

Nexus is a comprehensive full-stack e-commerce platform built with Next.js 14, MongoDB, and TypeScript.

## Key Directories

- `app/` - Next.js App Router pages and API routes
- `components/` - React components organized by feature
- `context/` - React Context providers
- `models/` - Mongoose database models
- `types/` - TypeScript type definitions

## Important Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
```

## Code Style Guidelines

1. **Component Structure**
   - Use functional components with hooks
   - Export named components
   - Use TypeScript for all components
   - Follow single responsibility principle

2. **Naming Conventions**
   - Components: PascalCase (e.g., `ProductCard.tsx`)
   - Hooks: camelCase with `use` prefix (e.g., `useCart.ts`)
   - Utilities: camelCase (e.g., `formatCurrency.ts`)
   - Types: PascalCase (e.g., `Product.ts`)

3. **File Organization**
   - Components in feature folders
   - Shared components in `components/common/`
   - UI components in `components/ui/`
   - Layout components in `components/layout/`

4. **Styling**
   - Use Tailwind CSS classes
   - Follow shadcn/ui patterns
   - Support dark mode
   - Use `cn()` utility for class merging

5. **State Management**
   - Use React Context for global state
   - Use local state for component-specific
   - Store cart/wishlist in localStorage

## Database Conventions

1. **Mongoose Models**
   - Schema with proper types
   - Index frequently queried fields
   - Use virtuals for computed fields
   - Enable timestamps

2. **API Routes**
   - RESTful naming
   - Error handling with try/catch
   - Return consistent response format
   - Use proper HTTP status codes

## Testing Guidelines

Before running tests:
```bash
npm run typecheck
npm run lint
```

## Important Patterns

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
