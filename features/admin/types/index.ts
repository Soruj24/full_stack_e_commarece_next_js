export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
  userGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user: { name: string; email: string } | null;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }>;
  salesByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface UserManagementFilters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface ProductManagementFilters {
  search: string;
  category: string;
  status: string;
  stockStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface OrderManagementFilters {
  search: string;
  status: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminAction {
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  timestamp: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime: number;
  };
  lastChecked: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  currency: string;
  taxRate: number;
  shippingFee: number;
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  bKashEnabled: boolean;
  nagadEnabled: boolean;
  rocketEnabled: boolean;
  codEnabled: boolean;
  googleAnalyticsId: string;
  facebookPixelId: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

export interface BannerFormData {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: 'promotion' | 'announcement' | 'hero';
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  usageLimit: number;
  applicableCategories: string[];
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parent: string | null;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

export interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
}
