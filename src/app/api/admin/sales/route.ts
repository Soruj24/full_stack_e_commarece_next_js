import { NextResponse } from "next/server";
import { subDays, format } from "date-fns";

const PRODUCT_NAMES = [
  "Wireless Bluetooth Headphones",
  "Smart Watch Pro Max",
  "Organic Cotton T-Shirt",
  "4K Ultra HD Monitor 27\"",
  "Mechanical Gaming Keyboard",
  "Ergonomic Office Chair",
  "Portable Solar Charger 20000mAh",
  "Premium Leather Wallet",
];
const CATEGORIES = [
  { name: "Electronics", percentage: 42 },
  { name: "Fashion", percentage: 18 },
  { name: "Home & Living", percentage: 15 },
  { name: "Sports & Outdoors", percentage: 12 },
  { name: "Books & Media", percentage: 8 },
  { name: "Other", percentage: 5 },
];

function generateByDay(days: number) {
  const byDay: { date: string; revenue: number; orders: number; customers: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const date = format(d, "yyyy-MM-dd");
    const revenue = Math.floor(Math.random() * 15000) + 5000;
    const orders = Math.floor(Math.random() * 80) + 20;
    const customers = Math.floor(orders * (0.6 + Math.random() * 0.3));
    byDay.push({ date, revenue, orders, customers });
  }
  return byDay;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Math.min(Math.max(parseInt(searchParams.get("days") || "30") || 30, 1), 90);

  const byDay = generateByDay(days);
  const totalSales = byDay.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = byDay.reduce((s, d) => s + d.orders, 0);
  const totalCustomers = byDay.reduce((s, d) => s + d.customers, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const conversionRate = 3.2 + Math.random() * 1.5;

  const prevByDay = generateByDay(days);
  const prevSales = prevByDay.reduce((s, d) => s + d.revenue, 0);
  const prevOrders = prevByDay.reduce((s, d) => s + d.orders, 0);
  const prevAov = prevOrders > 0 ? Math.round(prevSales / prevOrders) : 0;

  const salesGrowth = prevSales > 0 ? +(((totalSales - prevSales) / prevSales) * 100).toFixed(1) : 0;
  const ordersGrowth = prevOrders > 0 ? +(((totalOrders - prevOrders) / prevOrders) * 100).toFixed(1) : 0;
  const aovGrowth = prevAov > 0 ? +(((avgOrderValue - prevAov) / prevAov) * 100).toFixed(1) : 0;
  const conversionGrowth = +(Math.random() * 8 - 2).toFixed(1);

  const byProduct = PRODUCT_NAMES.map((name, i) => ({
    productId: `prod_${1001 + i}`,
    name,
    image: `/images/products/product_${i + 1}.jpg`,
    quantity: Math.floor(Math.random() * 400) + 50,
    revenue: Math.floor(Math.random() * 80000) + 10000,
    category: CATEGORIES[i < 4 ? 0 : i < 6 ? 1 : 2].name,
  })).sort((a, b) => b.revenue - a.revenue);

  const byCategory = CATEGORIES.map((cat) => ({
    name: cat.name,
    revenue: Math.floor((totalSales * cat.percentage) / 100),
    percentage: cat.percentage,
    orders: Math.floor((totalOrders * cat.percentage) / 100),
    growth: +((Math.random() * 20 - 5)).toFixed(1),
  }));

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalSales,
        totalOrders,
        totalCustomers,
        avgOrderValue,
        conversionRate: +conversionRate.toFixed(2),
        salesGrowth,
        ordersGrowth,
        aovGrowth,
        conversionGrowth,
      },
      byDay,
      byProduct,
      byCategory,
    },
  });
}
