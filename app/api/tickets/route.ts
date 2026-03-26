import { dbConnect } from "@/config/db";
import { SupportTicket } from "@/models/SupportTicket";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

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

    const tickets = await SupportTicket.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, tickets });
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
