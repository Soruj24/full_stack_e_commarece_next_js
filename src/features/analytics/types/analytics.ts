export interface TopProduct {
  details: { name: string; images: string[] };
  totalSold: number;
  revenue: number;
}

export interface AnalyticsData {
  success: boolean;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    lowStockCount: number;
  };
  salesData: Array<{ _id: string; revenue: number }>;
  categoryStats: Array<{ _id: string; revenue: number }>;
  topProducts: TopProduct[];
  userEngagement: Array<{ _id: string; count: number }>;
}
