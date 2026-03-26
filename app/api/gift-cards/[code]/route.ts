import { dbConnect } from "@/config/db";
import { GiftCard } from "@/models/GiftCard";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();
    const { code } = await params;

    const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!giftCard) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }

    const isValid = giftCard.isActive && giftCard.remainingBalance > 0 && new Date() < giftCard.expiresAt;

    return NextResponse.json({
      success: true,
      giftCard: {
        code: giftCard.code,
        amount: giftCard.amount,
        remainingBalance: giftCard.remainingBalance,
        currency: giftCard.currency,
        isValid,
        expiresAt: giftCard.expiresAt,
        senderName: giftCard.senderName,
        message: giftCard.message,
      },
    });
  } catch (error) {
    console.error("GiftCard validate Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const { code } = await params;
    const body = await request.json();

    const giftCard = await GiftCard.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $set: body },
      { new: true }
    );

    if (!giftCard) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, giftCard });
  } catch (error) {
    console.error("GiftCard update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const { code } = await params;

    const giftCard = await GiftCard.findOneAndDelete({ code: code.toUpperCase() });

    if (!giftCard) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Gift card deleted" });
  } catch (error) {
    console.error("GiftCard delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
