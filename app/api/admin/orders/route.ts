import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Order } from "@/models/Order";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";
import { Notification } from "@/models/Notification";
import { User } from "@/models/User";
import { sendOrderStatusEmail } from "@/lib/email";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const keyword = searchParams.get("keyword") || "";
    const skip = (page - 1) * limit;

    const query: Record<string, string | object | undefined> = {};
    if (status) query.orderStatus = status;
    if (keyword) {
      query.$or = [
        { _id: mongoose.Types.ObjectId.isValid(keyword) ? keyword : undefined },
        { "shippingAddress.name": { $regex: keyword, $options: "i" } },
        { "shippingAddress.email": { $regex: keyword, $options: "i" } },
      ].filter(
        (q) => q._id !== undefined || q["shippingAddress.name"] !== undefined,
      );
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    await dbConnect();
    const { orderId, orderStatus, paymentStatus, trackingNumber } = await req.json();

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(trackingNumber && { trackingNumber }),
      },
      { new: true },
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Log the action
    await logAction({
      action: "ORDER_UPDATE",
      userId: (session as { user?: { id?: string } })?.user?.id || "",
      userEmail: (session as { user?: { email?: string } })?.user?.email || "",
      entityType: "ORDER",
      entityId: orderId,
      changes: { orderStatus, paymentStatus, trackingNumber },
    });

    // Notify User
    if (orderStatus || paymentStatus) {
      try {
        const user = await User.findById(order.user);
        if (user) {
          const orderNum = order._id.toString().slice(-6).toUpperCase();
          const updateMsg = orderStatus
            ? `Your order #${orderNum} status has been updated to ${orderStatus}.`
            : `Your order #${orderNum} payment status is now ${paymentStatus}.`;

          // In-app
          await Notification.create({
            userId: user._id,
            title: "Order Update",
            message: updateMsg,
            type: orderStatus === "delivered" ? "success" : "info",
            link: `/profile/orders/${order._id}`,
          });

          // Email
          if (orderStatus) {
            await sendOrderStatusEmail(
              user.email,
              orderNum,
              orderStatus,
              `${process.env.NEXT_PUBLIC_APP_URL}/profile/orders/${order._id}`,
            );
          }
        }
      } catch (notifyError) {
        console.error("Admin order notify error:", notifyError);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
