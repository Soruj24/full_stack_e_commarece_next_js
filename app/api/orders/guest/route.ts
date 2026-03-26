// app/api/orders/guest/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendOrderStatusEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, paymentIntentId, transactionId, paymentPhoneNumber, shippingCarrier, shippingService, shippingPrice, taxPrice, totalAmount, couponCode, discount, currency, email } = body;

    if (!email || !items || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate items
    await dbConnect();
    let calculatedSubtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product}` },
          { status: 404 },
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 },
        );
      }
      calculatedSubtotal += item.price * item.quantity;
    }

    // Create guest order (no user association)
    const order = await Order.create({
      user: null, // Guest order
      guestEmail: email,
      items,
      totalAmount: calculatedSubtotal + (shippingPrice || 0) + (taxPrice || 0),
      shippingAddress,
      currency: currency || "USD",
      paymentMethod,
      paymentIntentId,
      transactionId,
      paymentPhoneNumber,
      shippingCarrier,
      shippingService,
      shippingPrice,
      taxPrice,
      paymentStatus:
        paymentMethod === "stripe" || paymentMethod === "paypal"
          ? "paid"
          : "pending",
    });

    // Update inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send email notification
    try {
      await sendOrderStatusEmail(
        email,
        order._id.toString().slice(-6).toUpperCase(),
        "Confirmed",
        `${process.env.NEXT_PUBLIC_APP_URL}/orders/guest/${order._id}`,
      );
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        _id: order._id,
        orderNumber: order._id.toString().slice(-6).toUpperCase(),
        totalAmount: order.totalAmount,
        status: order.orderStatus,
      },
      guestId: order._id.toString(),
    });
  } catch (error: unknown) {
    console.error("Guest order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
