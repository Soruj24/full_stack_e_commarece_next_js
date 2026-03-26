import { dbConnect } from "@/config/db";
import { Payout } from "@/models/Payout";
import { Vendor } from "@/models/Vendor";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await auth();

    const filter: Record<string, unknown> = {};

    if (session?.user?.role === "admin") {
      const vendorId = searchParams.get("vendorId");
      if (vendorId) filter.vendorId = vendorId;
    } else if (session?.user?.id) {
      const vendor = await Vendor.findOne({ userId: session.user.id });
      if (!vendor) return NextResponse.json({ error: "No vendor account" }, { status: 404 });
      filter.vendorId = vendor._id;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payouts = await Payout.find(filter)
      .populate("vendorId", "storeName")
      .sort({ requestedAt: -1 });

    return NextResponse.json({ success: true, payouts });
  } catch (error) {
    console.error("Payout GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await dbConnect();

    const vendor = await Vendor.findOne({ userId: session.user.id });
    if (!vendor) {
      return NextResponse.json({ error: "No vendor account" }, { status: 404 });
    }

    if (vendor.status !== "approved") {
      return NextResponse.json({ error: "Vendor account not approved" }, { status: 400 });
    }

    if (amount > vendor.commissionBalance) {
      return NextResponse.json({ error: "Amount exceeds available balance" }, { status: 400 });
    }

    const payout = await Payout.create({
      vendorId: vendor._id,
      amount,
      paymentMethod: paymentMethod || "bank_transfer",
      status: "pending",
    });

    vendor.pendingPayout += amount;
    vendor.commissionBalance -= amount;
    await vendor.save();

    return NextResponse.json({ success: true, payout });
  } catch (error) {
    console.error("Payout POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
