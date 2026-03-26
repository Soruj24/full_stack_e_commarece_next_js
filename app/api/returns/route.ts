import { dbConnect } from "@/config/db";
import { Return } from "@/models/Return";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    
    if (session?.user?.role === "admin") {
      if (status) filter.status = status;
    } else if (session?.user?.id) {
      filter.userId = session.user.id;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [returns, total] = await Promise.all([
      Return.find(filter)
        .populate("orderId", "orderNumber totalAmount")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Return.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      returns,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Returns GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, items, reason, description, refundMethod = "original" } = body;

    if (!orderId || !items || items.length === 0 || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const existingReturn = await Return.findOne({ orderId, status: { $nin: ["rejected", "cancelled"] } });
    if (existingReturn) {
      return NextResponse.json({ error: "A return request already exists for this order" }, { status: 400 });
    }

    const refundAmount = items.reduce((sum: number, item: { quantity: number; price: number }) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const newReturn = await Return.create({
      orderId,
      userId: session.user.id,
      items,
      reason,
      description,
      refundAmount,
      refundMethod,
      status: "pending",
      notes: [{
        by: "system",
        message: "Return request submitted",
        createdAt: new Date(),
      }],
    });

    return NextResponse.json({ success: true, return: newReturn });
  } catch (error) {
    console.error("Returns POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
