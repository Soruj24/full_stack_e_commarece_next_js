import { dbConnect } from "@/core/config/database";
import { Faq } from "@/core/database/models/Faq";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    const { id } = await params;
    const body = await request.json();

    await dbConnect();

    const faq = await Faq.findByIdAndUpdate(id, body, { new: true });
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("FAQ PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    const { id } = await params;

    await dbConnect();

    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("FAQ DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
