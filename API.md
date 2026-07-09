# Nexus E-Commerce Platform - API Documentation

> **Version:** 1.0.0 | **Last Updated:** 2026-07-09
> **Base URL:** `https://<your-domain>/api`
> **Total Endpoints:** 78

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Standard Response Format](#standard-response-format)
- [Error Codes](#error-codes)
- [Rate Limiting](#rate-limiting)
- [Pagination](#pagination)
- [API Reference](#api-reference)
  - [Authentication](#1-authentication)
  - [Products](#2-products)
  - [Categories](#3-categories)
  - [Brands](#4-brands)
  - [Bundles](#5-bundles)
  - [Checkout & Payments](#6-checkout--payments)
  - [Orders](#7-orders)
  - [Search](#8-search)
  - [User Profile](#9-user-profile)
  - [Notifications](#10-notifications)
  - [Returns](#11-returns)
  - [Support Tickets](#12-support-tickets)
  - [Vendors](#13-vendors)
  - [Settings](#14-settings)
  - [Admin Panel](#15-admin-panel)
  - [Content & Miscellaneous](#16-content--miscellaneous)

---

## Overview

The Nexus E-Commerce Platform exposes a RESTful API built with Next.js App Router. All endpoints return JSON responses. The platform uses MongoDB (Mongoose) for data persistence, NextAuth.js for session management, and Redis (Upstash) for rate limiting and caching.

### Key Technologies

| Technology | Purpose |
|---|---|
| Next.js App Router | API routing and server-side rendering |
| MongoDB + Mongoose | Database |
| NextAuth.js | Authentication (session cookies) |
| Redis (Upstash) | Rate limiting, caching |
| Stripe | Card payments |
| PayPal | PayPal payments |
| Zod | Request validation |

---

## Authentication

The API supports the following authentication mechanisms:

### 1. NextAuth Session Cookies (Primary)

Most authenticated endpoints use NextAuth session cookies. The session is verified via the `auth()` helper from `@/lib/auth`.

```
Cookie: next-auth.session-token=<encrypted-token>
```

### 2. Role-Based Access Control (RBAC)

Endpoints that require specific roles use the `checkRole()` helper from `@/lib/rbac`:

| Role | Access Level |
|---|---|
| `admin` | Full access to all resources |
| `vendor` | Product management, own orders |
| `user` | Standard user operations |

### 3. Unauthenticated Access

Some endpoints are public (product listing, search, categories) or have limited unauthenticated access (guest orders, contact form).

---

## Standard Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Alternative Success Shapes

Some endpoints return domain-specific keys:

| Endpoint Domain | Success Key |
|---|---|
| Products | `products` |
| Orders | `orders` |
| Users | `users` |
| Coupons | `coupons` |
| Categories | `categories` |
| Brands | `brands` |
| Gift Cards | `giftCards` |
| Returns | `returns` |
| Tickets | `tickets` |
| Vendors | `vendors` |
| Reviews | `reviews` |
| Payouts | `payouts` |
| Alerts | `alerts` |

---

## Error Codes

| HTTP Status | Meaning | Description |
|---|---|---|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input, validation error, or missing required fields |
| `401` | Unauthorized | Authentication required or invalid session |
| `403` | Forbidden | Insufficient permissions for the requested action |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Resource already exists (e.g., duplicate slug) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |
| `503` | Service Unavailable | Database or external service unavailable |

---

## Rate Limiting

Rate limiting is enforced via Redis on sensitive endpoints. Each endpoint defines its own limits:

| Tier | Limit | Window | Used By |
|---|---|---|---|
| **Strict** | 2 req | 60s | Resend verification |
| **Low** | 3 req | 60s | Register, Forgot password |
| **Medium** | 5 req | 60s | Verify OTP |
| **Medium-Long** | 5 req | 300s | Reset password |
| **Unlimited** | N/A | N/A | All other endpoints |

Rate limit headers returned when limited:

```
X-RateLimit-Remaining: 0
```

---

## Pagination

Paginated endpoints accept these query parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number (minimum: 1) |
| `limit` | integer | varies | Items per page (maximum: 100) |

**Pagination Response:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## API Reference

---

### 1. Authentication

#### POST `/api/register`

Register a new user account.

| | |
|---|---|
| **Auth Required** | No |
| **Rate Limit** | 3 req / 60s |
| **Cache** | None |

**Request Body:**

```json
{
  "name": "string (2-50 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 8 chars, must include uppercase, lowercase, number, special char)",
  "image": "string (URL, optional)",
  "referralCode": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Verification OTP sent to your email",
  "email": "user@example.com"
}
```

**Notes:**
- First registered user is automatically assigned `admin` role and auto-verified.
- If user exists but is unverified, a new OTP is sent and info is updated.
- Verification OTP expires in 10 minutes.

---

#### POST `/api/verify-otp`

Verify email with OTP code sent during registration.

| | |
|---|---|
| **Auth Required** | No |
| **Rate Limit** | 5 req / 60s |

**Request Body:**

```json
{
  "email": "string (required)",
  "otp": "string (6-digit code, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully. You can now login."
}
```

---

#### POST `/api/forgot-password`

Request a password reset email.

| | |
|---|---|
| **Auth Required** | No |
| **Rate Limit** | 3 req / 60s |

**Request Body:**

```json
{
  "email": "string (valid email, required)"
}
```

**Success Response (200):**

```json
{
  "success": true
}
```

**Notes:**
- Always returns `200` with `success: true` regardless of whether the email exists (security measure).
- Reset token expires in 1 hour.

---

#### POST `/api/auth/reset-password`

Reset password using the token from the email link.

| | |
|---|---|
| **Auth Required** | No |
| **Rate Limit** | 5 req / 300s |

**Request Body:**

```json
{
  "token": "string (reset token from email, required)",
  "password": "string (min 8 chars, required)"
}
```

**Success Response (200):**

```json
{
  "success": true
}
```

**Notes:**
- Invalidates all existing sessions for the user.
- Removes refresh token.

---

#### GET `/api/auth/validate-token`

Validate a reset or invite token.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `token` | string | required | The token to validate |
| `type` | string | `"reset"` | Token type (`reset` or `invite`) |

**Success Response (200):**

```json
{
  "valid": true,
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Error Response (400):**

```json
{
  "valid": false
}
```

---

#### POST `/api/auth/accept-invite`

Accept an admin invitation and set up account.

| | |
|---|---|
| **Auth Required** | No |

**Request Body:**

```json
{
  "token": "string (invite token, required)",
  "name": "string (optional)",
  "password": "string (required)"
}
```

**Success Response (200):**

```json
{
  "message": "Account setup complete"
}
```

---

#### POST `/api/auth/resend-verification`

Resend email verification OTP.

| | |
|---|---|
| **Auth Required** | No |
| **Rate Limit** | 2 req / 60s |

**Request Body:**

```json
{
  "email": "string (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Verification code resent to your email"
}
```

---

#### GET `/api/auth/verify-email`

Verify email via link (token in query string).

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `token` | string | Verification token from email link |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

#### GET `/api/auth/login-history`

Get the current user's login history.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "email": "user@example.com",
      "ipAddress": "192.168.1.1",
      "device": "Desktop",
      "browser": "Chrome",
      "os": "Windows",
      "location": "New York, US",
      "success": true,
      "reason": null,
      "createdAt": "2026-07-09T12:00:00Z"
    }
  ]
}
```

**Notes:** Returns up to 50 most recent entries.

---

#### GET `/api/auth/sessions`

Get all active sessions for the current user.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2026-07-09T12:00:00Z",
      "expires": "2026-07-16T12:00:00Z"
    }
  ]
}
```

---

#### DELETE `/api/auth/sessions/[id]`

Revoke (delete) a specific session.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Session MongoDB ObjectId |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Session revoked"
}
```

**Notes:** Users can only revoke their own sessions (403 if mismatch).

---

#### POST `/api/auth/sessions/revoke-all`

Revoke all other sessions (keep current session active).

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{
  "success": true,
  "message": "All other devices logged out"
}
```

---

#### POST `/api/auth/2fa/setup`

Initialize 2FA setup - generates QR code and secret.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{
  "qrCodeUrl": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

**Notes:** Secret is stored on user (not yet enabled). Must call `/api/auth/2fa/verify` to activate.

---

#### POST `/api/auth/2fa/verify`

Verify 2FA token and enable 2FA.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "token": "string (6-digit TOTP code, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

---

### 2. Products

#### GET `/api/products`

List products with filtering, sorting, and pagination.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=60, stale-while-revalidate=300` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `12` | Items per page (max: 100) |
| `keyword` / `q` | string | - | Search in name, SKU, description, tags |
| `category` | string | - | Category ID |
| `brand` | string | - | Brand name or ID |
| `minPrice` | float | - | Minimum price |
| `maxPrice` | float | - | Maximum price |
| `inStock` | boolean | - | Only in-stock products |
| `onSale` | boolean | - | Only products with discount |
| `color` | string | - | Filter by color |
| `size` | string | - | Filter by size |
| `tags` | string | - | Comma-separated tags |
| `isActive` | boolean | `true` | Active products only |
| `isArchived` | boolean | `false` | Include archived |
| `featured` | boolean | - | Featured products only |
| `rating` | float | - | Minimum rating |
| `ids` | string | - | Comma-separated product IDs |
| `sortBy` | string | `-createdAt` | Sort: `price_asc`, `price_desc`, `name_asc`, `name_desc`, `rating`, `newest`, `oldest`, `popular`, `stock` |
| `select` | string | - | Fields to include (comma-separated) |
| `filters` | boolean | - | Include filter options in response |

**Success Response (200):**

```json
{
  "success": true,
  "products": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "pages": 13,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "brands": ["Brand A", "Brand B"],
    "colors": ["Red", "Blue"],
    "sizes": ["S", "M", "L"],
    "priceRange": { "minPrice": 9.99, "maxPrice": 999.99 }
  }
}
```

---

#### POST `/api/products`

Create a new product.

| | |
|---|---|
| **Auth Required** | Yes (`admin` or `vendor`) |

**Request Body:**

```json
{
  "name": "string (required)",
  "slug": "string (auto-generated if omitted)",
  "description": "string",
  "price": "number (required)",
  "discountPrice": "number (optional)",
  "category": "ObjectId (required)",
  "brand": "string",
  "brandRef": "ObjectId",
  "stock": "integer",
  "lowStockThreshold": "integer",
  "images": ["string (URL)"],
  "colors": ["string"],
  "sizes": ["string"],
  "tags": ["string"],
  "specifications": [{ "key": "string", "value": "string", "group": "string" }],
  "variants": [{ "name": "string", "sku": "string", "price": "number", "stock": "integer" }],
  "isFeatured": "boolean",
  "isActive": "boolean",
  "dimensions": { "length": "number", "width": "number", "height": "number", "weight": "number" }
}
```

**Success Response (201):**

```json
{
  "success": true,
  "product": { ... }
}
```

---

#### GET `/api/products/[id]`

Get a single product by ID or slug.

| | |
|---|---|
| **Auth Required** | No |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Product ID or slug |

**Success Response (200):**

```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "...",
    "slug": "...",
    "category": { "name": "...", "slug": "..." },
    "brandRef": { "name": "...", "slug": "...", "logo": "..." },
    "relatedProducts": [ ... ],
    "frequentlyBoughtTogether": [ ... ]
  }
}
```

---

#### PATCH `/api/products/[id]`

Update a product.

| | |
|---|---|
| **Auth Required** | Yes (`admin` or `vendor`) |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Product MongoDB ObjectId |

**Request Body:** Partial product fields to update.

**Notes:** If `price` changes, a price history record is automatically created.

**Success Response (200):**

```json
{
  "success": true,
  "product": { ... }
}
```

---

#### DELETE `/api/products/[id]`

Delete a product.

| | |
|---|---|
| **Auth Required** | Yes (`admin` only) |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Product MongoDB ObjectId |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Product deleted"
}
```

---

#### GET `/api/products/[id]/related`

Get related products (falls back to same-category products).

| | |
|---|---|
| **Auth Required** | No |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Product MongoDB ObjectId |

**Success Response (200):**

```json
{
  "success": true,
  "products": [ ... ]
}
```

**Notes:** Returns up to 8 related products. Uses `relatedProducts` field first, then falls back to same-category products sorted by rating.

---

#### GET `/api/products/[id]/frequently-bought-together`

Get frequently bought together products with pricing summary.

| | |
|---|---|
| **Auth Required** | No |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Product MongoDB ObjectId |

**Success Response (200):**

```json
{
  "success": true,
  "products": [ ... ],
  "totalPrice": 299.97,
  "savings": 15.00
}
```

**Notes:** Returns up to 6 FBT products. Falls back to same-category products sorted by reviews.

---

#### GET `/api/products/[id]/price-history`

Get price change history for a product.

| | |
|---|---|
| **Auth Required** | No |

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Product MongoDB ObjectId |

**Success Response (200):**

```json
{
  "success": true,
  "pricePoints": [
    {
      "date": "2026-07-01T00:00:00Z",
      "price": 29.99,
      "source": "manual_update"
    }
  ]
}
```

---

#### GET `/api/products/filters`

Get all available filter options for the product catalog.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=60, stale-while-revalidate=300` |

**Success Response (200):**

```json
{
  "success": true,
  "filters": {
    "categories": [{ "_id": "...", "name": "Electronics", "slug": "electronics" }],
    "brands": ["Apple", "Samsung", "Sony"],
    "colors": ["Black", "White", "Red"],
    "sizes": ["S", "M", "L", "XL"],
    "priceRange": { "minPrice": 9.99, "maxPrice": 999.99 },
    "ratingOptions": [4, 3, 2, 1]
  }
}
```

---

#### GET `/api/products/recommendations`

Get personalized product recommendations.

| | |
|---|---|
| **Auth Required** | Optional (enhances results) |
| **Cache** | `public, max-age=60, stale-while-revalidate=300` |

**Success Response (200):**

```json
[
  { "_id": "...", "name": "...", "price": 29.99, ... }
]
```

**Notes:**
- Returns an array directly (not wrapped in `{ success, data }`).
- Uses collaborative filtering for authenticated users (based on order history).
- Falls back to featured products, then newest products.
- Returns up to 4 recommendations.

---

#### GET `/api/products/search`

Search products with suggestions across products, categories, and brands.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `q` | string | Search query (min 2 chars) |

**Success Response (200):**

```json
{
  "success": true,
  "suggestions": {
    "products": [{ "name": "...", "slug": "...", "images": [...], "price": 29.99 }],
    "categories": [{ "name": "...", "slug": "...", "image": "..." }],
    "brands": [{ "name": "...", "slug": "...", "logo": "..." }]
  }
}
```

---

#### GET `/api/products/low-stock`

Get products below their low stock threshold and pending stock alerts.

| | |
|---|---|
| **Auth Required** | Yes (`admin` only) |

**Success Response (200):**

```json
{
  "success": true,
  "lowStock": [ ... ],
  "stats": {
    "outOfStock": 3,
    "lowStock": 7,
    "pendingAlerts": 5
  },
  "alerts": [
    {
      "_id": "productId",
      "count": 3,
      "emails": ["user@example.com"]
    }
  ]
}
```

---

### 3. Categories

#### GET `/api/categories`

List categories with filtering and tree support.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=300, stale-while-revalidate=600` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `featured` | boolean | - | Featured categories only |
| `all` | boolean | - | Include all levels (default: top-level only) |
| `tree` | boolean | - | Return hierarchical tree structure |
| `active` | boolean | - | Active categories only |
| `page` | integer | `1` | Page number |
| `limit` | integer | `1000` | Items per page |
| `keyword` | string | - | Search in name/description |
| `sortBy` | string | `order` | Sort by: `name`, `order`, `createdAt` |
| `sortOrder` | string | `asc` | Sort direction: `asc`, `desc` |

**Success Response (200):**

```json
{
  "success": true,
  "categories": [ ... ],
  "pagination": { "total": 25, "page": 1, "pages": 1 },
  "stats": {
    "totalTopLevel": 10,
    "totalSubcategories": 15,
    "totalActive": 22
  }
}
```

---

#### POST `/api/categories`

Create a new category.

| | |
|---|---|
| **Auth Required** | Yes (`admin` only) |

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string",
  "image": "string (URL)",
  "icon": "string",
  "parent": "ObjectId (optional, for subcategories)",
  "isFeatured": "boolean",
  "isActive": "boolean (default: true)",
  "order": "integer",
  "metaTitle": "string",
  "metaDescription": "string"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "category": { ... }
}
```

**Notes:** Maximum 4 levels of nesting depth.

---

### 4. Brands

#### GET `/api/brands`

List brands with pagination and search.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=300, stale-while-revalidate=600` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `isActive` | boolean | `true` | Active brands only |
| `keyword` | string | - | Search by name |
| `page` | integer | `1` | Page number |
| `limit` | integer | `50` | Items per page (max: 100) |

**Success Response (200):**

```json
{
  "success": true,
  "brands": [ ... ],
  "pagination": { "page": 1, "limit": 50, "total": 30, "pages": 1 }
}
```

---

### 5. Bundles

#### GET `/api/bundles`

List active product bundles.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=300, stale-while-revalidate=600` |

**Success Response (200):**

```json
{
  "success": true,
  "bundles": [
    {
      "_id": "...",
      "name": "Summer Bundle",
      "description": "...",
      "products": [
        { "id": "...", "name": "Product A", "price": 29.99, "image": "..." }
      ],
      "originalPrice": 99.99,
      "bundlePrice": 79.99,
      "discount": 20.00,
      "discountPercentage": 20,
      "stock": 50,
      "images": [...],
      "category": { "name": "...", "slug": "..." },
      "validUntil": "2026-08-31T00:00:00Z",
      "maxQuantity": 2
    }
  ]
}
```

**Notes:** Only returns active bundles that haven't expired.

---

### 6. Checkout & Payments

#### POST `/api/payments/create-intent`

Create a Stripe Payment Intent.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "amount": "number (minimum: 0.50, in dollars)",
  "currency": "string (default: 'usd')",
  "metadata": "object (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "clientSecret": "pi_..._secret_..."
}
```

**Error Response (503):**

```json
{
  "success": false,
  "error": "Stripe is not configured correctly..."
}
```

---

#### POST `/api/payments/paypal/create-order`

Create a PayPal order.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "amount": "number (required, > 0)",
  "currency": "string (default: 'USD')"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "id": "PAYPAL_ORDER_ID"
}
```

---

#### POST `/api/payments/paypal/capture-order`

Capture a PayPal order after customer approval.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "orderId": "string (PayPal order ID, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "transactionId": "PAYPAL_CAPTURE_ID",
  "details": { ... }
}
```

---

#### POST `/api/coupons/validate`

Validate a coupon code and calculate discount.

| | |
|---|---|
| **Auth Required** | No |

**Request Body:**

```json
{
  "code": "string (required)",
  "cartTotal": "number (required)",
  "categoryIds": ["ObjectId (optional)"],
  "productIds": ["ObjectId (optional)"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "coupon": {
    "code": "SUMMER20",
    "discountType": "percentage",
    "discountValue": 20,
    "discount": 15.99,
    "minPurchase": 50,
    "maxDiscount": 25
  }
}
```

**Error Responses:**

| Status | Error |
|---|---|
| 404 | `Invalid coupon code` |
| 400 | `Coupon is not yet active` |
| 400 | `Coupon has expired` |
| 400 | `Coupon usage limit reached` |
| 400 | `Minimum purchase of $X required` |
| 400 | `Coupon not applicable for items in cart` |

---

### 7. Orders

#### POST `/api/orders`

Create a new order (authenticated).

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "items": [
    { "product": "ObjectId", "name": "string", "quantity": "integer", "price": "number", "image": "string" }
  ],
  "shippingAddress": {
    "name": "string",
    "email": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string",
    "phone": "string"
  },
  "paymentMethod": "string (stripe|paypal|cod|bkash|nagad)",
  "paymentIntentId": "string",
  "transactionId": "string",
  "totalAmount": "number",
  "shippingPrice": "number",
  "taxPrice": "number",
  "currency": "string (default: USD)",
  "couponCode": "string",
  "discount": "number"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "order": { ... }
}
```

---

#### GET `/api/orders`

List orders for the current user (or all orders if admin).

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |

**Success Response (200):**

```json
{
  "success": true,
  "orders": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 }
}
```

---

#### POST `/api/orders/guest`

Create a guest order (no authentication required).

| | |
|---|---|
| **Auth Required** | No |

**Request Body:**

```json
{
  "email": "string (required)",
  "items": [
    { "product": "ObjectId", "quantity": "integer", "price": "number" }
  ],
  "shippingAddress": { ... },
  "paymentMethod": "string",
  "paymentIntentId": "string",
  "transactionId": "string",
  "shippingPrice": "number",
  "taxPrice": "number",
  "currency": "string (default: USD)",
  "couponCode": "string",
  "discount": "number"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "order": {
    "_id": "...",
    "orderNumber": "A1B2C3",
    "totalAmount": 149.99,
    "status": "confirmed"
  },
  "guestId": "..."
}
```

**Notes:**
- Validates product stock before creating order.
- Decrements inventory for each item.
- Sends order confirmation email.
- Auto-sets `paymentStatus` to `paid` for Stripe/PayPal.

---

### 8. Search

#### GET `/api/search`

Full-text product search with filters and facets.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `q` | string | `""` | Search query |
| `category` | string | - | Category slug |
| `brand` | string | - | Brand name |
| `minPrice` | float | - | Minimum price |
| `maxPrice` | float | - | Maximum price |
| `rating` | float | - | Minimum rating |
| `inStock` | boolean | - | In-stock only |
| `onSale` | boolean | - | On sale only |
| `color` | string | - | Color filter |
| `size` | string | - | Size filter |
| `tags` | string | - | Comma-separated tags |
| `sortBy` | string | `relevance` | Sort: `relevance`, `price_asc`, `price_desc`, `newest`, `oldest`, `rating`, `popular`, `name_asc`, `name_desc` |
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page (max: 100) |

**Success Response (200):**

```json
{
  "success": true,
  "results": [ ... ],
  "pagination": { "page": 1, "limit": 20, "total": 100, "pages": 5 },
  "filters": {
    "categories": [ ... ],
    "brands": ["Apple", "Samsung"],
    "priceRange": { "minPrice": 9.99, "maxPrice": 999.99 }
  }
}
```

**Notes:** Searches are tracked in `PopularSearch` collection for analytics.

---

#### GET `/api/search/suggestions`

Get autocomplete suggestions for search input.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `q` | string | Search prefix (min 2 chars) |

**Success Response (200):**

```json
{
  "success": true,
  "suggestions": [
    { "type": "product", "text": "iPhone 15", "slug": "iphone-15", "image": "...", "price": 999.99 },
    { "type": "category", "text": "Electronics", "slug": "electronics", "image": "..." },
    { "type": "brand", "text": "Apple", "slug": "apple", "image": "..." },
    { "type": "popular", "text": "iphone case", "count": 1520 }
  ]
}
```

---

#### GET `/api/search/popular`

Get top 10 popular search terms.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=60, stale-while-revalidate=300` |

**Success Response (200):**

```json
{
  "success": true,
  "searches": [
    { "query": "wireless headphones", "count": 1520 },
    { "query": "laptop stand", "count": 980 }
  ]
}
```

---

### 9. User Profile

#### GET `/api/user/profile`

Get current user's full profile.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "...",
    "role": "user",
    "referralCode": "UM-ABC123",
    "loyaltyPoints": 500,
    "preferences": {
      "emailNotifications": true,
      "marketingEmails": false
    },
    "hasPassword": true,
    "bio": "...",
    "location": "...",
    "phoneNumber": "...",
    "website": "...",
    "designation": "...",
    "socialLinks": { "twitter": "...", "linkedin": "..." },
    "addresses": [ ... ],
    "paymentMethods": [ ... ]
  }
}
```

---

#### PUT `/api/user/profile`

Update current user's profile.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "name": "string",
  "image": "string (URL)",
  "bio": "string",
  "location": "string",
  "phoneNumber": "string",
  "website": "string",
  "designation": "string",
  "socialLinks": {
    "twitter": "string",
    "linkedin": "string",
    "github": "string",
    "facebook": "string"
  },
  "addresses": [ ... ],
  "paymentMethods": [ ... ],
  "preferences": {
    "emailNotifications": "boolean",
    "marketingEmails": "boolean",
    "smsNotifications": "boolean",
    "inAppNotifications": "boolean"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "name": "...",
    "email": "...",
    "image": "...",
    "role": "...",
    "preferences": { ... }
  }
}
```

**Notes:** Creates a notification when name or image changes.

---

#### PUT `/api/user/password`

Change current user's password.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "currentPassword": "string (required if user has password)",
  "newPassword": "string (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Notes:** Supports users who signed up via social login (no current password required).

---

#### POST `/api/user/wishlist`

Toggle a product in the user's wishlist.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "productId": "ObjectId (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "action": "added" | "removed",
  "wishlist": ["productId1", "productId2"]
}
```

---

#### GET `/api/user/wishlist`

Get paginated wishlist for the current user.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `12` | Items per page |

**Success Response (200):**

```json
{
  "success": true,
  "wishlist": [ ... ],
  "allIds": ["id1", "id2", "id3"],
  "pagination": { "total": 15, "page": 1, "pages": 2 }
}
```

**Notes:** `allIds` contains all wishlist product IDs (unpaginated) for global check states.

---

#### POST `/api/user/redeem`

Redeem loyalty points for a reward coupon.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "rewardType": "string (required)"
}
```

**Available Reward Types:**

| Reward Type | Points Cost | Value |
|---|---|---|
| `discount-10` | 1,000 | $10 discount (min purchase $50) |
| `free-shipping` | 500 | $15 shipping credit |
| `mystery-box` | 5,000 | $60 coupon |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Reward redeemed successfully!",
  "couponCode": "LOYALTY-ABC123",
  "newPoints": 0
}
```

**Notes:** Creates a one-time-use coupon valid for 30 days.

---

### 10. Notifications

#### GET `/api/notifications`

Get user notifications (last 50).

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | Override target user (admin use) |

**Success Response (200):**

```json
{
  "notifications": [
    {
      "_id": "...",
      "userId": "...",
      "title": "Order Update",
      "message": "Your order #ABC123 has shipped",
      "type": "info" | "success" | "warning" | "error",
      "isRead": false,
      "link": "/profile/orders/...",
      "createdAt": "2026-07-09T12:00:00Z"
    }
  ]
}
```

---

#### PATCH `/api/notifications`

Mark all notifications as read.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{ "success": true }
```

---

#### DELETE `/api/notifications`

Delete a specific notification.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "id": "ObjectId (notification ID)"
}
```

**Success Response (200):**

```json
{ "success": true }
```

---

#### POST `/api/notifications/mark-all-read`

Mark all notifications as read.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Success Response (200):**

```json
{ "success": true }
```

---

#### DELETE `/api/notifications/clear-all`

Delete all notifications for the user.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "userId": "string (optional, admin override)"
}
```

**Success Response (200):**

```json
{ "success": true }
```

---

### 11. Returns

#### GET `/api/returns`

List return requests (user sees own; admin sees all).

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |
| `status` | string | - | Filter by status (admin only) |

**Success Response (200):**

```json
{
  "success": true,
  "returns": [
    {
      "_id": "...",
      "orderId": { "orderNumber": "ABC123", "totalAmount": 149.99 },
      "items": [ ... ],
      "reason": "Wrong size",
      "status": "pending",
      "refundAmount": 29.99,
      "createdAt": "2026-07-09T12:00:00Z"
    }
  ],
  "pagination": { "total": 5, "page": 1, "pages": 1 }
}
```

---

#### POST `/api/returns`

Create a return request.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "orderId": "ObjectId (required)",
  "items": [
    { "product": "ObjectId", "quantity": "integer", "price": "number", "reason": "string" }
  ],
  "reason": "string (required)",
  "description": "string",
  "refundMethod": "string (default: 'original')"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "return": { ... }
}
```

**Notes:**
- Only order owners (or admins) can create returns.
- One active return request per order (cannot duplicate if status is not `rejected` or `cancelled`).

---

### 12. Support Tickets

#### GET `/api/tickets`

List support tickets.

| | |
|---|---|
| **Auth Required** | Yes (session) or email for guests |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page (max: 100) |
| `status` | string | - | Filter by status (admin only) |
| `category` | string | - | Filter by category (admin only) |
| `email` | string | - | Filter by email (guest lookup) |

**Success Response (200):**

```json
{
  "success": true,
  "tickets": [ ... ],
  "pagination": { "page": 1, "limit": 20, "total": 15, "pages": 1 }
}
```

**Notes:**
- Admins see all tickets with optional status/category filters.
- Authenticated users see only their own tickets.
- Unauthenticated users can look up by email.

---

#### POST `/api/tickets`

Create a new support ticket.

| | |
|---|---|
| **Auth Required** | Optional |

**Request Body:**

```json
{
  "email": "string (required)",
  "name": "string (required)",
  "subject": "string (required)",
  "category": "string (required)",
  "message": "string (required)",
  "priority": "string (default: 'medium')"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "ticket": { ... }
}
```

---

### 13. Vendors

#### GET `/api/vendors`

List vendors.

| | |
|---|---|
| **Auth Required** | Conditional |
| **Cache** | `public, max-age=120, stale-while-revalidate=360` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page (max: 100) |
| `status` | string | - | Filter by status (admin only) |
| `slug` | string | - | Lookup by store slug (public, approved only) |

**Success Response (200):**

```json
{
  "success": true,
  "vendors": [
    {
      "_id": "...",
      "storeName": "Tech Store",
      "storeSlug": "tech-store",
      "status": "approved",
      "userId": { "name": "...", "email": "...", "image": "..." },
      ...
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 10, "pages": 1 }
}
```

**Notes:**
- Admins see all vendors, can filter by status.
- Authenticated users see their own vendor profile.
- Public access via `slug` parameter (approved vendors only).

---

#### POST `/api/vendors`

Apply for a vendor account.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "storeName": "string (required)",
  "storeDescription": "string",
  "contactEmail": "string (required)",
  "contactPhone": "string",
  "address": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "vendor": { ..., "status": "pending" }
}
```

**Notes:** One vendor account per user. Store slug is auto-generated.

---

### 14. Settings

#### GET `/api/settings`

Get public site settings.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=300, stale-while-revalidate=600` |

**Success Response (200):**

```json
{
  "success": true,
  "settings": {
    "siteName": "Nexus Store",
    "allowRegistration": true,
    "maintenanceMode": false,
    "currency": "USD",
    "stripeEnabled": true,
    "paypalEnabled": true
  }
}
```

**Notes:** Only returns public-facing settings. Full settings available via admin endpoint.

---

### 15. Admin Panel

All admin endpoints require `admin` role unless otherwise noted.

---

#### GET `/api/admin/activity`

Get user registration activity for the last 7 days.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    { "date": "2026-07-03", "count": 5 },
    { "date": "2026-07-04", "count": 12 },
    { "date": "2026-07-05", "count": 8 }
  ]
}
```

---

#### POST `/api/admin/activity`

Log an admin activity event.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

---

#### GET `/api/admin/analytics`

Get comprehensive analytics dashboard data.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Success Response (200):**

```json
{
  "success": true,
  "stats": {
    "totalRevenue": 886000,
    "totalOrders": 4500,
    "totalUsers": 1200,
    "totalProducts": 350,
    "activeUsers": 980,
    "lowStockCount": 15
  },
  "salesData": [ { "_id": "Jul 01", "revenue": 25000 } ],
  "categoryStats": [ { "_id": "Electronics", "revenue": 400000 } ],
  "topProducts": [ { "totalSold": 1250, "revenue": 187487, "details": { "name": "...", "images": [...] } } ],
  "userEngagement": [ { "_id": "Jul 01", "count": 5 } ],
  "charts": {
    "revenue": [ ... ],
    "status": [ { "name": "delivered", "value": 2000 } ]
  }
}
```

---

#### GET `/api/admin/audit-logs`

Get system audit logs (last 100 entries).

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Success Response (200):**

```json
{
  "success": true,
  "logs": [
    {
      "action": "USER_UPDATE",
      "userId": "...",
      "userEmail": "...",
      "entityType": "USER",
      "entityId": "...",
      "changes": { ... },
      "createdAt": "2026-07-09T12:00:00Z"
    }
  ]
}
```

---

#### GET `/api/admin/brands`

List all brands (including inactive).

| | |
|---|---|
| **Auth Required** | No (public access for filters) |

**Success Response (200):**

```json
{
  "success": true,
  "brands": [ ... ]
}
```

---

#### POST `/api/admin/brands`

Create a new brand.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "name": "string (required)",
  "slug": "string (auto-generated if omitted)",
  "logo": "string (URL)",
  "description": "string",
  "isActive": "boolean"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "brand": { ... }
}
```

---

#### POST `/api/admin/invite`

Send an invitation email to join the platform.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "email": "string (required)",
  "role": "string (default: 'user')",
  "name": "string (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Invitation sent successfully"
}
```

**Notes:**
- Creates a placeholder user and generates a 7-day invite token.
- Invite link: `/accept-invite?token=<token>`

---

#### GET `/api/admin/marketing/banners`

List all banners (public access for homepage).

| | |
|---|---|
| **Auth Required** | No (public for homepage) |

**Success Response (200):**

```json
{
  "success": true,
  "banners": [ ... ]
}
```

---

#### POST `/api/admin/marketing/banners`

Create a new banner.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "image": "string (URL)",
  "link": "string (URL)",
  "type": "string (promotion|announcement)",
  "isActive": "boolean",
  "order": "integer"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "banner": { ... }
}
```

---

#### GET `/api/admin/marketing/coupons`

List all coupons with pagination and search.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |
| `search` | string | - | Search by coupon code |

**Success Response (200):**

```json
{
  "success": true,
  "coupons": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 }
}
```

---

#### POST `/api/admin/marketing/coupons`

Create a new coupon.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "code": "string (required, unique)",
  "discountType": "string (percentage|fixed)",
  "discountValue": "number",
  "maxDiscount": "number",
  "minPurchase": "number",
  "startDate": "ISO date",
  "endDate": "ISO date",
  "usageLimit": "integer",
  "isActive": "boolean",
  "applicableCategories": ["ObjectId"],
  "applicableProducts": ["ObjectId"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "coupon": { ..., "usageCount": 0 }
}
```

---

#### GET `/api/admin/notifications`

Get admin notification feed (mock data).

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "notifications": [ ... ],
    "unreadCount": 3,
    "totalCount": 8
  }
}
```

---

#### POST `/api/admin/notifications`

Create a new admin notification.

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Request Body:**

```json
{
  "type": "string (order|alert|review|payment|system|user|marketing)",
  "title": "string (required)",
  "message": "string (required)",
  "severity": "string (info|warning|error|critical)",
  "link": "string (URL, optional)",
  "user": "object (optional)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": { "id": "notif_123456", ... }
}
```

---

#### DELETE `/api/admin/notifications`

Delete a notification by ID.

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Request Body:**

```json
{
  "id": "string (required)"
}
```

---

#### GET `/api/admin/notifications/templates`

Get email notification templates.

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "tmpl_001",
        "name": "Order Confirmation",
        "type": "order",
        "subject": "Order #{orderNumber} Confirmed",
        "body": "Dear {customerName}...",
        "variables": ["orderNumber", "customerName", "total", "estimatedDelivery"],
        "isActive": true
      }
    ],
    "totalCount": 6,
    "activeCount": 5
  }
}
```

---

#### GET `/api/admin/orders`

List all orders with filtering (admin view).

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |
| `status` | string | - | Filter by order status |
| `keyword` | string | - | Search by order ID, name, or email |

**Success Response (200):**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "user": { "name": "...", "email": "..." },
      "orderStatus": "processing",
      "paymentStatus": "paid",
      "totalAmount": 149.99,
      ...
    }
  ],
  "pagination": { "total": 450, "page": 1, "pages": 45 }
}
```

---

#### PATCH `/api/admin/orders`

Update an order's status, payment status, or tracking.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "orderId": "ObjectId (required)",
  "orderStatus": "string (pending|processing|shipped|delivered|cancelled)",
  "paymentStatus": "string (pending|paid|failed|refunded)",
  "trackingNumber": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "order": { ... }
}
```

**Notes:**
- Logs the update in audit trail.
- Sends in-app notification and email to the customer.

---

#### GET `/api/admin/permissions`

Get the system permission matrix.

| | |
|---|---|
| **Auth Required** | No (static data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "group": "Users",
        "permissions": [
          { "id": "users.view", "name": "View Users", "description": "..." }
        ]
      }
    ],
    "permissions": [ ... ],
    "totalCount": 33
  }
}
```

**Permission Groups:** Users, Orders, Products, Categories, Reviews, Support, Analytics, Reports, Settings, Roles, Marketing.

---

#### GET `/api/admin/reports`

List generated reports and available report types.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "rpt_001",
        "name": "Monthly Sales Summary",
        "type": "sales",
        "format": "pdf",
        "dateRange": { "from": "2026-06-01", "to": "2026-06-30" },
        "status": "completed"
      }
    ],
    "reportTypes": [
      { "value": "sales", "label": "Sales Report" }
    ],
    "totalReports": 7
  }
}
```

---

#### POST `/api/admin/reports`

Queue a new report for generation.

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Request Body:**

```json
{
  "name": "string (required)",
  "type": "string (required, one of: sales|revenue|products|customers|inventory|tax)",
  "dateRange": { "from": "ISO date", "to": "ISO date" },
  "format": "string (default: 'pdf')"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": { "id": "rpt_123", "status": "queued", ... },
  "message": "Report generation queued"
}
```

---

#### GET `/api/admin/revenue`

Get revenue overview with payment method breakdown and forecasts.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 886000,
      "refundedAmount": 31010,
      "netRevenue": 854990,
      "pendingPayouts": 70880,
      "revenueGrowth": 23.5,
      "refundRate": 3.5
    },
    "byPaymentMethod": [ { "method": "stripe", "amount": 425000, "percentage": 48 } ],
    "byPeriod": [ { "month": "Jan", "revenue": 80000, "expenses": 25000, "profit": 55000 } ],
    "forecast": [ { "month": "Aug", "predicted": 135000, "confidence": 88 } ]
  }
}
```

