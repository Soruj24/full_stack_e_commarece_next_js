import { dbConnect } from "@/config/db";
import { Return } from "@/models/Return";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    await dbConnect();
    const returnReq = await Return.findById(id).populate("orderId");

    if (!returnReq) {
      return NextResponse.json({ error: "Return not found" }, { status: 404 });
    }

    if (returnReq.userId.toString() !== session?.user?.id && session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, return: returnReq });
  } catch (error) {
    console.error("Return GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const { action, trackingNumber, note, refundAmount, refundMethod } = body;

    if (session?.user?.role !== "admin") {
      if (action === "cancel") {
        await dbConnect();
        const returnReq = await Return.findById(id);
        if (!returnReq) {
          return NextResponse.json({ error: "Return not found" }, { status: 404 });
        }
        if (returnReq.userId.toString() !== session?.user?.id) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        if (returnReq.status !== "pending") {
          return NextResponse.json({ error: "Can only cancel pending requests" }, { status: 400 });
        }
        returnReq.status = "cancelled";
        returnReq.notes.push({ by: "user", message: "Return cancelled by customer", createdAt: new Date() });
        await returnReq.save();
        return NextResponse.json({ success: true, return: returnReq });
      }
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const returnReq = await Return.findById(id);
    if (!returnReq) {
      return NextResponse.json({ error: "Return not found" }, { status: 404 });
    }

    const statusFlow: Record<string, string[]> = {
      pending: ["approved", "rejected"],
      approved: ["received"],
      received: ["refunded"],
    };

    if (action) {
      const allowed = statusFlow[returnReq.status] || [];
      if (!allowed.includes(action)) {
        return NextResponse.json({ error: `Invalid action for status: ${returnReq.status}` }, { status: 400 });
      }
      returnReq.status = action as typeof returnReq.status;
    }

    if (trackingNumber) returnReq.trackingNumber = trackingNumber;
    if (refundAmount !== undefined) returnReq.refundAmount = refundAmount;
    if (refundMethod) returnReq.refundMethod = refundMethod;

    if (note) {
      returnReq.notes.push({ by: "admin", message: note, createdAt: new Date() });
    }

    if (action === "approved") {
      returnReq.notes.push({ by: "system", message: "Return approved. Please ship the items back.", createdAt: new Date() });
    }

    if (action === "refunded") {
      returnReq.notes.push({ by: "system", message: `Refund of $${returnReq.refundAmount} processed via ${returnReq.refundMethod}.`, createdAt: new Date() });
      await Order.findByIdAndUpdate(returnReq.orderId, { status: "refunded" });
    }

    await returnReq.save();

    return NextResponse.json({ success: true, return: returnReq });
  } catch (error) {
    console.error("Return PATCH Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
