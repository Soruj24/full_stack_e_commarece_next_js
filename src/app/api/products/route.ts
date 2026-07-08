import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "";
    const query: Record<string, unknown> = {};
    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category;
    const products = await Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await Product.countDocuments(query);
    return NextResponse.json({ success: true, products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create product" }, { status: 500 });
  }
}