---

#### GET `/api/admin/revenue/forecast`

Get detailed 6-month revenue forecast.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "forecast": [
      {
        "month": "Jul",
        "year": 2026,
        "predicted": 135000,
        "lowerBound": 125000,
        "upperBound": 145000,
        "confidence": 88,
        "contributors": {
          "newCustomers": 47250,
          "returningCustomers": 60750,
          "subscriptions": 27000
        }
      }
    ],
    "summary": {
      "totalPredicted": 840000,
      "averageMonthly": 140000,
      "growthRate": 12.8,
      "seasonalityFactor": 1.15
    }
  }
}
```

---

#### GET `/api/admin/revenue/payments`

Get payment method breakdown with fee analysis.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "method": "stripe",
      "label": "Stripe",
      "amount": 425000,
      "count": 3200,
      "percentage": 48,
      "avgFee": 2.9,
      "feeAmount": 12325,
      "netAmount": 412675,
      "transactions": [ { "type": "visa", "amount": 180000, "count": 1350 } ]
    }
  ]
}
```

---

#### GET `/api/admin/reviews`

List all product reviews with pagination.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |

**Success Response (200):**

```json
{
  "success": true,
  "reviews": [
    {
      "_id": "...",
      "rating": 5,
      "comment": "Great product!",
      "user": "...",
      "createdAt": "2026-07-09T12:00:00Z",
      "productId": "...",
      "productName": "Product Name"
    }
  ],
  "pagination": { "total": 150, "page": 1, "pages": 15 }
}
```

