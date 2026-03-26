import { dbConnect } from "@/config/db";
import { GiftCard } from "@/models/GiftCard";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

function generateGiftCardCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    const userId = searchParams.get("userId");
    if (userId) filter.purchasedBy = userId;

    const [giftCards, total] = await Promise.all([
      GiftCard.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      GiftCard.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      giftCards,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GiftCard GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await request.json();
    const { amount, recipientName, recipientEmail, senderName, senderEmail, message, currency = "USD", expiresInDays = 365 } = body;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await dbConnect();

    let code = generateGiftCardCode();
    let exists = await GiftCard.findOne({ code });
    while (exists) {
      code = generateGiftCardCode();
      exists = await GiftCard.findOne({ code });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const giftCard = await GiftCard.create({
      code,
      amount,
      remainingBalance: amount,
      currency,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      message,
      expiresAt,
    });

    return NextResponse.json({ success: true, giftCard });
  } catch (error) {
    console.error("GiftCard POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
