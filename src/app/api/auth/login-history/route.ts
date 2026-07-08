import { auth } from "@/lib/auth";
import LoginHistory from "@/core/database/models/LoginHistory";
import { dbConnect } from "@/core/config/database";
import { NextResponse } from "next/server";

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

    const history = await LoginHistory.find({ userId: session.user.id })
      .select("email ipAddress device browser os location success reason createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Login history fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
