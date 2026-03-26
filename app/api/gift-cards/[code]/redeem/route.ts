import { dbConnect } from "@/config/db";
import { GiftCard } from "@/models/GiftCard";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await dbConnect();
    const { code } = await params;
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid redemption amount" }, { status: 400 });
    }

    const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!giftCard) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }

    if (!giftCard.isActive) {
      return NextResponse.json({ error: "Gift card is no longer active" }, { status: 400 });
    }

    if (new Date() > giftCard.expiresAt) {
      return NextResponse.json({ error: "Gift card has expired" }, { status: 400 });
    }

    if (giftCard.remainingBalance < amount) {
      return NextResponse.json(
        { error: `Insufficient balance. Available: ${giftCard.remainingBalance}` },
        { status: 400 }
      );
    }

    giftCard.remainingBalance -= amount;
    giftCard.usedBy.push(session.user.id);
    giftCard.usedAt.push(new Date());
    await giftCard.save();

    return NextResponse.json({
      success: true,
      message: `Redeemed ${amount} from gift card`,
      remainingBalance: giftCard.remainingBalance,
      giftCardCode: giftCard.code,
    });
  } catch (error) {
    console.error("GiftCard redeem Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
