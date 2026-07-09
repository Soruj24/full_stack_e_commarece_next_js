import { dbConnect } from "@/core/config/database";
import { SupportTicket } from "@/core/database/models/SupportTicket";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await auth();

    const filter: Record<string, unknown> = {};

    if (session?.user?.role === "admin") {
      const status = searchParams.get("status");
      const category = searchParams.get("category");
      if (status) filter.status = status;
      if (category) filter.category = category;
    } else if (session?.user?.id) {
      filter.userId = session.user.id;
    } else {
      const email = searchParams.get("email");
      if (email) filter.email = email;
      else return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SupportTicket.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      tickets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Tickets GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { email, name, subject, category, message, priority = "medium" } = body;

    if (!email || !name || !subject || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const ticket = await SupportTicket.create({
      userId: session?.user?.id,
      email,
      name,
      subject,
      category,
      priority,
      status: "open",
      messages: [{
        sender: "user",
        message,
        createdAt: new Date(),
      }],
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Tickets POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
