import { dbConnect } from "@/config/db";
import { Vendor } from "@/models/Vendor";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    await dbConnect();
    const vendor = await Vendor.findById(id).populate("userId", "name email image");

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (vendor.status !== "approved" && vendor.userId._id.toString() !== session?.user?.id && session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor });
  } catch (error) {
    console.error("Vendor GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const body = await request.json();

    await dbConnect();
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const isOwner = vendor.userId.toString() === session?.user?.id;
    const isAdmin = session?.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const allowedFields = isAdmin
      ? ["status", "commissionRate", "rejectedReason", "reviewedBy", "reviewedAt"]
      : ["storeName", "storeDescription", "storeLogo", "storeBanner", "contactEmail", "contactPhone", "address", "bankDetails"];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (isAdmin && body.status === "approved") {
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = session.user.id;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, vendor: updatedVendor });
  } catch (error) {
    console.error("Vendor PATCH Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
