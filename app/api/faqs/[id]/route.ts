import { dbConnect } from "@/config/db";
import { Faq } from "@/models/Faq";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const faq = await Faq.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("FAQ GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    await Faq.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FAQ DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
