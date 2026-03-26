# Nexus - Full Stack E-Commerce Platform

A modern, production-ready e-commerce platform built with Next.js 14, featuring a beautiful UI, comprehensive admin dashboard, and scalable architecture.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue?style=flat-square&logo=tailwind-css)

## 🚀 Features

### Customer Features

- 🛒 **Advanced Shopping Cart** - Slide-in drawer, quantity controls, promo codes
- ❤️ **Wishlist & Save for Later** - Persistent storage, move between lists
- 🔍 **Smart Product Search** - Real-time suggestions, filters, sorting
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🔒 **Secure Authentication** - NextAuth.js with 2FA support
- 💳 **Multiple Payment Options** - Stripe, PayPal, Cash on Delivery
- 📦 **Order Tracking** - Real-time timeline, status updates
- 🏷️ **Product Variants** - Colors, sizes, custom options
- 📸 **Image Gallery** - Zoom, rotation, thumbnails
- 📤 **Social Sharing** - Facebook, Twitter, LinkedIn, WhatsApp
- 📬 **Price Drop Alerts** - Email notifications
- 📦 **Back in Stock Notifications** - Automatic alerts
- 🎁 **Gift Wrapping** - Multiple wrapping styles
- 📦 **Product Bundles** - Build custom bundles with discount
- ❓ **Product Q&A** - Ask questions, seller responses
- 👁️ **Recently Viewed** - Track browsing history

### Admin Dashboard

- 📊 **Comprehensive Analytics** - Sales, revenue, user metrics
- 📦 **Product Management** - CRUD, bulk actions, variants
- 🏷️ **Category Management** - Hierarchical categories, SEO
- 🎫 **Coupon System** - Percentage, fixed, restrictions
- 📢 **Banner Management** - Hero banners, promotions
- 👥 **User Management** - Roles, permissions, bans
- 📋 **Order Management** - Status updates, refunds
- 🔄 **Inventory Tracking** - Low stock alerts
- 📈 **Audit Logs** - Complete activity tracking

### Technical Features

- ⚡ **Server-Side Rendering** - SEO optimized
- 🔄 **API Routes** - RESTful architecture
- 💾 **Database** - MongoDB with Mongoose
- 🎨 **UI Components** - Shadcn/ui based
- 🌙 **Dark Mode** - System-aware theming
- 🌐 **i18n Ready** - Multi-language support
- 📊 **Real-time** - WebSocket notifications
- 🚀 **Performance** - Optimized images, lazy loading
- 🔒 **Security** - CSRF, XSS protection

## 📁 Project Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (shop)/                   # Shop pages
│   ├── account/                  # User account
│   ├── admin/                    # Admin dashboard
│   └── api/                      # API routes
├── components/                   # React components
│   ├── ui/                      # UI primitives (shadcn)
│   ├── layout/                  # Layout components
│   ├── products/                # Product components
│   ├── cart/                    # Cart components
│   ├── orders/                  # Order components
│   ├── home/                    # Homepage sections
│   ├── admin/                   # Admin components
│   └── common/                  # Shared components
├── context/                      # React contexts
├── models/                      # Mongoose models
├── lib/                          # Utilities
├── types/                       # TypeScript types
├── config/                      # Configuration
└── public/                      # Static assets
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**
Create a `.env.local` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nexus

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe (optional)
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# PayPal (optional)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start         # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:seed       # Seed database with data

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run typecheck     # TypeScript check
```

## 🎨 Component Library

### Product Components

| Component | Description |
|-----------|-------------|
| `ProductCard` | Product display card with quick actions |
| `ProductGallery` | Image gallery with zoom & rotation |
| `QuickViewModal` | Quick view popup modal |
| `SizeGuide` | Size measurement charts |
| `ProductVariantSelector` | Color/size variant picker |
| `PriceDropAlert` | Price notification subscription |
| `ProductShare` | Social sharing buttons |
| `ProductQuestions` | Q&A section |
| `RecentlyViewed` | Recently viewed products |
| `RelatedProducts` | Related products slider |
| `ProductBadges` | Product badges (sale, new, etc.) |
| `ProductSpecifications` | Specs table & comparison |
| `StockCounter` | Stock level display |
| `BundleBuilder` | Create custom bundles |

### Cart Components

| Component | Description |
|-----------|-------------|
| `CartDrawer` | Slide-in cart panel |
| `CartAnimations` | Add-to-cart animations |
| `GiftWrapping` | Gift wrapping options |

### Order Components

| Component | Description |
|-----------|-------------|
| `OrderTimelineTracker` | Order status timeline |
| `ReorderButton` | Reorder previous items |

## 🔌 API Reference

### Products
```
GET    /api/products              # List products
POST   /api/products             # Create product
GET    /api/products/[id]        # Get product
PATCH  /api/products/[id]        # Update product
DELETE /api/products/[id]        # Delete product
```

### Categories
```
GET    /api/categories           # List categories
POST   /api/categories           # Create category
GET    /api/categories/[id]     # Get category
PATCH  /api/categories/[id]     # Update category
DELETE /api/categories/[id]     # Delete category
```

### Orders
```
GET    /api/orders               # List orders
POST   /api/orders               # Create order
GET    /api/orders/[id]         # Get order
PATCH  /api/orders/[id]         # Update order
```

## 🎯 Data Models

### Product
```typescript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  price: Number,
  discountPrice: Number,
  images: [String],
  category: ObjectId,
  stock: Number,
  rating: Number,
  numReviews: Number,
  colors: [{ name: String, hex: String }],
  sizes: [String],
  tags: [String],
  isFeatured: Boolean,
  isArchived: Boolean
}
```

### Category
```typescript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  image: String,
  icon: String,
  parent: ObjectId,
  isFeatured: Boolean,
  isActive: Boolean,
  order: Number,
  metaTitle: String,
  metaDescription: String
}
```

### Order
```typescript
{
  _id: ObjectId,
  orderNumber: String,
  user: ObjectId,
  items: [{
    product: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: Address,
  paymentMethod: String,
  paymentStatus: Enum,
  orderStatus: Enum,
  totalAmount: Number
}
```

## 🔒 Security Features

- ✅ CSRF Protection
- ✅ XSS Prevention
- ✅ Input Validation (Zod)
- ✅ Password Hashing (bcrypt)
- ✅ JWT Tokens
- ✅ Session Management
- ✅ Role-Based Access Control
- ✅ Rate Limiting
- ✅ Secure Headers

## 📊 Performance

- ⚡ Image Optimization (Next.js Image)
- ⚡ Code Splitting
- ⚡ Lazy Loading
- ⚡ Caching Strategy
- ⚡ Database Indexing
- ⚡ API Response Caching

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Mongoose](https://mongoosejs.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

Built with ❤️ by the Nexus Team