---

#### DELETE `/api/admin/reviews`

Delete a product review.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "reviewId": "ObjectId (required)",
  "productId": "ObjectId (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Notes:** Automatically recalculates the product's average rating and review count.

---

#### GET `/api/admin/roles`

List all system and custom roles.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role_admin",
        "name": "Administrator",
        "slug": "admin",
        "description": "Full access to all system features",
        "isSystem": true,
        "userCount": 3,
        "permissions": ["users.manage", "orders.manage", ...]
      }
    ],
    "totalCount": 6
  }
}
```

---

#### POST `/api/admin/roles`

Create a custom role.

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Request Body:**

```json
{
  "name": "string (required)",
  "slug": "string (required, unique)",
  "description": "string",
  "permissions": ["string (permission IDs)"]
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": { "id": "role_custom", "isSystem": false, "userCount": 0, ... }
}
```

---

#### PATCH `/api/admin/roles`

Update a role's name, description, or permissions.

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Request Body:**

```json
{
  "id": "string (required)",
  "name": "string",
  "description": "string",
  "permissions": ["string"]
}
```

---

#### DELETE `/api/admin/roles`

Delete a custom role (system roles cannot be deleted).

| | |
|---|---|
| **Auth Required** | No (mock endpoint) |

**Request Body:**

```json
{
  "id": "string (required)"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "error": "System roles cannot be deleted"
}
```

---

#### GET `/api/admin/sales`

Get sales analytics with configurable time range.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `days` | integer | `30` | Number of days to analyze (1-90) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSales": 350000,
      "totalOrders": 1500,
      "totalCustomers": 1000,
      "avgOrderValue": 233,
      "conversionRate": 3.85,
      "salesGrowth": 15.2,
      "ordersGrowth": 12.0,
      "aovGrowth": 3.1,
      "conversionGrowth": 2.5
    },
    "byDay": [ { "date": "2026-07-01", "revenue": 12000, "orders": 55, "customers": 35 } ],
    "byProduct": [ { "name": "...", "revenue": 187487, "quantity": 1250 } ],
    "byCategory": [ { "name": "Electronics", "revenue": 147000, "percentage": 42, "growth": 18.5 } ]
  }
}
```

