export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: Date;
  createdAt: Date | string;
  updatedAt: Date | string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  designation?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  requiresTwoFactor?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface TwoFactorSetupResponse {
  success: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  message?: string;
}

export interface IOrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}
export interface ContactMessage {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}
export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  totalAmount: number;
  shippingPrice: number;
  taxPrice: number;
  paymentIntentId?: string;
  shippingCarrier?: string;
  shippingService?: string;
  trackingNumber?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id?: string;
  type: "billing" | "shipping";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IPaymentMethod {
  _id?: string;
  provider: "stripe" | "paypal";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };

  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
  stock: number;
  brand?: string | undefined;
  sku?: string | undefined;
  tags?: string[] | undefined;
  colors?: string[] | undefined;
  sizes?: string[] | undefined;
  isFeatured?: boolean | undefined;
  isArchived?: boolean | undefined;
  onSale?: boolean | undefined;
}

export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string | undefined;
  image: string;
  link?: string | undefined;
  type: string;
  isActive: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: ICategory | string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  productCount?: number;
  children?: ICategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuditLog {
  _id: string;
  createdAt: string;
  userEmail: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  applicableCategories: string[];
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    id: string;
    role: string;
    email: string;
    status: string;
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    role: string;
    email: string;
    status: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
