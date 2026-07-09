import { NextResponse } from "next/server";

const NOTIFICATIONS = [
  {
    id: "notif_001",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-10492 has been placed for $249.99",
    severity: "info",
    isRead: false,
    createdAt: "2026-07-09T14:32:00Z",
    link: "/admin/orders/ORD-10492",
    user: { id: "usr_042", name: "John Doe", avatar: "/images/avatars/user_042.jpg" },
  },
  {
    id: "notif_002",
    type: "alert",
    title: "Low Stock Alert",
    message: "Wireless Bluetooth Headphones is running low (8 units remaining)",
    severity: "warning",
    isRead: false,
    createdAt: "2026-07-09T12:15:00Z",
    link: "/admin/products/prod_1001",
    user: null,
  },
  {
    id: "notif_003",
    type: "review",
    title: "New 1-Star Review",
    message: "A customer left a 1-star review on 'Smart Watch Pro Max'",
    severity: "critical",
    isRead: false,
    createdAt: "2026-07-09T10:45:00Z",
    link: "/admin/products/prod_1002/reviews",
    user: { id: "usr_187", name: "Jane Smith", avatar: "/images/avatars/user_187.jpg" },
  },
  {
    id: "notif_004",
    type: "payment",
    title: "Payment Failed",
    message: "Payment for order #ORD-10488 failed. Customer notified.",
    severity: "error",
    isRead: true,
    createdAt: "2026-07-08T22:10:00Z",
    link: "/admin/orders/ORD-10488",
    user: null,
  },
  {
    id: "notif_005",
    type: "system",
    title: "System Update Complete",
    message: "Platform v3.2.1 deployed successfully. Downtime: 2 minutes.",
    severity: "info",
    isRead: true,
    createdAt: "2026-07-08T03:00:00Z",
    link: null,
    user: null,
  },
  {
    id: "notif_006",
    type: "user",
    title: "New Vendor Registration",
    message: "TechGear Inc. has registered as a vendor and awaits approval.",
    severity: "info",
    isRead: true,
    createdAt: "2026-07-07T16:20:00Z",
    link: "/admin/vendors/ven_023",
    user: { id: "ven_023", name: "TechGear Inc.", avatar: null },
  },
  {
    id: "notif_007",
    type: "order",
    title: "Refund Requested",
    message: "Refund request for order #ORD-10475 ($129.99) requires review.",
    severity: "warning",
    isRead: true,
    createdAt: "2026-07-07T09:30:00Z",
    link: "/admin/orders/ORD-10475/refund",
    user: { id: "usr_091", name: "Alice Johnson", avatar: "/images/avatars/user_091.jpg" },
  },
  {
    id: "notif_008",
    type: "marketing",
    title: "Campaign Ended",
    message: "Summer Sale 2026 campaign ended. Total revenue: $48,230. ROI: 320%.",
    severity: "info",
    isRead: true,
    createdAt: "2026-07-06T23:59:00Z",
    link: "/admin/marketing/campaigns/summer-2026",
    user: null,
  },
];

export async function GET() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.isRead).length;
  return NextResponse.json({
    success: true,
    data: {
      notifications: NOTIFICATIONS,
      unreadCount,
      totalCount: NOTIFICATIONS.length,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { type, title, message, severity = "info", link = null, user = null } = body;

  if (!title || !message) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: title, message" },
      { status: 400 },
    );
  }

  const notification = {
    id: `notif_${String(Date.now()).slice(-6)}`,
    type: type || "general",
    title,
    message,
    severity,
    isRead: false,
    createdAt: new Date().toISOString(),
    link,
    user,
  };

  return NextResponse.json(
    { success: true, data: notification },
    { status: 201 },
  );
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing required field: id" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: { id, deletedAt: new Date().toISOString() },
    message: "Notification deleted",
  });
}
