import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { auth } from "@/auth";
import { logAction } from "@/lib/audit";
import { orderSchema } from "@/lib/validations";
import { Notification } from "@/models/Notification";
import { sendOrderStatusEmail } from "@/lib/email";
import { User } from "@/models/User";
import { sendOrderUpdateSMS } from "@/lib/sms";

export async function createOrder(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Invalid order data" },
        { status: 400 }
      );
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
      transactionId,
      paymentPhoneNumber,
      shippingCarrier,
      shippingService,
      shippingPrice,
      taxPrice,
    } = validation.data;

    if (paymentMethod === "stripe" && !paymentIntentId) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    if (["bkash", "nagad", "rocket"].includes(paymentMethod)) {
      if (!transactionId || !paymentPhoneNumber) {
        return NextResponse.json(
          { success: false, error: "Transaction ID and Phone Number are required" },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    let calculatedSubtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.product} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemPrice = product.price * item.quantity;
      calculatedSubtotal += itemPrice;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images?.[0],
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const shippingCost = shippingPrice || 0;
    const tax = taxPrice || 0;
    const total = calculatedSubtotal + shippingCost + tax;

    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
      transactionId,
      paymentPhoneNumber,
      subtotal: calculatedSubtotal,
      shippingCost,
      tax,
      total,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      shippingCarrier,
      shippingService,
    });

    await Notification.create({
      userId: session.user.id,
      title: "Order Placed",
      message: `Your order #${order._id} has been placed successfully`,
      type: "success",
      link: `/orders/${order._id}`,
    });

    const user = await User.findById(session.user.id);
    /* SMS functionality can be enabled when SMS provider is configured
    if (user?.phone) {
      await sendOrderUpdateSMS(user.phone, order._id.toString(), "placed");
    }
    */

    await logAction({
      action: "ORDER_CREATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "ORDER",
      entityId: order._id.toString(),
      changes: { total: order.total, items: orderItems.length },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function getOrders(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (session.user.role === "user") {
      filter.user = session.user.id;
    } else {
      const status = searchParams.get("status");
      if (status) filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      success: true,
      orders,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 }
    );
  }
}