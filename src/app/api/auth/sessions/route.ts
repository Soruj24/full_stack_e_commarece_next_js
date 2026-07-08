import { auth } from "@/lib/auth";
import Session from "@/core/database/models/Session";
import { dbConnect } from "@/core/config/database";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const sessions = await Session.find({
      userId: session.user.id,
      revoked: false,
      expires: { $gt: new Date() },
    })
      .select("ipAddress userAgent createdAt expires")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Sessions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
