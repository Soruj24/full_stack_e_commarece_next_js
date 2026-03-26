import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import AuditLog from "@/models/AuditLog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Admin audit logs fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
