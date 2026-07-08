import { auth } from "@/lib/auth";
import Session from "@/core/database/models/Session";
import { User } from "@/core/database/models/User";
import { dbConnect } from "@/core/config/database";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const currentSessionId = (session.user as unknown as { sessionId?: string }).sessionId;

    if (currentSessionId) {
      await Session.updateMany(
        {
          userId: session.user.id,
          _id: { $ne: currentSessionId },
          revoked: false,
        },
        { revoked: true }
      );
    } else {
      await Session.updateMany(
        { userId: session.user.id, revoked: false },
        { revoked: true }
      );
    }

    await User.findByIdAndUpdate(session.user.id, {
      $unset: { refreshToken: "" },
    });

    await logAction({
      action: "SESSION_REVOKED",
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      entityType: "USER",
      entityId: session.user.id,
      changes: { reason: "Logout all devices" },
    });

    return NextResponse.json({
      success: true,
      message: "All other devices logged out",
    });
  } catch (error) {
    console.error("Revoke all sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
