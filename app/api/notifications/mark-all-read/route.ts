import { dbConnect } from "@/config/db";
import { Notification } from "@/models/Notification";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return Response.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    await dbConnect();

    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { isRead: true }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
