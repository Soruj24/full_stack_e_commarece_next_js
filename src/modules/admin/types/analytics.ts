export interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
  ordersGrowth: number;
  aovGrowth: number;
  conversionGrowth: number;
}

export interface SalesByDay {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface SalesByProduct {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  revenue: number;
  category: string;
}

export interface SalesByCategory {
  categoryId: string;
  name: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface SalesByPeriod {
  period: string;
  revenue: number;
  orders: number;
  returns: number;
  netRevenue: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  pendingPayouts: number;
  revenueGrowth: number;
  refundRate: number;
}

export interface RevenueByPaymentMethod {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  orders: number;
  refunds: number;
  netRevenue: number;
}

export interface RevenueForecast {
  period: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  recipients: "all" | "admin" | "user" | "specific";
  recipientIds?: string[];
  status: "sent" | "scheduled" | "draft" | "failed";
  scheduledFor?: string;
  sentAt?: string;
  readBy: { userId: string; readAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  type: "email" | "push" | "in_app";
  variables: string[];
  createdAt: string;
}

export interface AdminPermission {
  _id: string;
  name: string;
  key: string;
  description: string;
  module: string;
  createdAt: string;
}

export interface AdminRole {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportConfig {
  type: "sales" | "revenue" | "products" | "customers" | "orders" | "inventory";
  dateRange: "today" | "yesterday" | "7d" | "30d" | "90d" | "1y" | "custom";
  startDate?: string;
  endDate?: string;
  format: "pdf" | "csv" | "excel";
  groupBy?: "day" | "week" | "month" | "quarter" | "year";
  filters?: Record<string, unknown>;
}

export interface Report {
  _id: string;
  name: string;
  type: ReportConfig["type"];
  config: ReportConfig;
  generatedBy: string;
  fileUrl?: string;
  status: "generating" | "ready" | "failed";
  createdAt: string;
}

export interface NotificationFormData {
  title: string;
  message: string;
  type: AdminNotification["type"];
  recipients: AdminNotification["recipients"];
  recipientIds?: string[];
  scheduledFor?: string;
}
