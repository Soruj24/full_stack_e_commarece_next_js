import { dbConnect } from "@/config/db";
import { Notification } from "@/models/Notification";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getNotifications(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const filter: Record<string, unknown> = { userId: session.user.id };
    if (unreadOnly) filter.isRead = false;

    const notifications = await Notification.find(filter as object)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Notification.countDocuments(filter as object);
    const unreadCount = await Notification.countDocuments({ userId: session.user.id, isRead: false });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function markAsRead(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await Notification.findOneAndUpdate({ _id: id, userId: session.user.id }, { isRead: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to mark as read" }, { status: 500 });
  }
}

export async function markAllAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await Notification.updateMany({ userId: session.user.id, isRead: false }, { isRead: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to mark all as read" }, { status: 500 });
  }
}

export async function deleteNotification(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await Notification.findOneAndDelete({ _id: id, userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete notification" }, { status: 500 });
  }
}

export async function clearAllNotifications() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await Notification.deleteMany({ userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to clear notifications" }, { status: 500 });
  }
}