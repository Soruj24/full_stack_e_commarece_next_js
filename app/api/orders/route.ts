// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/controllers";

export async function POST(req: Request) {
  return createOrder(req);
}

export async function GET(req: Request) {
  return getOrders(req);
}
