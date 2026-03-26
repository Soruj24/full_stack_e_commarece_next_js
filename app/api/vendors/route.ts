import { dbConnect } from "@/config/db";
import { Vendor } from "@/models/Vendor";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const session = await auth();

    const filter: Record<string, unknown> = {};

    if (session?.user?.role === "admin") {
      if (status) filter.status = status;
    } else if (session?.user?.id) {
      filter.userId = session.user.id;
    } else {
      const slug = searchParams.get("slug");
      if (slug) {
        filter.storeSlug = slug;
        filter.status = "approved";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const vendors = await Vendor.find(filter)
      .populate("userId", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, vendors });
  } catch (error) {
    console.error("Vendor GET Error:", error);
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
    const { storeName, storeDescription, contactEmail, contactPhone, address } = body;

    if (!storeName || !contactEmail) {
      return NextResponse.json({ error: "Store name and email are required" }, { status: 400 });
    }

    await dbConnect();

    const existingVendor = await Vendor.findOne({ userId: session.user.id });
    if (existingVendor) {
      return NextResponse.json({ error: "You already have a vendor account" }, { status: 400 });
    }

    const storeSlug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slugExists = await Vendor.findOne({ storeSlug });
    const finalSlug = slugExists ? `${storeSlug}-${Date.now()}` : storeSlug;

    const vendor = await Vendor.create({
      userId: session.user.id,
      storeName,
      storeSlug: finalSlug,
      storeDescription,
      contactEmail,
      contactPhone,
      address,
      status: "pending",
    });

    return NextResponse.json({ success: true, vendor });
  } catch (error) {
    console.error("Vendor POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