---

#### GET `/api/admin/sales/categories`

Get sales breakdown by category.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "cat_01",
      "name": "Electronics",
      "revenue": 584000,
      "orders": 4200,
      "percentage": 42,
      "growth": 18.5,
      "products": 156,
      "trending": true
    }
  ]
}
```

---

#### GET `/api/admin/sales/products`

Get top selling products.

| | |
|---|---|
| **Auth Required** | No (mock data) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "prod_1001",
      "name": "Wireless Bluetooth Headphones",
      "price": 149.99,
      "quantity": 1250,
      "revenue": 187487,
      "category": "Electronics",
      "growth": 24.5,
      "rank": 1
    }
  ]
}
```

---

#### GET `/api/admin/settings`

Get full system settings.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Success Response (200):**

```json
{
  "success": true,
  "settings": {
    "siteName": "Nexus Store",
    "contactEmail": "admin@nexus.com",
    "allowRegistration": true,
    "maintenanceMode": false,
    "currency": "USD",
    "stripeEnabled": true,
    "paypalEnabled": true,
    "googleAnalyticsId": "G-...",
    "updatedBy": "..."
  }
}
```

---

#### POST `/api/admin/settings`

Update system settings.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "siteName": "string (required)",
  "contactEmail": "string (valid email, required)",
  "allowRegistration": "boolean (required)",
  "currency": "string",
  "stripeEnabled": "boolean",
  "paypalEnabled": "boolean",
  "googleAnalyticsId": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "settings": { ... }
}
```

**Notes:** Logs the update in audit trail.

---

#### GET `/api/admin/system-health`

Get system health status.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Success Response (200):**

```json
{
  "success": true,
  "health": {
    "database": "Healthy",
    "redis": "Healthy",
    "system": {
      "platform": "win32",
      "cpuUsage": "2.50%",
      "totalMemory": "16.00 GB",
      "freeMemory": "8.50 GB",
      "uptime": "72.50 hours"
    }
  }
}
```

---

#### GET `/api/admin/users`

List all users with pagination.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page (max: 100) |

**Success Response (200):**

```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1200, "pages": 60 }
}
```

---

#### PATCH `/api/admin/users`

Update a user's details (admin).

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "userId": "ObjectId (required)",
  "role": "string (user|admin|vendor)",
  "status": "string (active|banned)",
  "name": "string (2-50 chars)",
  "bio": "string (max 200 chars)",
  "location": "string",
  "phoneNumber": "string",
  "website": "string",
  "designation": "string",
  "socialLinks": {
    "twitter": "string",
    "linkedin": "string",
    "github": "string",
    "facebook": "string"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "user": { ... }
}
```

