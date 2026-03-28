import { dbConnect } from "@/config/db";
import { Notification } from "@/models/Notification";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = request.nextUrl.searchParams.get("userId");
    const targetUserId = userId || session?.user?.id;
    
    if (!targetUserId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return Response.json({ notifications: [] });
    }

    const notifications = await Notification.find({ userId: targetUserId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedNotifications = notifications.map((n) => ({
      _id: n._id.toString(),
      userId: n.userId.toString(),
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.isRead,
      link: n.link,
      createdAt: n.createdAt.toISOString(),
    }));

    return Response.json({ notifications: formattedNotifications });
  } catch (error) {
    console.warn("Error fetching notifications:", error);
    return Response.json({ notifications: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return Response.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    const { isRead } = await request.json();
    await dbConnect();

    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { isRead: true }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.warn("Error updating notification:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return Response.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    const { id } = await request.json();
    await dbConnect();

    await Notification.findOneAndDelete({ _id: id, userId: session.user.id });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    console.warn("Error marking all as read:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
