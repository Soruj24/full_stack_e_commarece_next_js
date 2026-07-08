import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Order } from "@/core/database/models/Order";
import { auth } from "@/core/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    await dbConnect();
    const body = await req.json();
    const order = await Order.create({ ...body, user: session?.user?.id });
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = session?.user?.id ? { user: session.user.id } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await Order.countDocuments(query);
    return NextResponse.json({ success: true, orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch orders" }, { status: 500 });
  }
}