**Notes:**
- Admins cannot modify their own role or status.
- Logs the update in audit trail.

---

#### DELETE `/api/admin/users`

Delete a user account.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "userId": "ObjectId (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Notes:** Admins cannot delete their own account.

---

### 16. Content & Miscellaneous

#### POST `/api/contact`

Submit a contact form message.

| | |
|---|---|
| **Auth Required** | No |

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required)",
  "subject": "string (required)",
  "message": "string (required)",
  "userId": "ObjectId (optional, for logged-in users)"
}
```

**Success Response (201):**

```json
{
  "message": "Message sent successfully",
  "data": { ... }
}
```

---

#### GET `/api/contact`

List all contact messages (admin only).

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Success Response (200):**

```json
[ ... ]
```

**Notes:** Returns a raw array (not wrapped in standard response format).

---

#### DELETE `/api/contact`

Delete a contact message.

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Message MongoDB ObjectId |

**Success Response (200):**

```json
{ "message": "Message deleted" }
```

---

#### GET `/api/faqs`

List published FAQs grouped by category.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=300, stale-while-revalidate=600` |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Filter by category name |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "category": "Shipping",
      "slug": "shipping",
      "icon": "Truck",
      "description": "Shipping related questions",
      "faqs": [
        { "question": "How long does shipping take?", "answer": "...", "order": 1 }
      ]
    }
  ]
}
```

---

#### POST `/api/faqs`

Create a new FAQ (admin only).

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "question": "string (required)",
  "answer": "string (required)",
  "category": "string (required)",
  "order": "integer (default: 0)"
}
```

