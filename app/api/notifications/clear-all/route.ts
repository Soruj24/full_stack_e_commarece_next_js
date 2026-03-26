import { dbConnect } from "@/config/db";
import { Notification } from "@/models/Notification";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return Response.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    const { userId } = await request.json();
    const targetUserId = userId || session.user.id;

    await dbConnect();

    await Notification.deleteMany({ userId: targetUserId });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
