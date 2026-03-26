import { checkRole } from "@/lib/rbac";
import { dbConnect } from "@/config/db";
import Settings from "@/models/Settings";
import { NextResponse } from "next/server";
import { settingsSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { logAction } from "@/lib/audit";

export async function GET() {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await request.json();
    const validation = settingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(((session as unknown) as { user: { id: string } }).user.id)) {
      return NextResponse.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    const data = validation.data;
    await dbConnect();

    let settings = await Settings.findOne();
    if (settings) {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { ...data, updatedBy: ((session as unknown) as { user: { id: string } }).user.id },
        { new: true }
      );
    } else {
      settings = await Settings.create({ ...data, updatedBy: ((session as unknown) as { user: { id: string } }).user.id });
    }

    // Log the action
    await logAction({
      action: "SETTINGS_UPDATE",
      userId: ((session as unknown) as { user: { id: string } }).user.id,
      userEmail: ((session as unknown) as { user: { email: string } }).user.email,
      entityType: "SETTINGS",
      entityId: settings._id.toString(),
      changes: data
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