---

#### GET `/api/gift-cards`

List gift cards.

| | |
|---|---|
| **Auth Required** | No |
| **Cache** | `public, max-age=60, stale-while-revalidate=300` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page |
| `userId` | string | - | Filter by purchaser |

**Success Response (200):**

```json
{
  "success": true,
  "giftCards": [ ... ],
  "pagination": { "total": 20, "page": 1, "pages": 1 }
}
```

---

#### POST `/api/gift-cards`

Create a new gift card (admin only).

| | |
|---|---|
| **Auth Required** | Yes (`admin`) |

**Request Body:**

```json
{
  "amount": "number (min: 1, required)",
  "recipientName": "string",
  "recipientEmail": "string",
  "senderName": "string",
  "senderEmail": "string",
  "message": "string",
  "currency": "string (default: 'USD')",
  "expiresInDays": "integer (default: 365)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "giftCard": {
    "code": "ABCD-1234-EFGH",
    "amount": 50,
    "remainingBalance": 50,
    ...
  }
}
```

**Notes:** Gift card code is a unique 12-character code in `XXXX-XXXX-XXXX` format.

---

#### POST `/api/upload`

Upload a file (image).

| | |
|---|---|
| **Auth Required** | Yes (`admin` or `vendor`) |

**Request Body:** `multipart/form-data` with `file` field.

