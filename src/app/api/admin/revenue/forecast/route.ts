import { NextResponse } from "next/server";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEAR = new Date().getFullYear();
const START_MONTH = new Date().getMonth();

const FORECAST = Array.from({ length: 6 }, (_, i) => {
  const monthIndex = (START_MONTH + i) % 12;
  const yearOffset = Math.floor((START_MONTH + i) / 12);
  const base = 125000 + Math.random() * 30000;
  const growth = 1 + (i + 1) * 0.025;
  const predicted = Math.floor(base * growth);
  const variance = Math.floor(predicted * (0.05 + i * 0.02));
  return {
    month: MONTHS[monthIndex],
    year: YEAR + yearOffset,
    predicted,
    lowerBound: predicted - variance,
    upperBound: predicted + variance,
    confidence: Math.max(50, 95 - i * 8),
    contributors: {
      newCustomers: Math.floor(predicted * 0.35),
      returningCustomers: Math.floor(predicted * 0.45),
      subscriptions: Math.floor(predicted * 0.2),
    },
  };
});

export async function GET() {
  const totalPredicted = FORECAST.reduce((s, f) => s + f.predicted, 0);
  return NextResponse.json({
    success: true,
    data: {
      forecast: FORECAST,
      summary: {
        totalPredicted,
        averageMonthly: Math.floor(totalPredicted / FORECAST.length),
        growthRate: 12.8,
        seasonalityFactor: 1.15,
      },
    },
  });
}
