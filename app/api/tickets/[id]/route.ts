import { dbConnect } from "@/config/db";
import { SupportTicket } from "@/models/SupportTicket";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    await dbConnect();
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.userId?.toString() !== session?.user?.id && session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Ticket GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const body = await request.json();

    await dbConnect();
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const isAdmin = session?.user?.role === "admin";
    const isOwner = ticket.userId?.toString() === session?.user?.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (body.message && isOwner) {
      ticket.messages.push({
        sender: "user",
        message: body.message,
        createdAt: new Date(),
      });
    }

    if (isAdmin) {
      if (body.adminMessage) {
        ticket.messages.push({
          sender: "support",
          message: body.adminMessage,
          createdAt: new Date(),
        });
      }
      if (body.status) ticket.status = body.status;
      if (body.priority) ticket.priority = body.priority;
    }

    await ticket.save();

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Ticket PATCH Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