**Success Response (200):**

```json
{
  "success": true,
  "url": "/uploads/1689000000000-image.jpg"
}
```

**Notes:**
- File is saved to `public/uploads/` with timestamp prefix for uniqueness.
- File type and size validation is applied via `validateUpload()`.
- Filename is sanitized via `sanitizeFilename()`.

---

#### GET `/api/payouts`

List payout records.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `vendorId` | string | Filter by vendor (admin only) |

**Success Response (200):**

```json
{
  "success": true,
  "payouts": [
    {
      "_id": "...",
      "vendorId": { "storeName": "Tech Store" },
      "amount": 500,
      "paymentMethod": "bank_transfer",
      "status": "pending",
      "requestedAt": "2026-07-09T12:00:00Z"
    }
  ]
}
```

**Notes:**
- Admins can view all payouts or filter by vendor.
- Vendors see only their own payouts.

---

#### POST `/api/payouts`

Request a payout (vendor only).

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "amount": "number (required, > 0)",
  "paymentMethod": "string (default: 'bank_transfer')"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "payout": { ... }
}
```

**Notes:**
- Vendor must be `approved`.
- Amount cannot exceed `commissionBalance`.

---

#### GET `/api/price-alerts`

List price alerts.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `productId` | string | Filter by product |
| `email` | string | Filter by email |

**Success Response (200):**

```json
{
  "success": true,
  "alerts": [ ... ]
}
```

---

#### POST `/api/price-alerts`

Create a price alert for a product.

| | |
|---|---|
| **Auth Required** | No |

**Request Body:**

```json
{
  "productId": "string (required)",
  "email": "string (required)",
  "productName": "string (required)",
  "currentPrice": "number"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Price alert created",
  "alert": { ... }
}
```

**Notes:** One alert per product-email combination.

---

#### DELETE `/api/price-alerts`

Remove a price alert.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `productId` | string | Required |
| `email` | string | Required |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Price alert removed"
}
```

