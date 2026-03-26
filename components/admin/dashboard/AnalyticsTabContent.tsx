// components/admin/dashboard/AnalyticsTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import Image from "next/image";
import { getSafeImageSrc } from "@/lib/utils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsTabContent() {
  const [data, setData] = useState<{
    success: boolean;
    stats: {
      totalRevenue: number;
      totalOrders: number;
      activeUsers: number;
      lowStockCount: number;
    };
    salesData: Array<{ _id: string; revenue: number }>;
    categoryStats: Array<{ _id: string; revenue: number }>;
    topProducts: Array<{
      details: { name: string; images: string[] };
      totalSold: number;
      revenue: number;
    }>;
    userEngagement: Array<{ _id: string; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (error) {
        toast.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return <div className="h-96 bg-muted/20 animate-pulse rounded-[40px]" />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            value: `$${(data?.stats?.totalRevenue || 0).toFixed(2)}`,
            icon: DollarSign,
            trend: "+12.5%",
            up: true,
          },
          {
            label: "Total Orders",
            value: data?.stats?.totalOrders || 0,
            icon: ShoppingBag,
            trend: "+8.2%",
            up: true,
          },
          {
            label: "Active Users",
            value: data?.stats?.activeUsers || 0,
            icon: Users,
            trend: "-2.4%",
            up: false,
          },
          {
            label: "Low Stock",
            value: data?.stats?.lowStockCount || 0,
            icon: Package,
            trend: "Attention",
            up: false,
            alert: true,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-8 rounded-[40px] bg-card border border-border/50 shadow-2xl shadow-primary/5 group hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "p-3 rounded-2xl transition-colors",
                  stat.alert
                    ? "bg-orange-500/10 text-orange-500"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
                  stat.up
                    ? "bg-green-500/10 text-green-500"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {stat.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.trend}
              </div>
            </div>
            <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tighter">
                Sales <span className="text-primary">Trend</span>
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Daily revenue for the last 30 days
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-2xl">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.salesData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    padding: "16px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tighter">
                Category <span className="text-primary">Insights</span>
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Revenue distribution by category
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryStats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="revenue"
                >
                  {(data?.categoryStats || []).map(
                    (
                      entry: { _id: string; revenue: number },
                      index: number,
                    ) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    padding: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Products */}
        <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tighter">
                Top <span className="text-primary">Products</span>
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Best selling items by quantity
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-2xl">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-6">
            {(data?.topProducts || []).map((product, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden relative">
                    <Image
                      src={getSafeImageSrc(product.details.images[0])}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">
                      {product.details.name}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {product.totalSold} Units Sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-primary">
                    ${product.revenue.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement Trend */}
        <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tighter">
                User <span className="text-primary">Engagement</span>
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                New user registrations (Last 30 days)
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-2xl">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.userEngagement || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    padding: "16px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}
