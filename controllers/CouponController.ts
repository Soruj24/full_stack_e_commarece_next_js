import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Coupon } from "@/models/Coupon";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";

export async function validateCoupon(req: NextRequest) {
  try {
    const { code, cartTotal, categoryIds, productIds } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    await dbConnect();
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 404 });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json({ success: false, error: "Coupon is not yet active" }, { status: 400 });
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return NextResponse.json({ success: false, error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return NextResponse.json({ success: false, error: `Minimum purchase of $${coupon.minPurchase} required` }, { status: 400 });
    }

    if (coupon.applicableCategories?.length > 0 && categoryIds) {
      const hasApplicable = categoryIds.some((cat: string) => coupon.applicableCategories.includes(cat));
      if (!hasApplicable) {
        return NextResponse.json({ success: false, error: "Coupon not applicable for items in cart" }, { status: 400 });
      }
    }

    if (coupon.applicableProducts?.length > 0 && productIds) {
      const hasApplicable = productIds.some((prod: string) => coupon.applicableProducts.includes(prod));
      if (!hasApplicable) {
        return NextResponse.json({ success: false, error: "Coupon not applicable for items in cart" }, { status: 400 });
      }
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount, minPurchase: coupon.minPurchase, maxDiscount: coupon.maxDiscount },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}

export async function getCoupons(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const coupons = await Coupon.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
    const total = await Coupon.countDocuments();

    return NextResponse.json({ success: true, coupons, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function createCoupon(req: NextRequest) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await req.json();
    await dbConnect();

    const coupon = await Coupon.create({
      ...body,
      code: body.code?.toUpperCase(),
    }) as unknown as { _id: { toString: () => string }; code: string };

    await logAction({
      action: "COUPON_CREATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "COUPON",
      entityId: coupon._id.toString(),
      changes: { code: coupon.code },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 500 });
  }
}