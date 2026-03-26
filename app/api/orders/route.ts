// app/api/orders/route.ts
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

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      console.error("Order validation error:", validation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid order data",
        },
        { status: 400 },
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

    // Validate Payment Intent for Stripe
    if (paymentMethod === "stripe" && !paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed. Please try again.",
        },
        { status: 400 },
      );
    }

    // Validate Mobile Banking Payments
    if (["bkash", "nagad", "rocket"].includes(paymentMethod)) {
      if (!transactionId || !paymentPhoneNumber) {
        return NextResponse.json(
          {
            success: false,
            error: "Transaction ID and Phone Number are required.",
          },
          { status: 400 },
        );
      }
    }

    await dbConnect();

    // 1. Calculate total amount
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

    const finalTotal =
      calculatedSubtotal + (shippingPrice || 0) + (taxPrice || 0);

    const order = await Order.create({
      user: session.user.id,
      items,
      totalAmount: finalTotal,
      shippingAddress,
    currency: (validation.data as { currency?: string }).currency || "USD",
      paymentMethod,
      paymentIntentId,
      transactionId,
      paymentPhoneNumber,
      shippingCarrier,
      shippingService,
      shippingPrice,
      taxPrice,
      paymentStatus:
        paymentMethod === "cod" ||
        ["bkash", "nagad", "rocket"].includes(paymentMethod)
          ? "pending"
          : "paid",
    });

    // 2. Log the action
    await logAction({
      action: "ORDER_PLACED",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "ORDER",
      entityId: order._id.toString(),
      changes: { totalAmount: finalTotal, itemsCount: items.length },
    });

    // 3. Update inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 4. Send Notifications and Award Loyalty Points
    try {
      // Award Points (1 point per dollar spent)
      const pointsEarned = Math.floor(finalTotal);
      const user = await User.findById(session.user.id);

      if (user) {
        user.loyaltyPoints += pointsEarned;

        // Update Membership Tier
        if (user.loyaltyPoints >= 10000) user.membershipTier = "platinum";
        else if (user.loyaltyPoints >= 5000) user.membershipTier = "gold";
        else if (user.loyaltyPoints >= 1000) user.membershipTier = "silver";

        await user.save();

        // Notify user about points earned
        await Notification.create({
          userId: session.user.id,
          title: "Loyalty Points Earned!",
          message: `You've earned ${pointsEarned} points from your order. Your total is now ${user.loyaltyPoints}.`,
          type: "success",
          link: "/profile?tab=loyalty",
        });

        // Send SMS if enabled
        if (user.phoneNumber && user.preferences?.smsNotifications) {
          await sendOrderUpdateSMS(
            user.phoneNumber,
            order._id.toString(),
            "placed",
          );
        }
      }

      // In-app notification for order success
      await Notification.create({
        userId: session.user.id,
        title: "Order Placed Successfully",
        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} for $${finalTotal.toFixed(2)} has been placed.`,
        type: "success",
        link: `/profile/orders/${order._id}`,
      });

      // Email notification
      if (session.user.email) {
        await sendOrderStatusEmail(
          session.user.email,
          order._id.toString().slice(-6).toUpperCase(),
          "Confirmed",
          `${process.env.NEXT_PUBLIC_APP_URL}/profile/orders/${order._id}`,
        );
      }
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
      // Don't fail the order if notification fails
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();
    const orders = await Order.find({ user: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
