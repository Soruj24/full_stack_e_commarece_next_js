import { NextResponse } from "next/server";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();

const PAYMENT_METHODS = [
  { method: "stripe", label: "Stripe", amount: 425000, count: 3200, percentage: 48 },
  { method: "paypal", label: "PayPal", amount: 185000, count: 1400, percentage: 21 },
  { method: "cod", label: "Cash on Delivery", amount: 124000, count: 2100, percentage: 14 },
  { method: "bkash", label: "bKash", amount: 89000, count: 680, percentage: 10 },
  { method: "nagad", label: "Nagad", amount: 45000, count: 340, percentage: 5 },
  { method: "rocket", label: "Rocket", amount: 18000, count: 140, percentage: 2 },
];

export async function GET() {
  const totalRevenue = PAYMENT_METHODS.reduce((s, p) => s + p.amount, 0);
  const refundedAmount = Math.floor(totalRevenue * 0.035);
  const netRevenue = totalRevenue - refundedAmount;
  const pendingPayouts = Math.floor(totalRevenue * 0.08);
  const revenueGrowth = 23.5;
  const refundRate = 3.5;

  const byPeriod = MONTHS.map((month, i) => ({
    month,
    year: CURRENT_YEAR,
    revenue: Math.floor(Math.random() * 120000) + 40000,
    expenses: Math.floor(Math.random() * 40000) + 15000,
    profit: 0,
    orders: Math.floor(Math.random() * 600) + 100,
  })).map((m) => ({
    ...m,
    profit: m.revenue - m.expenses,
  }));

  const byPaymentMethod = PAYMENT_METHODS;

  const forecast = Array.from({ length: 6 }, (_, i) => {
    const base = byPeriod[byPeriod.length - 1].revenue;
    const growth = 1 + (i + 1) * 0.025;
    const predicted = Math.floor(base * growth);
    const variance = Math.floor(predicted * 0.08);
    return {
      month: MONTHS[(new Date().getMonth() + 1 + i) % 12],
      year: CURRENT_YEAR,
      predicted,
      lowerBound: predicted - variance,
      upperBound: predicted + variance,
      confidence: Math.max(50, 95 - i * 7),
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalRevenue,
        refundedAmount,
        netRevenue,
        pendingPayouts,
        revenueGrowth,
        refundRate,
      },
      byPaymentMethod,
      byPeriod,
      forecast,
    },
  });
}
