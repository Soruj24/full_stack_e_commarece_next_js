// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/services";

export async function GET(request: Request) {
  return getProducts(request);
}

export async function POST(req: Request) {
  return createProduct(req);
}
