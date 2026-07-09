import { NextResponse } from "next/server";

const SALES_BY_CATEGORY = [
  {
    id: "cat_01",
    name: "Electronics",
    revenue: 584000,
    orders: 4200,
    percentage: 42,
    growth: 18.5,
    products: 156,
    trending: true,
  },
  {
    id: "cat_02",
    name: "Fashion",
    revenue: 250000,
    orders: 3800,
    percentage: 18,
    growth: 12.3,
    products: 340,
    trending: false,
  },
  {
    id: "cat_03",
    name: "Home & Living",
    revenue: 208500,
    orders: 1800,
    percentage: 15,
    growth: 24.7,
    products: 210,
    trending: true,
  },
  {
    id: "cat_04",
    name: "Sports & Outdoors",
    revenue: 166800,
    orders: 1500,
    percentage: 12,
    growth: -3.2,
    products: 180,
    trending: false,
  },
  {
    id: "cat_05",
    name: "Books & Media",
    revenue: 111200,
    orders: 2200,
    percentage: 8,
    growth: 5.8,
    products: 450,
    trending: false,
  },
  {
    id: "cat_06",
    name: "Other",
    revenue: 69500,
    orders: 900,
    percentage: 5,
    growth: 7.1,
    products: 120,
    trending: false,
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: SALES_BY_CATEGORY,
  });
}
