import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { Coupon } from "@/models/Coupon";
import { Notification } from "@/models/Notification";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { rewardType } = await req.json();
    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const rewards = {
      "discount-10": {
        cost: 1000,
        value: 10,
        type: "fixed",
        title: "$10 Discount",
      },
      "free-shipping": {
        cost: 500,
        value: 15,
        type: "fixed",
        title: "Free Shipping",
      }, // Fixed $15 off as shipping credit
      "mystery-box": {
        cost: 5000,
        value: 60,
        type: "fixed",
        title: "Mystery Box Coupon",
      },
    };

    const reward = rewards[rewardType as keyof typeof rewards];
    if (!reward) {
      return NextResponse.json(
        { success: false, error: "Invalid reward type" },
        { status: 400 },
      );
    }

    if (user.loyaltyPoints < reward.cost) {
      return NextResponse.json(
        { success: false, error: "Insufficient points" },
        { status: 400 },
      );
    }

    // Deduct points
    user.loyaltyPoints -= reward.cost;
    await user.save();

    // Create a unique coupon code
    const couponCode = `LOYALTY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await Coupon.create({
      code: couponCode,
      discountType: reward.type,
      discountAmount: reward.value,
      minPurchase: rewardType === "discount-10" ? 50 : 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
      isActive: true,
      usageLimit: 1,
      usageCount: 0,
    });

    // Create notification
    await Notification.create({
      userId: user._id,
      title: "Reward Redeemed!",
      message: `You've successfully redeemed ${reward.cost} points for ${reward.title}. Your coupon code is: ${couponCode}`,
      type: "success",
      link: "/dashboard?tab=activity",
    });

    return NextResponse.json({
      success: true,
      message: "Reward redeemed successfully!",
      couponCode,
      newPoints: user.loyaltyPoints,
    });
  } catch (error) {
    console.error("Redemption Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
