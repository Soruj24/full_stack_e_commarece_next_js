import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Coupon } from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal, categoryIds, productIds } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Coupon code is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json(
        { success: false, error: "Coupon is not yet active" },
        { status: 400 }
      );
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return NextResponse.json(
        { success: false, error: "Coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        { success: false, error: `Minimum purchase of $${coupon.minPurchase} required` },
        { status: 400 }
      );
    }

    if (coupon.applicableCategories?.length > 0 && categoryIds) {
      const hasApplicableCategory = categoryIds.some((cat: string) => 
        coupon.applicableCategories.includes(cat)
      );
      if (!hasApplicableCategory) {
        return NextResponse.json(
          { success: false, error: "Coupon not applicable for items in cart" },
          { status: 400 }
        );
      }
    }

    if (coupon.applicableProducts?.length > 0 && productIds) {
      const hasApplicableProduct = productIds.some((prod: string) => 
        coupon.applicableProducts.includes(prod)
      );
      if (!hasApplicableProduct) {
        return NextResponse.json(
          { success: false, error: "Coupon not applicable for items in cart" },
          { status: 400 }
        );
      }
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