---

#### GET `/api/stock-alerts`

List back-in-stock alerts.

| | |
|---|---|
| **Auth Required** | Yes (session); admin sees all |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `type` | string | Filter by alert type |
| `productId` | string | Filter by product |

**Success Response (200):**

```json
{
  "success": true,
  "alerts": [ ... ]
}
```

---

#### POST `/api/stock-alerts`

Subscribe to a back-in-stock alert.

| | |
|---|---|
| **Auth Required** | No |

**Request Body:**

```json
{
  "productId": "string (required)",
  "email": "string (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "alert": { ... }
}
```

**Notes:** Product must have stock <= 5 to subscribe. One alert per product-email combination.

---

#### DELETE `/api/stock-alerts`

Unsubscribe from a stock alert.

| | |
|---|---|
| **Auth Required** | No |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `productId` | string | Required |
| `email` | string | Required |

---

#### GET `/api/abandoned-carts`

List abandoned carts.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `status` | string | Filter by status |
| `userId` | string | Filter by user |

**Success Response (200):**

```json
[ ... ]
```

**Notes:** Returns a raw array (not wrapped in standard response format).

---

#### POST `/api/abandoned-carts`

Save an abandoned cart.

| | |
|---|---|
| **Auth Required** | Yes (session) |

**Request Body:**

```json
{
  "userId": "string",
  "email": "string",
  "items": [ { "productId": "ObjectId", "quantity": "integer", "price": "number" } ],
  "totalAmount": "number"
}
```

**Success Response (201):**

```json
{ ... }
```

**Notes:** Cart expires in 7 days.

---

#### GET `/api/health`

Health check endpoint.

| | |
|---|---|
| **Auth Required** | No |

**Success Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2026-07-09T12:00:00.000Z",
  "uptime": 86400.5
}
```

---

## Appendix: HTTP Methods Summary

| Method | Purpose | Request Body |
|---|---|---|
| `GET` | Read resource(s) | No |
| `POST` | Create resource | Yes |
| `PATCH` | Partial update | Yes |
| `PUT` | Full update | Yes |
| `DELETE` | Remove resource | Yes (or query params) |

---

## Appendix: CORS & Headers

All API responses include standard headers:

```
Content-Type: application/json
X-Powered-By: Next.js
```

Cached endpoints include:

```
Cache-Control: public, max-age=<seconds>, stale-while-revalidate=<seconds>
```

Rate-limited endpoints may include:

```
X-RateLimit-Remaining: <count>
```

---

## Appendix: Environment Variables Required

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | Application URL |
| `NEXTAUTH_SECRET` | NextAuth encryption key |
| `STRIPE_SECRET_KEY` | Stripe payment processing |
| `PAYPAL_CLIENT_ID` | PayPal integration |
| `PAYPAL_CLIENT_SECRET` | PayPal integration |
| `UPSTASH_REDIS_REST_URL` | Redis for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Redis authentication |
| `NEXT_PUBLIC_APP_URL` | Client-facing URL |

---

*End of API Documentation*
