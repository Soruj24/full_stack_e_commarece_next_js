import { auth } from "@/lib/auth";
import Session from "@/core/database/models/Session";
import LoginHistory from "@/core/database/models/LoginHistory";
import { dbConnect } from "@/core/config/database";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const targetSession = await Session.findById(id);

    if (!targetSession) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    if (targetSession.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    targetSession.revoked = true;
    await targetSession.save();

    await LoginHistory.updateMany(
      { sessionId: id },
      { $set: { reason: "Session revoked by user" } }
    );

    await logAction({
      action: "SESSION_REVOKED",
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      entityType: "SESSION",
      entityId: id,
      changes: {},
    });

    return NextResponse.json({ success: true, message: "Session revoked" });
  } catch (error) {
    console.error("Session revoke error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
