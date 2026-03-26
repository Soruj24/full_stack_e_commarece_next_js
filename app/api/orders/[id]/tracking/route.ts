import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Order } from "@/models/Order";
import { auth } from "@/auth";

const STATUS_STEPS = [
  { status: "pending", title: "Order Placed", description: "Your order has been received" },
  { status: "confirmed", title: "Order Confirmed", description: "Seller has confirmed your order" },
  { status: "processing", title: "Processing", description: "Your order is being prepared" },
  { status: "shipped", title: "Shipped", description: "Your order has been shipped" },
  { status: "out_for_delivery", title: "Out for Delivery", description: "Your order is out for delivery" },
  { status: "delivered", title: "Delivered", description: "Your order has been delivered" },
];

function getStatusIndex(status: string): number {
  if (status === "cancelled" || status === "refunded") return -1;
  return STATUS_STEPS.findIndex((s) => s.status === status);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    await dbConnect();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns this order (or is admin)
    if (session?.user?.id !== order.userId.toString() && session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentStatus = order.orderStatus?.toLowerCase().replace(" ", "_") || "pending";
    const currentIndex = getStatusIndex(currentStatus);

    const events = STATUS_STEPS.map((step, index) => {
      const isCompleted = currentIndex >= index;
      const isCurrent = currentIndex === index;

      // Calculate timestamp based on days from current step
      const daysAgo = Math.max(0, currentIndex - index);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);

      return {
        id: `${id}-${step.status}`,
        status: currentStatus === "cancelled" ? "cancelled" 
          : currentStatus === "refunded" ? "refunded"
          : step.status,
        title: step.title,
        description: step.description,
        timestamp: isCompleted ? timestamp.toISOString() : "",
        isCompleted,
        isCurrent,
      };
    }).filter(e => e.isCompleted);

    const tracking = {
      orderId: id,
      status: currentStatus,
      estimatedDelivery: order.estimatedDelivery?.toISOString() || null,
      trackingNumber: order.trackingNumber || null,
      carrier: order.shippingCarrier || null,
      currentStep: Math.max(0, currentIndex),
      events,
      lastUpdated: order.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json({ success: true, tracking });
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    await dbConnect();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (session?.user?.id !== order.userId.toString() && session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentStatus = order.orderStatus?.toLowerCase().replace(" ", "_") || "pending";
    const currentIndex = getStatusIndex(currentStatus);

    const events = STATUS_STEPS.map((step, index) => {
      const isCompleted = currentIndex >= index;
      const isCurrent = currentIndex === index;

      const daysAgo = Math.max(0, currentIndex - index);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);

      return {
        id: `${id}-${step.status}`,
        status: currentStatus === "cancelled" ? "cancelled" 
          : currentStatus === "refunded" ? "refunded"
          : step.status,
        title: step.title,
        description: step.description,
        timestamp: isCompleted ? timestamp.toISOString() : "",
        isCompleted,
        isCurrent,
      };
    }).filter(e => e.isCompleted);

    const tracking = {
      orderId: id,
      status: currentStatus,
      estimatedDelivery: order.estimatedDelivery?.toISOString() || null,
      trackingNumber: order.trackingNumber || null,
      carrier: order.shippingCarrier || null,
      currentStep: Math.max(0, currentIndex),
      events,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, tracking });
  } catch (error) {
    console.error("Error refreshing tracking:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
