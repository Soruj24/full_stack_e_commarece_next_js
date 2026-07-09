# Nexus E-Commerce — Database Documentation

> **Platform:** MongoDB 7.x + Mongoose ODM  
> **Models:** 26 collections  
> **Last updated:** 2026-07-09  
> **Audience:** Enterprise Database Administrators

---

## Table of Contents

1. [Entity-Relationship Diagram](#1-entity-relationship-diagram)
2. [Collection Reference](#2-collection-reference)
3. [Relationships Map](#3-relationships-map)
4. [Index Summary](#4-index-summary)
5. [Indexing Strategy Notes](#5-indexing-strategy-notes)
6. [Data Lifecycle & TTL Indexes](#6-data-lifecycle--ttl-indexes)
7. [Cascading Deletes & Referential Integrity](#7-cascading-deletes--referential-integrity)
8. [Migration Strategy](#8-migration-strategy)

---

## 1. Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                         │
│  ┌──────────┐  = Collection    ─── 1:1    ─── 1:N    ─── M:N              │
│  │  Model   │                                                              │
│  └──────────┘                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


                ┌──────────────┐
                │   Settings   │  (singleton — site-wide config)
                └──────────────┘


  ┌──────────────┐      1:N      ┌──────────────┐      1:N      ┌──────────────┐
  │  FaqCategory  │◄──────────────│     Faq      │              │  AuditLog    │────┐
  └──────────────┘               └──────────────┘              └──────────────┘    │
                                                                                    │
  ┌──────────────┐      1:N      ┌──────────────┐                                 │
  │    Brand     │◄──────────────│   Product    │──────────────────────────────────│
  └──────────────┘               └──────────────┘                                  │
        │                              │    │                                      │
        │                              │    │      1:N                             │
        │                              │    └──────────────────┐                   │
        │                              │                       ▼                   │
        │                              │              ┌──────────────┐            │
        │                              │              │ PriceHistory │            │
        │                              │              └──────────────┘            │
        │                              │                                          │
        │                     ┌────────┼────────┐          ┌──────────────┐       │
        │                     │        │        │          │ StockAlert   │       │
        │                     ▼        ▼        ▼          └──────────────┘       │
        │              ┌──────────┐ ┌────────┐ ┌────────┐      │                  │
        │              │  Bundle  │ │ Coupon │ │  Cart  │      │                  │
        │              └──────────┘ └────────┘ └────────┘      │                  │
        │                                                     │                  │
        │                                                     ▼                  │
        │              ┌──────────────┐                ┌──────────────┐          │
        │              │  Category    │◄───────────────│  Abandoned   │          │
        │              │  (self-ref)  │                │    Cart      │          │
        │              └──────────────┘                └──────────────┘          │
        │                    │                                                    │
        │                    │ 1:N (parent/children)                              │
        │                    ▼                                                    │
        │              ┌──────────────┐                                          │
        │              │   Product    │  (category field)                         │
        │              └──────────────┘                                          │
        │                                                                        │
        │              ┌──────────────┐                                          │
        │              │    User      │──── 1:N ───► Order                       │
        │              │              │──── 1:N ───► Return                      │
        │              │              │──── 1:N ───► Notification                │
        │              │              │──── 1:N ───► LoginHistory                │
        │              │              │──── 1:N ───► Session                     │
        │              │              │──── 1:N ───► Token                       │
        │              │              │──── 1:N ───► AuditLog                    │
        │              │              │──── 1:N ───► SupportTicket               │
        │              │              │──── 1:N ───► ContactMessage              │
        │              │              │──── 1:N ───► GiftCard (purchasedBy)      │
        │              │              │──── 1:N ───► StockAlert                  │
        │              │              │──── M:N ───► Product (wishlist)          │
        │              │              │     1:1 ───► Vendor (userId)            │
        │              │              │──── 1:N ───► AbandonedCart               │
        │              │              └──────────────┘                          │
        │              │                    │                                    │
        │              │                    │ 1:N                                │
        │              │                    ▼                                    │
        │              │              ┌──────────────┐                          │
        │              │              │    Order     │                          │
        │              │              │  (items →    │                          │
        │              │              │   Product)   │                          │
        │              │              └──────────────┘                          │
        │              │                    │  1:N                               │
        │              │                    ▼                                    │
        │              │              ┌──────────────┐                          │
        │              │              │    Return    │                          │
        │              │              └──────────────┘                          │
        │              │                                                         │
        │              │                   1:1                                   │
        │              │              ┌──────────────┐                          │
        │              │              │   Vendor    │                          │
        │              │              └──────────────┘                          │
        │              │                    │  1:N                               │
        │              │                    ▼                                    │
        │              │              ┌──────────────┐                          │
        │              │              │   Payout    │                          │
        │              │              └──────────────┘                          │
        │              │                                                         │
        │              └─────────────────────────────────────────────────────────┘
        │
        │
  ┌──────────────┐
  │  PopularSearch│
  └──────────────┘

  ┌──────────────┐
  │   GiftCard   │
  └──────────────┘

  ┌──────────────┐
  │    Banner    │
  └──────────────┘
```

---

## 2. Collection Reference

### 2.1 User — `users`

| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique user identifier |
| `name` | `String` | required, trim, min 2, max 50 | Display name |
| `email` | `String` | required, unique, lowercase, trim, regex | Login email |
| `password` | `String` | min 8 (optional for OAuth) | BCrypt hashed password |
| `role` | `String` | enum: user/admin/vendor, default: user | Authorization role |
| `status` | `String` | enum: active/banned, default: active | Account status |
| `isVerified` | `Boolean` | default: false | Email verified flag |
| `verificationToken` | `String` | — | Email verification token |
| `verificationTokenExpires` | `Date` | — | Token expiry |
| `verificationOTP` | `String` | — | OTP for verification |
| `verificationOTPExpires` | `Date` | — | OTP expiry |
| `resetPasswordToken` | `String` | select: true | Password reset token |
| `resetPasswordExpires` | `Date` | select: true | Reset token expiry |
| `refreshToken` | `String` | select: false | JWT refresh token |
| `twoFactorSecret` | `String` | select: false | TOTP secret |
| `twoFactorEnabled` | `Boolean` | default: false | 2FA enabled flag |
| `image` | `String` | — | Avatar URL |
| `phoneNumber` | `String` | — | Contact phone |
| `bio` | `String` | max 200 | Short biography |
| `location` | `String` | — | User location (free text) |
| `website` | `String` | — | Personal website |
| `designation` | `String` | — | Job title/role |
| `socialLinks` | `Object` | twitter/linkedin/github/facebook | Social profile URLs |
| `lastLogin` | `Date` | — | Last successful login |
| `lastLoginIP` | `String` | — | IP from last login |
| `loginAttempts` | `Number` | required, default: 0 | Failed login counter |
| `lockUntil` | `Date` | — | Account lockout expiry |
| `invitedBy` | `ObjectId` | ref: User | User who sent invite |
| `referredBy` | `ObjectId` | ref: User | Referrer user |
| `referralCode` | `String` | unique, sparse | Unique referral code |
| `loyaltyPoints` | `Number` | default: 0 | Accumulated points |
| `membershipTier` | `String` | enum: bronze/silver/gold/platinum, default: bronze | Tier level |
| `preferences` | `Object` | — | Notification preferences |
| `addresses` | `[SubDoc]` | — | Billing/shipping addresses |
| `paymentMethods` | `[SubDoc]` | — | Saved payment methods |
| `wishlist` | `[ObjectId]` | ref: Product | Wishlist products |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Addresses sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `type` | `String` | enum: billing/shipping | Address purpose |
| `street` | `String` | — | Street address |
| `city` | `String` | — | City |
| `state` | `String` | — | State/Province |
| `zipCode` | `String` | — | Postal code |
| `country` | `String` | — | Country |
| `isDefault` | `Boolean` | default: false | Default address flag |

**Payment methods sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `provider` | `String` | enum: stripe/paypal | Payment provider |
| `last4` | `String` | — | Last 4 card digits |
| `brand` | `String` | — | Card brand (Visa, MC) |
| `isDefault` | `Boolean` | default: false | Default method flag |

**Preferences sub-document:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `emailNotifications` | `Boolean` | true | Email notification opt-in |
| `marketingEmails` | `Boolean` | false | Marketing email opt-in |
| `smsNotifications` | `Boolean` | true | SMS notification opt-in |
| `inAppNotifications` | `Boolean` | true | In-app notification opt-in |

**Indexes:**
- `{ email: 1 }` — unique — login lookup
- `{ referralCode: 1 }` — unique, sparse — referral system
- `{ resetPasswordToken: 1 }` — partial (where resetPasswordExpires exists), TTL 3600s — auto-clean expired reset tokens
- `{ role: 1 }` — RBAC queries
- `{ status: 1 }` — account status queries
- `{ createdAt: -1 }` — recent user queries
- `{ loyaltyPoints: -1 }` — loyalty leaderboards
- `{ membershipTier: 1 }` — tier-based segmentation

**Relationships:** `wishlist` → Product (M:N), `invitedBy` → User (1:1), `referredBy` → User (1:1)

---

### 2.2 Product — `products`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique product identifier |
| `name` | `String` | required | Product title |
| `slug` | `String` | required, unique, lowercase | URL-friendly identifier |
| `description` | `String` | required | Product description (rich text) |
| `price` | `Number` | required, min: 0 | Base price |
| `discountPrice` | `Number` | min: 0 | Sale price (if applicable) |
| `discountEndDate` | `Date` | — | Sale end date |
| `images` | `[String]` | — | Product image URLs |
| `imageGallery` | `[SubDoc]` | — | Gallery with alt text, order, isPrimary |
| `videoUrl` | `String` | — | Product video URL |
| `videoType` | `String` | enum: youtube/vimeo | Video platform |
| `category` | `ObjectId` | required, ref: Category | Assigned category |
| `brand` | `String` | — | Brand name (legacy/denormalized) |
| `brandRef` | `ObjectId` | ref: Brand | Brand reference (normalized) |
| `tags` | `[String]` | — | Search/filter tags |
| `variants` | `[SubDoc]` | — | SKU variants (see below) |
| `colors` | `[String]` | auto-derived from variants | Available colors |
| `sizes` | `[String]` | auto-derived from variants | Available sizes |
| `stock` | `Number` | required, default: 0, min: 0 | Total stock (auto-summed) |
| `sku` | `String` | — | Primary SKU (first variant's) |
| `lowStockThreshold` | `Number` | default: 10 | Alert threshold |
| `inventoryTracking` | `Boolean` | default: true | Enable stock tracking |
| `relatedProducts` | `[ObjectId]` | ref: Product | Manually related products |
| `frequentlyBoughtTogether` | `[ObjectId]` | ref: Product | Cross-sell products |
| `specifications` | `[SubDoc]` | — | Key-value specs with optional group |
| `weight` | `Number` | min: 0 | Physical weight |
| `weightUnit` | `String` | enum: kg/lb/g/oz, default: kg | Weight unit |
| `dimensions` | `SubDoc` | — | length, width, height, unit (cm/in) |
| `taxClass` | `String` | — | Tax category |
| `isTaxable` | `Boolean` | default: true | Tax applicability |
| `warranty` | `String` | — | Warranty description |
| `metaTitle` | `String` | max 70 | SEO title |
| `metaDescription` | `String` | max 160 | SEO description |
| `canonicalUrl` | `String` | — | SEO canonical URL |
| `ogImage` | `String` | — | Open Graph image |
| `isFeatured` | `Boolean` | default: false | Featured product flag |
| `isActive` | `Boolean` | default: true | Published status |
| `isArchived` | `Boolean` | default: false | Archived (soft-delete) |
| `shippingOptions` | `[SubDoc]` | — | method, price, estimatedDays |
| `rating` | `Number` | default: 0, min: 0, max: 5 | Average rating |
| `numReviews` | `Number` | default: 0 | Review count |
| `reviews` | `[SubDoc]` | — | Embedded reviews (see below) |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Variants sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | `String` | required | Variant name (e.g. "Red / Large") |
| `sku` | `String` | required | Unique SKU for variant |
| `barcode` | `String` | — | UPC/EAN barcode |
| `color` | `String` | — | Color name |
| `colorCode` | `String` | — | Hex color code |
| `size` | `String` | — | Size value |
| `price` | `Number` | required | Variant-specific price |
| `stock` | `Number` | required, default: 0, min: 0 | Variant stock level |
| `images` | `[String]` | — | Variant-specific images |
| `isActive` | `Boolean` | default: true | Variant enabled |

**Reviews sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `user` | `ObjectId` | required, ref: User | Review author |
| `name` | `String` | required | Author display name |
| `rating` | `Number` | required | 1–5 rating |
| `comment` | `String` | required | Review text |
| `isVerified` | `Boolean` | default: false | Verified purchase badge |
| `createdAt` | `Date` | default: Date.now | Review timestamp |

**Virtuals:**

| Virtual | Type | Description |
|---------|------|-------------|
| `onSale` | `Boolean` | `true` when discountPrice < price and not expired |
| `stockStatus` | `String` | `out_of_stock` / `low_stock` / `in_stock` |
| `discountPercentage` | `Number` | Computed discount % (0–100) |

**Pre-save hook:** Auto-derives `colors`, `sizes`, `stock` from active variants; sets `sku` from first variant.

**Indexes:**

| Index | Options | Purpose |
|-------|---------|---------|
| `{ slug: 1 }` | unique | URL lookups |
| `{ category: 1, isActive: 1 }` | — | Category browsing |
| `{ brand: 1 }` | — | Brand filtering |
| `{ brandRef: 1 }` | — | Brand reference queries |
| `{ price: 1 }` | — | Price sorting/filtering |
| `{ isFeatured: 1, isActive: 1 }` | — | Featured products |
| `{ isActive: 1, isArchived: 1 }` | — | Active/archived filtering |
| `{ rating: -1 }` | — | Top-rated sorting |
| `{ createdAt: -1 }` | — | Newest products |
| `{ "variants.sku": 1 }` | — | SKU lookup |
| `{ relatedProducts: 1 }` | — | Related products queries |
| `{ frequentlyBoughtTogether: 1 }` | — | Cross-sell queries |
| `{ tags: 1 }` | — | Tag-based filtering |
| `{ name: "text", description: "text", brand: "text", tags: "text" }` | weights: name:10, brand:8, tags:5, desc:3 | Full-text search |
| Compound: `{ isActive:1, isArchived:1, price:1 }` | — | Filtered price queries |
| Compound: `{ isActive:1, isArchived:1, category:1, price:1 }` | — | Category + price filter |
| Compound: `{ isActive:1, isArchived:1, rating:-1 }` | — | Filtered rating sort |
| Compound: `{ isActive:1, isArchived:1, stock:1 }` | — | Stock filtering |
| Compound: `{ isActive:1, isArchived:1, discountPrice:1 }` | — | Sale products |
| Compound: `{ isActive:1, isArchived:1, brand:1 }` | — | Filtered brand queries |
| Compound: `{ isActive:1, isArchived:1, createdAt:-1 }` | — | Filtered newest |
| Compound: `{ isActive:1, isArchived:1, colors:1 }` | — | Color filter |
| Compound: `{ isActive:1, isArchived:1, sizes:1 }` | — | Size filter |

**Relationships:** `category` → Category (1:1), `brandRef` → Brand (1:1), `relatedProducts` → Product (M:N), `frequentlyBoughtTogether` → Product (M:N), `reviews.user` → User (1:1)

---

### 2.3 Order — `orders`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique order identifier |
| `user` | `ObjectId` | ref: User, optional | Ordering user (null for guest) |
| `items` | `[SubDoc]` | — | Order line items (see below) |
| `shippingAddress` | `Object` | required | street, city, state, zipCode, country |
| `currency` | `String` | required, default: USD | Transaction currency |
| `paymentMethod` | `String` | required | Method identifier |
| `paymentStatus` | `String` | enum: pending/paid/failed/refunded | Payment lifecycle |
| `orderStatus` | `String` | enum: processing/shipped/delivered/cancelled/returned | Order lifecycle |
| `totalAmount` | `Number` | required, default: 0.0 | Grand total |
| `shippingPrice` | `Number` | required, default: 0.0 | Shipping cost |
| `taxPrice` | `Number` | required, default: 0.0 | Tax amount |
| `paymentIntentId` | `String` | — | Stripe PaymentIntent ID |
| `transactionId` | `String` | — | External transaction ID |
| `paymentPhoneNumber` | `String` | — | Mobile money phone |
| `shippingCarrier` | `String` | — | Carrier name |
| `shippingService` | `String` | — | Service level |
| `trackingNumber` | `String` | — | Shipment tracking |
| `deliveredAt` | `Date` | — | Delivery timestamp |
| `cancelledAt` | `Date` | — | Cancellation timestamp |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Order items sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `product` | `ObjectId` | required, ref: Product | Product reference |
| `name` | `String` | required | Snapshot of product name |
| `quantity` | `Number` | required | Quantity ordered |
| `price` | `Number` | required | Unit price at time of order |
| `image` | `String` | required | Product image snapshot |

**Indexes:**
- `{ user: 1 }` — user order history
- `{ paymentStatus: 1 }` — payment processing queries
- `{ orderStatus: 1 }` — fulfillment queries
- `{ createdAt: -1 }` — recent orders / date range
- `{ "items.product": 1 }` — product sales analysis

**Relationships:** `user` → User (1:1), `items.product` → Product (1:1)

---

### 2.4 Category — `categories`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique category identifier |
| `name` | `String` | required | Category display name |
| `slug` | `String` | required, unique, lowercase | URL slug |
| `description` | `String` | — | Category description |
| `image` | `String` | — | Category image URL |
| `icon` | `String` | — | Icon identifier (e.g., Font Awesome) |
| `parent` | `ObjectId` | ref: Category, default: null | Parent category (self-referencing) |
| `isFeatured` | `Boolean` | default: false | Featured category flag |
| `isActive` | `Boolean` | default: true | Visibility flag |
| `order` | `Number` | default: 0 | Sort order |
| `metaTitle` | `String` | max 70 | SEO title |
| `metaDescription` | `String` | max 160 | SEO description |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Virtuals:**

| Virtual | Type | Description |
|---------|------|-------------|
| `productCount` | `Number` (count) | Count of active, non-archived products in this category |
| `children` | `[Category]` | Child categories, sorted by order |
| `parentChain` | `[Category]` | Ancestor chain (computed at runtime) |

**Indexes:**
- `{ slug: 1 }` — unique
- `{ order: 1 }` — sort order queries
- `{ parent: 1 }` — hierarchy traversal
- `{ isFeatured: 1 }` — featured categories
- `{ isActive: 1 }` — active filtering
- `{ name: "text", description: "text" }` — text search

**Relationships:** `parent` → Category (self-referencing, 1:1)

**Key methods:** `getCategoryTree()` — builds tree from flat list; `getSubcategories()` — recursive child lookup; `getCategoryPath()` — ancestor chain.

---

### 2.5 Coupon — `coupons`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique coupon identifier |
| `code` | `String` | required, unique, uppercase, trim | Coupon code |
| `discountType` | `String` | enum: percentage/fixed | Discount calculation type |
| `discountValue` | `Number` | required, min: 0 | Value (percentage amount or fixed) |
| `minPurchase` | `Number` | default: 0 | Minimum cart total required |
| `maxDiscount` | `Number` | — | Cap on percentage discount |
| `startDate` | `Date` | required | Validity start |
| `endDate` | `Date` | required | Validity end |
| `usageLimit` | `Number` | — | Max times redeemable (global) |
| `usageCount` | `Number` | default: 0 | Times redeemed |
| `isActive` | `Boolean` | default: true | Toggle on/off |
| `applicableCategories` | `[ObjectId]` | ref: Category | Restrict to categories |
| `applicableProducts` | `[ObjectId]` | ref: Product | Restrict to products |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ code: 1 }` — unique — lookup by code
- `{ isActive: 1 }` — active coupon queries
- `{ startDate: 1, endDate: 1 }` — date-range validity checks

**Relationships:** `applicableCategories` → Category (M:N), `applicableProducts` → Product (M:N)

---

### 2.6 Bundle — `bundles`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique bundle identifier |
| `name` | `String` | required | Bundle name |
| `slug` | `String` | required, unique | URL slug |
| `description` | `String` | required | Bundle description |
| `products` | `[SubDoc]` | required | Contained products (see below) |
| `originalPrice` | `Number` | required | Sum of individual prices |
| `bundlePrice` | `Number` | required | Discounted bundle price |
| `discount` | `Number` | required | Absolute discount amount |
| `discountPercentage` | `Number` | required | Discount percentage |
| `stock` | `Number` | required, default: 100 | Bundle stock level |
| `images` | `[String]` | — | Bundle images |
| `category` | `ObjectId` | required, ref: Category | Bundle category |
| `brand` | `String` | — | Brand name (denormalized) |
| `isActive` | `Boolean` | default: true | Visibility flag |
| `validFrom` | `Date` | default: Date.now | Sale start date |
| `validUntil` | `Date` | — | Sale end date |
| `maxQuantityPerOrder` | `Number` | default: 10 | Purchase limit |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Bundle products sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `product` | `ObjectId` | required, ref: Product | Product reference |
| `name` | `String` | required | Snapshot of product name |
| `price` | `Number` | required | Snapshot of product price |
| `image` | `String` | required | Snapshot of product image |
| `quantity` | `Number` | required, default: 1 | Quantity included |

**Indexes:**
- `{ slug: 1 }` — unique
- `{ isActive: 1, validFrom: 1, validUntil: 1 }` — active bundle queries
- `{ category: 1 }` — category filtering

**Relationships:** `products.product` → Product (1:1), `category` → Category (1:1)

---

### 2.7 Brand — `brands`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique brand identifier |
| `name` | `String` | required, unique | Brand name |
| `slug` | `String` | required, unique, lowercase | URL slug |
| `description` | `String` | — | Brand description |
| `logo` | `String` | — | Logo image URL |
| `website` | `String` | — | Official website URL |
| `isActive` | `Boolean` | default: true | Visibility flag |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Virtuals:**

| Virtual | Type | Description |
|---------|------|-------------|
| `productCount` | `Number` (count) | Count of active non-archived products referencing this brand |

**Indexes:**
- `{ name: 1 }` — unique
- `{ slug: 1 }` — unique
- `{ isActive: 1 }` — active filtering
- `{ name: "text", description: "text" }` — text search

**Relationships:** Referenced by Product.brandRef (1:N). Virtual productCount uses the `Product.brandRef` foreign field.

---

### 2.8 Banner — `banners`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique banner identifier |
| `title` | `String` | required | Banner heading text |
| `subtitle` | `String` | — | Banner secondary text |
| `image` | `String` | required | Background/image URL |
| `link` | `String` | — | Click-through URL |
| `type` | `String` | enum: promotion/announcement/hero, default: promotion | Banner type |
| `isActive` | `Boolean` | default: true | Visibility flag |
| `startDate` | `Date` | — | Scheduled start |
| `endDate` | `Date` | — | Scheduled end |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ isActive: 1 }` — active banner queries
- `{ type: 1 }` — type-based filtering

**Relationships:** None (standalone collection)

---

### 2.9 GiftCard — `giftcards`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique gift card identifier |
| `code` | `String` | required, unique, uppercase | Redemption code |
| `amount` | `Number` | required, min: 1 | Original value |
| `remainingBalance` | `Number` | required, min: 0 | Spendable balance |
| `currency` | `String` | default: USD | Currency |
| `purchasedBy` | `ObjectId` | ref: User | Buyer |
| `purchasedAt` | `Date` | — | Purchase timestamp |
| `recipientName` | `String` | — | Recipient name |
| `recipientEmail` | `String` | — | Recipient email |
| `senderName` | `String` | required | Sender name |
| `senderEmail` | `String` | required | Sender email |
| `message` | `String` | max 500 | Personal message |
| `isActive` | `Boolean` | default: true | Active/inactive flag |
| `expiresAt` | `Date` | required | Expiry date |
| `usedBy` | `[ObjectId]` | ref: User | Users who used this card |
| `usedAt` | `[Date]` | — | Usage timestamps |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ code: 1 }` — unique
- `{ purchasedBy: 1 }` — buyer queries
- `{ expiresAt: 1 }` — expiry monitoring

**Relationships:** `purchasedBy` → User (1:1), `usedBy` → User (M:N)

---

### 2.10 Return — `returns`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique return identifier |
| `orderId` | `ObjectId` | required, ref: Order | Original order |
| `userId` | `ObjectId` | required, ref: User | Customer |
| `items` | `[SubDoc]` | — | Returned items (see below) |
| `status` | `String` | enum: pending/approved/rejected/received/refunded/cancelled | Return lifecycle |
| `reason` | `String` | required | Primary reason |
| `description` | `String` | — | Detailed explanation |
| `refundAmount` | `Number` | required | Amount to refund |
| `refundMethod` | `String` | enum: original/store_credit/bank_transfer | Refund channel |
| `trackingNumber` | `String` | — | Return shipment tracking |
| `notes` | `[SubDoc]` | — | Staff/customer notes |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Return items sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `productId` | `ObjectId` | required, ref: Product | Product reference |
| `name` | `String` | required | Product name snapshot |
| `image` | `String` | — | Product image |
| `quantity` | `Number` | required, min: 1 | Qty being returned |
| `price` | `Number` | required | Unit price paid |
| `reason` | `String` | required | Item-specific reason |
| `condition` | `String` | enum: opened/sealed/damaged | Item condition |
| `images` | `[String]` | — | Condition photos |

**Notes sub-document:** `by` (admin/system/user), `message`, `createdAt`.

**Indexes:**
- `{ userId: 1 }` — customer return history
- `{ orderId: 1 }` — order returns lookup
- `{ status: 1 }` — workflow queries

**Relationships:** `orderId` → Order (1:1), `userId` → User (1:1), `items.productId` → Product (1:1)

---

### 2.11 Vendor — `vendors`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique vendor identifier |
| `userId` | `ObjectId` | required, unique, ref: User | Associated user account |
| `storeName` | `String` | required | Store display name |
| `storeSlug` | `String` | required, unique | Store URL slug |
| `storeDescription` | `String` | — | Store description |
| `storeLogo` | `String` | — | Logo image URL |
| `storeBanner` | `String` | — | Banner image URL |
| `status` | `String` | enum: pending/approved/rejected/suspended | Vendor application status |
| `commissionRate` | `Number` | default: 10 | Platform commission % |
| `commissionBalance` | `Number` | default: 0 | Unpaid commission balance |
| `pendingPayout` | `Number` | default: 0 | Pending payout amount |
| `totalEarnings` | `Number` | default: 0 | Lifetime earnings |
| `totalSales` | `Number` | default: 0 | Total sales count |
| `totalOrders` | `Number` | default: 0 | Total order count |
| `rating` | `Number` | default: 0 | Store rating |
| `numReviews` | `Number` | default: 0 | Review count |
| `contactEmail` | `String` | required | Store contact email |
| `contactPhone` | `String` | — | Store contact phone |
| `address` | `Object` | — | Physical address (street, city, state, zip, country) |
| `bankDetails` | `Object` | — | bankName, accountName, accountNumber, routingNumber |
| `rejectedReason` | `String` | — | Admin rejection reason |
| `reviewedAt` | `Date` | — | Application review timestamp |
| `reviewedBy` | `ObjectId` | ref: User | Admin reviewer |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ userId: 1 }` — unique
- `{ storeSlug: 1 }` — unique
- `{ status: 1 }` — workflow queries

**Relationships:** `userId` → User (1:1), `reviewedBy` → User (1:1)

---

### 2.12 AbandonedCart — `abandonedcarts`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique abandoned cart identifier |
| `email` | `String` | — | Guest email |
| `userId` | `ObjectId` | ref: User | Registered user |
| `items` | `[SubDoc]` | — | Cart items (see below) |
| `totalAmount` | `Number` | required | Cart total |
| `currency` | `String` | default: USD | Cart currency |
| `status` | `String` | enum: active/recovered/expired/notified | Recovery lifecycle |
| `recoveryAttempts` | `Number` | default: 0 | Number of recovery emails sent |
| `lastNotifiedAt` | `Date` | — | Last recovery notification |
| `recoveredAt` | `Date` | — | Recovery timestamp |
| `recoveredOrderId` | `ObjectId` | ref: Order | Order if recovered |
| `userAgent` | `String` | — | Browser user agent |
| `ipAddress` | `String` | — | Customer IP |
| `expiresAt` | `Date` | required | Cart expiry |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Cart items sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `productId` | `ObjectId` | required, ref: Product | Product reference |
| `name` | `String` | required | Product name snapshot |
| `image` | `String` | — | Product image |
| `price` | `Number` | required | Unit price |
| `quantity` | `Number` | required, min: 1 | Quantity |
| `variant` | `String` | — | Variant name/description |

**Indexes:**
- `{ email: 1 }` — guest recovery queries
- `{ userId: 1 }` — user recovery queries
- `{ status: 1 }` — workflow queries
- `{ expiresAt: 1 }` — expiry cleanup

**Relationships:** `userId` → User (1:1), `items.productId` → Product (1:1), `recoveredOrderId` → Order (1:1)

---

### 2.13 AuditLog — `auditlogs`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique log identifier |
| `action` | `String` | required, enum (see below) | Action type performed |
| `userId` | `ObjectId` | required, ref: User | Acting user |
| `userEmail` | `String` | required | User email snapshot |
| `entityType` | `String` | required, enum: USER/SESSION/TOKEN/AUDIT_LOG/ORDER/SETTINGS/PRODUCT | Affected entity type |
| `entityId` | `Mixed` | required (ObjectId or String) | Affected entity ID |
| `changes` | `Mixed` | default: {} | Diff/changes payload |
| `ipAddress` | `String` | — | Request IP |
| `userAgent` | `String` | — | Request user agent |
| `createdAt` | `Date` | auto (createdAt only) | Timestamp |

**Action enum values:** CREATE, UPDATE, DELETE, LOGIN, LOGOUT, PASSWORD_CHANGE, ROLE_CHANGE, STATUS_CHANGE, 2FA_ENABLED, 2FA_DISABLED, LOGIN_FAILED, SIGNUP_SUCCESS, SIGNUP_FAILED, 2FA_SUCCESS, 2FA_FAILED, PASSWORD_RESET, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_FAILED, ORDER_PLACED, ORDER_UPDATE, ORDER_DELETE, PRODUCT_CREATE, PRODUCT_UPDATE, PRODUCT_DELETE, SETTINGS_UPDATE, INVITE_SENT, INVITE_ACCEPTED, USER_UPDATE, USER_DELETE, SESSION_REVOKED, DEVICE_REMOVED, LOGIN_SUCCESS, LOCKOUT, UNLOCKED.

**Indexes:**
- `{ userId: 1, createdAt: -1 }` — user audit trail
- `{ entityType: 1, entityId: 1 }` — entity-specific audit trail
- `{ action: 1, createdAt: -1 }` — action-based auditing

**Relationships:** `userId` → User (1:1)

---

### 2.14 Notification — `notifications`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique notification identifier |
| `userId` | `ObjectId` | required, ref: User | Recipient user |
| `title` | `String` | required | Notification title |
| `message` | `String` | required | Notification body |
| `type` | `String` | enum: info/success/warning/error, default: info | Notification style |
| `isRead` | `Boolean` | default: false | Read status |
| `link` | `String` | — | Deep-link URL |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ userId: 1, createdAt: -1 }` — user's notification feed
- `{ userId: 1, isRead: 1 }` — unread notification queries
- `{ type: 1 }` — type-based filtering

**Relationships:** `userId` → User (1:1)

---

### 2.15 SupportTicket — `supporttickets`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique ticket identifier |
| `userId` | `ObjectId` | ref: User, optional | Authenticated user |
| `email` | `String` | required | Contact email |
| `name` | `String` | required | Contact name |
| `subject` | `String` | required | Ticket subject |
| `category` | `String` | required, enum: order/product/billing/technical/other | Issue category |
| `priority` | `String` | enum: low/medium/high/urgent, default: medium | Priority level |
| `status` | `String` | enum: open/pending/resolved/closed, default: open | Ticket lifecycle |
| `messages` | `[SubDoc]` | — | Conversation thread |
| `relatedOrderId` | `ObjectId` | ref: Order | Associated order |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Messages sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `sender` | `String` | required, enum: user/support | Message author |
| `message` | `String` | required | Message body |
| `attachments` | `[String]` | — | File URLs |
| `createdAt` | `Date` | default: Date.now | Message timestamp |

**Indexes:**
- `{ userId: 1 }` — user ticket queries
- `{ status: 1 }` — workflow queries
- `{ category: 1 }` — reporting/analytics

**Relationships:** `userId` → User (1:1), `relatedOrderId` → Order (1:1)

---

### 2.16 StockAlert — `stockalerts`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique alert identifier |
| `productId` | `ObjectId` | required, ref: Product | Product to monitor |
| `userId` | `ObjectId` | ref: User, optional | Registered user |
| `email` | `String` | required | Notification email |
| `type` | `String` | required, enum: low_stock/back_in_stock | Alert trigger type |
| `status` | `String` | enum: pending/sent/expired, default: pending | Alert lifecycle |
| `sentAt` | `Date` | — | Notification timestamp |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ productId: 1, email: 1 }` — unique — prevent duplicate alerts
- `{ type: 1, status: 1 }` — alert processing queries

**Relationships:** `productId` → Product (1:1), `userId` → User (1:1)

---

### 2.17 PriceHistory — `pricehistories`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique price history identifier |
| `productId` | `ObjectId` | required, unique, ref: Product | Product reference |
| `pricePoints` | `[SubDoc]` | — | Price snapshots (see below) |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Price points sub-document:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `date` | `Date` | required | Snapshot timestamp |
| `price` | `Number` | required | Price at that time |
| `source` | `String` | — | Source (e.g., "admin_update", "sale_end") |

**Indexes:**
- `{ productId: 1 }` — unique
- `{ "pricePoints.date": -1 }` — time-series queries

**Relationships:** `productId` → Product (1:1)

---

### 2.18 Payout — `payouts`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique payout identifier |
| `vendorId` | `ObjectId` | required, ref: Vendor | Receiving vendor |
| `amount` | `Number` | required | Payout amount |
| `status` | `String` | enum: pending/processing/completed/failed/cancelled | Payout lifecycle |
| `paymentMethod` | `String` | required, enum: bank_transfer/paypal/stripe | Disbursement method |
| `transactionId` | `String` | — | External transaction reference |
| `notes` | `String` | — | Admin notes |
| `processedAt` | `Date` | — | Processing timestamp |
| `requestedAt` | `Date` | default: Date.now | Request timestamp |
| `completedAt` | `Date` | — | Completion timestamp |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ vendorId: 1, status: 1 }` — vendor payout queries

**Relationships:** `vendorId` → Vendor (1:1)

---

### 2.19 PopularSearch — `popularsearches`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique search record identifier |
| `query` | `String` | required | Raw search text |
| `normalizedQuery` | `String` | required, lowercase | Normalized search text |
| `count` | `Number` | default: 1 | Search frequency |
| `lastSearchedAt` | `Date` | default: Date.now | Most recent search timestamp |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ normalizedQuery: 1 }` — unique — upsert on search
- `{ count: -1, lastSearchedAt: -1 }` — popular/trending queries
- `{ lastSearchedAt: -1 }` — recent queries
- `{ query: "text" }` — text search

**Relationships:** None (standalone collection)

---

### 2.20 Session — `sessions`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique session identifier |
| `userId` | `ObjectId` | required, ref: User | User who owns session |
| `sessionToken` | `String` | required, unique | Session token (JTI) |
| `expires` | `Date` | required | Expiry timestamp |
| `ipAddress` | `String` | — | Session IP |
| `userAgent` | `String` | — | Session user agent |
| `revoked` | `Boolean` | default: false | Manual revocation flag |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ sessionToken: 1 }` — unique — token lookup
- `{ userId: 1, revoked: 1 }` — active sessions per user

**Relationships:** `userId` → User (1:1)

---

### 2.21 Settings — `settings`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique settings document |
| `siteName` | `String` | default: YOURAPP | Site display name |
| `contactEmail` | `String` | default: admin@yourapp.com | Admin contact email |
| `allowRegistration` | `Boolean` | default: true | Registration toggle |
| `maintenanceMode` | `Boolean` | default: false | Maintenance mode |
| `currency` | `String` | default: USD | Default store currency |
| `stripeEnabled` | `Boolean` | default: true | Stripe payment gateway |
| `paypalEnabled` | `Boolean` | default: true | PayPal payment gateway |
| `googleAnalyticsId` | `String` | default: "" | GA tracking ID |
| `updatedBy` | `ObjectId` | ref: User | Last updated by |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:** None (singleton collection — typically one document)

**Relationships:** `updatedBy` → User (1:1)

---

### 2.22 Token — `tokens`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique token identifier |
| `userId` | `ObjectId` | required, ref: User | Token owner |
| `token` | `String` | required | Token value (JWT or random) |
| `type` | `String` | required, enum: refresh/reset/verify/invite | Token purpose |
| `expiresAt` | `Date` | required (TTL index) | Expiry timestamp |
| `revoked` | `Boolean` | default: false | Manual revocation |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ token: 1 }` — token lookup
- `{ expiresAt: 1 }` — TTL index (`expires: 0`) — auto-delete expired documents
- `{ userId: 1, type: 1, revoked: 1 }` — compound — user token queries

**Relationships:** `userId` → User (1:1)

---

### 2.23 LoginHistory — `loginhistories`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique login record identifier |
| `userId` | `ObjectId` | required, ref: User | User who attempted login |
| `email` | `String` | required | Email used |
| `ipAddress` | `String` | required | Request IP |
| `userAgent` | `String` | default: "" | Browser user agent |
| `device` | `String` | — | Parsed device name |
| `browser` | `String` | — | Parsed browser name |
| `os` | `String` | — | Parsed OS name |
| `location` | `String` | — | Geo-location |
| `success` | `Boolean` | required | Login outcome |
| `reason` | `String` | — | Failure reason (if applicable) |
| `sessionId` | `ObjectId` | ref: Session | Created session (on success) |
| `createdAt` | `Date` | auto (createdAt only) | Timestamp |

**Indexes:**
- `{ userId: 1, createdAt: -1 }` — user login history
- `{ email: 1, createdAt: -1 }` — lookup by email for security analysis
- `{ sessionId: 1 }` — session-to-login linkage

**Relationships:** `userId` → User (1:1), `sessionId` → Session (1:1)

---

### 2.24 Faq — `faqs`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique FAQ identifier |
| `question` | `String` | required | FAQ question |
| `answer` | `String` | required | FAQ answer |
| `category` | `String` | required | Category slug/name |
| `order` | `Number` | default: 0 | Sort order within category |
| `isPublished` | `Boolean` | default: true | Visibility flag |
| `views` | `Number` | default: 0 | View counter |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ category: 1, order: 1 }` — category grouping and ordering
- `{ isPublished: 1 }` — published-only queries

**Relationships:** `category` → FaqCategory (logical FK — by slug/name string, not ObjectId)

---

### 2.25 FaqCategory — `faqcategories`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique FAQ category identifier |
| `name` | `String` | required | Category display name |
| `slug` | `String` | required, unique | URL/slug identifier |
| `description` | `String` | — | Category description |
| `icon` | `String` | — | Icon identifier |
| `order` | `Number` | default: 0 | Sort order |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ slug: 1 }` — unique

**Relationships:** Referenced by Faq.category (logical string reference)

---

### 2.26 ContactMessage — `contactmessages`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | `ObjectId` | PK, auto | Unique message identifier |
| `userId` | `ObjectId` | ref: User, optional | Authenticated user |
| `name` | `String` | required | Sender name |
| `email` | `String` | required | Sender email |
| `subject` | `String` | required | Message subject |
| `message` | `String` | required | Message body |
| `status` | `String` | enum: pending/read/replied, default: pending | Admin workflow status |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

**Indexes:**
- `{ status: 1 }` — workflow queries
- `{ email: 1 }` — lookup by email
- `{ createdAt: -1 }` — chronological queries

**Relationships:** `userId` → User (1:1)

---

## 3. Relationships Map

### 3.1 Reference Fields Summary

| Source Model | Field | Target Model | Relationship | Cardinality |
|-------------|-------|-------------|-------------|-------------|
| **User** | `wishlist[*]` | Product | Array of ObjectId refs | M:N |
| **User** | `invitedBy` | User | ObjectId ref (self) | 1:1 |
| **User** | `referredBy` | User | ObjectId ref (self) | 1:1 |
| **Product** | `category` | Category | ObjectId ref | 1:1 |
| **Product** | `brandRef` | Brand | ObjectId ref | 1:1 |
| **Product** | `relatedProducts[*]` | Product | Array of ObjectId refs (self) | M:N |
| **Product** | `frequentlyBoughtTogether[*]` | Product | Array of ObjectId refs (self) | M:N |
| **Product** | `reviews[*].user` | User | Embedded sub-document ref | 1:1 |
| **Order** | `user` | User | ObjectId ref | 1:1 |
| **Order** | `items[*].product` | Product | Embedded sub-document ref | 1:1 |
| **Category** | `parent` | Category | ObjectId ref (self) | 1:1 |
| **Coupon** | `applicableCategories[*]` | Category | Array of ObjectId refs | M:N |
| **Coupon** | `applicableProducts[*]` | Product | Array of ObjectId refs | M:N |
| **Bundle** | `products[*].product` | Product | Embedded sub-document ref | 1:1 |
| **Bundle** | `category` | Category | ObjectId ref | 1:1 |
| **GiftCard** | `purchasedBy` | User | ObjectId ref | 1:1 |
| **GiftCard** | `usedBy[*]` | User | Array of ObjectId refs | M:N |
| **Return** | `orderId` | Order | ObjectId ref | 1:1 |
| **Return** | `userId` | User | ObjectId ref | 1:1 |
| **Return** | `items[*].productId` | Product | Embedded sub-document ref | 1:1 |
| **Vendor** | `userId` | User | ObjectId ref (unique) | 1:1 |
| **Vendor** | `reviewedBy` | User | ObjectId ref | 1:1 |
| **AbandonedCart** | `userId` | User | ObjectId ref | 1:1 |
| **AbandonedCart** | `items[*].productId` | Product | Embedded sub-document ref | 1:1 |
| **AbandonedCart** | `recoveredOrderId` | Order | ObjectId ref | 1:1 |
| **AuditLog** | `userId` | User | ObjectId ref | 1:1 |
| **Notification** | `userId` | User | ObjectId ref | 1:1 |
| **SupportTicket** | `userId` | User | ObjectId ref | 1:1 |
| **SupportTicket** | `relatedOrderId` | Order | ObjectId ref | 1:1 |
| **StockAlert** | `productId` | Product | ObjectId ref | 1:1 |
| **StockAlert** | `userId` | User | ObjectId ref | 1:1 |
| **PriceHistory** | `productId` | Product | ObjectId ref (unique) | 1:1 |
| **Payout** | `vendorId` | Vendor | ObjectId ref | 1:1 |
| **Session** | `userId` | User | ObjectId ref | 1:1 |
| **Token** | `userId` | User | ObjectId ref | 1:1 |
| **LoginHistory** | `userId` | User | ObjectId ref | 1:1 |
| **LoginHistory** | `sessionId` | Session | ObjectId ref | 1:1 |
| **Settings** | `updatedBy` | User | ObjectId ref | 1:1 |
| **ContactMessage** | `userId` | User | ObjectId ref | 1:1 |

### 3.2 Virtual Relationships

| Source Model | Virtual Name | Target Model | Type | Foreign Field |
|-------------|-------------|-------------|------|---------------|
| **Category** | `productCount` | Product | Count | `category` |
| **Category** | `children` | Category | Array | `parent` |
| **Brand** | `productCount` | Product | Count | `brandRef` |

### 3.3 Logical (String-Based) Relationships

| Source Model | Field | Target Model | Note |
|-------------|-------|-------------|------|
| **Faq** | `category` | FaqCategory | String slug/name, not ObjectId |
| **Product** | `brand` | Brand | Legacy denormalized string; prefer `brandRef` |

---

## 4. Index Summary

### 4.1 Unique Indexes

| Collection | Index Key | Purpose |
|-----------|-----------|---------|
| User | `email` | Login uniqueness |
| User | `referralCode` (sparse) | Referral system |
| Product | `slug` | URL uniqueness |
| Category | `slug` | URL uniqueness |
| Coupon | `code` | Coupon code uniqueness |
| Bundle | `slug` | URL uniqueness |
| Brand | `name` | Brand name uniqueness |
| Brand | `slug` | URL uniqueness |
| GiftCard | `code` | Card code uniqueness |
| Vendor | `userId` | One store per user |
| Vendor | `storeSlug` | Store URL uniqueness |
| StockAlert | `productId` + `email` | Prevent duplicate alerts |
| PriceHistory | `productId` | One price history per product |
| Session | `sessionToken` | Session token uniqueness |
| FaqCategory | `slug` | URL uniqueness |
| PopularSearch | `normalizedQuery` | Prevent duplicate search terms |

### 4.2 TTL Indexes

| Collection | Index Key | expireAfterSeconds | Purpose |
|-----------|-----------|-------------------|---------|
| User | `resetPasswordToken` | 3600 (with partial filter) | Auto-delete expired reset tokens |
| Token | `expiresAt` | 0 (on document expiry) | Auto-delete expired tokens |

### 4.3 Text Indexes

| Collection | Index Key | Weights | Purpose |
|-----------|-----------|---------|---------|
| Product | `name`, `description`, `brand`, `tags` | name:10, brand:8, tags:5, desc:3 | Product search |
| Category | `name`, `description` | default | Category search |
| Brand | `name`, `description` | default | Brand search |
| PopularSearch | `query` | default | Search term matching |

### 4.4 Compound Indexes

| Collection | Index Key | Purpose |
|-----------|-----------|---------|
| Product | `isActive:1, isArchived:1, price:1` | Filtered price queries |
| Product | `isActive:1, isArchived:1, category:1, price:1` | Category + price filter |
| Product | `isActive:1, isArchived:1, rating:-1` | Top-rated filter |
| Product | `isActive:1, isArchived:1, stock:1` | Stock filter |
| Product | `isActive:1, isArchived:1, discountPrice:1` | Sale items |
| Product | `isActive:1, isArchived:1, brand:1` | Brand filter |
| Product | `isActive:1, isArchived:1, createdAt:-1` | New arrivals |
| Product | `isActive:1, isArchived:1, colors:1` | Color filter |
| Product | `isActive:1, isArchived:1, sizes:1` | Size filter |
| Product | `category:1, isActive:1` | Category browsing |
| User | `resetPasswordToken:1` | Partial TTL (expireAfterSeconds:3600, partialFilterExpression) |
| Token | `userId:1, type:1, revoked:1` | User token management |
| Session | `userId:1, revoked:1` | Active sessions |
| AuditLog | `userId:1, createdAt:-1` | User audit trail |
| AuditLog | `entityType:1, entityId:1` | Entity audit trail |
| AuditLog | `action:1, createdAt:-1` | Action audit trail |
| Notification | `userId:1, createdAt:-1` | Notification feed |
| Notification | `userId:1, isRead:1` | Unread count |
| LoginHistory | `userId:1, createdAt:-1` | User login history |
| LoginHistory | `email:1, createdAt:-1` | Security analysis |
| Payout | `vendorId:1, status:1` | Vendor payout queries |
| StockAlert | `type:1, status:1` | Alert processing |
| Bundle | `isActive:1, validFrom:1, validUntil:1` | Active bundles |
| Faq | `category:1, order:1` | Category FAQ display |
| Coupon | `startDate:1, endDate:1` | Date-range validity |

---

## 5. Indexing Strategy Notes

### 5.1 Product Query Pattern Strategy

The Product collection has the most sophisticated indexing strategy due to complex catalog queries:

- **Filter-first pattern:** Every catalog query index begins with `{ isActive: 1, isArchived: 1 }` as a leading prefix. This ensures MongoDB can efficiently narrow the result set to visible products before applying additional filters.
- **Covered query potential:** Many product listing queries can be satisfied entirely from index keys without touching documents.
- **Text search:** A weighted text index supports full-text search, with `name` weighted highest (10×) and `description` lowest (3×).

### 5.2 Sort and Range Optimizations

- `{ createdAt: -1 }` indexes on Order, Product (compound), User, LoginHistory, AuditLog, ContactMessage support "newest first" sorting without in-memory sorts.
- `{ count: -1, lastSearchedAt: -1 }` on PopularSearch supports trending queries.
- `{ rating: -1 }` on Product supports top-rated sorting.
- `{ price: 1 }` on Product supports price range queries.

### 5.3 Unused/Useless Index Candidates

The standalone `{ brand: 1 }` index on Product is redundant with the compound `{ isActive: 1, isArchived: 1, brand: 1 }` index for filtered queries, but is retained for unfiltered brand queries. Consider dropping if performance testing shows no query uses it.

### 5.4 Sparse Indexes

`User.referralCode` uses a sparse unique index because most users do not have referral codes. This prevents null/empty values from violating uniqueness.

### 5.5 Partial Index on User

`{ resetPasswordToken: 1 }` with `partialFilterExpression: { resetPasswordExpires: { $exists: true } }` ensures only documents with pending password resets are indexed, reducing index size.

---

## 6. Data Lifecycle & TTL Indexes

### 6.1 Automatic Expiry via TTL

| Collection | TTL Field | Duration | Behavior |
|-----------|-----------|----------|----------|
| **Token** | `expiresAt` | — (TTL index, `expires: 0`) | Document is automatically deleted by MongoDB when `expiresAt` is reached |
| **User** (reset tokens) | `resetPasswordExpires` | 3600 seconds (1 hour) | Only for documents where `resetPasswordExpires` field exists |

### 6.2 Application-Level Expiry

| Collection | Expiry Field | Logic |
|-----------|-------------|-------|
| **AbandonedCart** | `expiresAt` | Application checks and filters expired carts; status set to "expired" via cron |
| **Coupon** | `endDate` | Application checks `endDate >= now()` during validation |
| **Bundle** | `validUntil` | Application checks validity window; inactive outside range |
| **Session** | `expires` | Application validates session expiry on each request |
| **GiftCard** | `expiresAt` | Application checks expiry during redemption |
| **Banner** | `startDate` / `endDate` | Application filters active banners by date range |

### 6.3 Soft Deletes

- **Product** uses `isArchived: true` for soft deletion. All catalog queries filter with `isArchived: false`. This preserves data integrity for historical orders and reviews.
- **User** uses `status: "banned"` instead of deletion.
- **Vendor** uses `status: "suspended"` / `"rejected"`.

### 6.4 Audit Log & Login History Growth

`AuditLog` and `LoginHistory` collections can grow very quickly. Recommendations:
- Implement a capped collection or a TTL index on `createdAt` for automatic rotation (e.g., retain 90 days).
- Alternatively, use a cron job to archive/delete records older than a retention threshold.
- Partition by date ranges (time-series pattern) for large-scale deployments.

---

## 7. Cascading Deletes & Referential Integrity

### 7.1 Current State

MongoDB does not support automatic cascading deletes. The application is responsible for referential integrity. The following patterns are used:

| Parent Deletion | Impact | Recommended Application Handling |
|----------------|--------|--------------------------------|
| **User** deletion | Orders, Returns, Notifications, Sessions, Tokens, LoginHistory, AuditLog, SupportTickets, Cart, Vendor, ContactMessages | Archive user (set status=deactivated) rather than delete. Or cascade-delete Sessions, Tokens, Notifications, LoginHistory. Retain Orders/Returns for audit. |
| **Product** deletion | Order items (snapshot), Bundles, StockAlerts, PriceHistory, Cart items (snapshot), Return items (snapshot), Wishlist references | Soft-delete via `isArchived`. If hard-deleted: remove from wishlists (User), remove from bundles, cascade StockAlerts and PriceHistory. |
| **Category** deletion | Products referencing it, Coupon category restrictions | Set `category` to null on affected Products, remove from Coupon arrays. |
| **Order** deletion | Return referencing it, AbandonedCart recovery | Prevent deletion of orders with active returns. |
| **Vendor** deletion | Payouts | Archive vendor; payouts must be retained for financial audit. |
| **Brand** deletion | Products referencing it | Set `brandRef` to null on affected products. |
| **Session** deletion | LoginHistory reference | Set `sessionId` to null on LoginHistory. |

### 7.2 Recommendation for Enterprise

Implement a **pre-remove hook** pattern on critical collections:

```typescript
// Example pattern for Product pre-remove hook
productSchema.pre("deleteOne", { document: true, query: false }, async function () {
  const productId = this._id;
  await Promise.all([
    User.updateMany({}, { $pull: { wishlist: productId } }),
    StockAlert.deleteMany({ productId }),
    PriceHistory.deleteMany({ productId }),
  ]);
});
```

For MongoDB Atlas users, consider **Database Triggers** (change streams + serverless functions) for cross-collection referential integrity.

---

## 8. Migration Strategy

### 8.1 Guidelines for Schema Changes

1. **Always add new fields as optional** — Mongoose ignores undefined fields on read, so existing documents remain valid.
2. **Use default values** for new required fields to avoid backfill.
3. **Prefer backward-compatible changes** — Never remove fields that existing application code references.
4. **Use a phased approach**:
   - **Phase 1:** Add new field, dual-write old + new, deploy application.
   - **Phase 2:** Backfill existing documents via batch script.
   - **Phase 3:** Remove old field after verifying all consumers use the new one.

### 8.2 Recommended Migration Tools

| Tool | Use Case |
|------|----------|
| **MongoDB `$merge` aggregation** | Bulk transformations within the database |
| **Custom Node.js scripts** | Complex migrations with application logic (see `scripts/` directory) |
| **`mongosh` scripts** | Simple field additions/removals |
| **Atlas Migration Service** | For Atlas-hosted clusters |

### 8.3 Migration Script Template

```typescript
// scripts/migrate-<name>.ts
import mongoose from "mongoose";
import { Product } from "@/core/database/models";

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const batchSize = 1000;
  let cursor = Product.find({ /* filter for documents needing migration */ })
    .batchSize(batchSize)
    .cursor();

  for await (const doc of cursor) {
    // transform doc
    doc.newField = computeValue(doc);
    await doc.save();
  }
  await mongoose.disconnect();
}

migrate().catch(console.error);
```

### 8.4 Index Migration

- **Creating indexes:** Use mongoose `syncIndexes()` during deployment, which creates only missing indexes (safe).
- **Dropping unused indexes:** Explicitly call `dropIndex()` after verifying no query uses the index.
- **Avoid index build impact on production:** Use `createIndexes({ background: true })` in MongoDB 4.2+ (background builds are default in MongoDB 4.4+). For large collections, consider rolling index builds in Atlas.

### 8.5 Data Integrity Checks

After any migration, run validation queries:

```typescript
// Check orphaned references
const orphans = await Product.countDocuments({
  category: { $nin: await Category.distinct("_id") },
});
```

---

## Appendix A: Collection Names & Mongoose Pluralization

| Model Name | Mongoose Collection | Documents Contain |
|-----------|-------------------|-------------------|
| User | `users` | Person accounts |
| Product | `products` | Sellable items |
| Order | `orders` | Customer purchases |
| Category | `categories` | Product groupings |
| Coupon | `coupons` | Discount codes |
| Bundle | `bundles` | Product bundles |
| Brand | `brands` | Manufacturer brands |
| Banner | `banners` | Marketing banners |
| GiftCard | `giftcards` | Gift cards |
| Return | `returns` | Return/refund requests |
| Vendor | `vendors` | Seller profiles |
| AbandonedCart | `abandonedcarts` | Abandoned carts |
| AuditLog | `auditlogs` | Security audit trail |
| Notification | `notifications` | User notifications |
| SupportTicket | `supporttickets` | Support tickets |
| StockAlert | `stockalerts` | Stock notifications |
| PriceHistory | `pricehistories` | Price change records |
| Payout | `payouts` | Vendor payouts |
| PopularSearch | `popularsearches` | Trending searches |
| Session | `sessions` | User sessions |
| Settings | `settings` | Site configuration |
| Token | `tokens` | JWT and verification tokens |
| LoginHistory | `loginhistories` | Login attempt records |
| Faq | `faqs` | FAQ entries |
| FaqCategory | `faqcategories` | FAQ category groups |
| ContactMessage | `contactmessages` | Contact form submissions |

---

*Document generated from Mongoose schema definitions at `src/core/database/models/`. For questions, contact the platform engineering team.*
