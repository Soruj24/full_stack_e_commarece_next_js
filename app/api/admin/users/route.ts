// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";
import { adminUpdateUserSchema, adminDeleteUserSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });

    // Transform _id to id for the frontend
    const transformedUsers = users.map(user => ({
      ...user.toObject(),
      id: user._id.toString()
    }));

    return NextResponse.json({ success: true, users: transformedUsers });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await req.json();
    const validation = adminUpdateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid data",
        },
        { status: 400 },
      );
    }

    const { userId, ...updateData } = validation.data;
    await dbConnect();

    // Prevent self-demotion or banning
    if (userId === session.user.id && (updateData.role || updateData.status)) {
      return NextResponse.json(
        { success: false, error: "You cannot modify your own role or status" },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Log the action
    if (updateData.role || updateData.status || updateData.name) {
      await logAction({
        action: "USER_UPDATE",
        userId: session.user.id,
        userEmail: session.user.email!,
        entityType: "USER",
        entityId: userId,
        changes: updateData,
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: { ...user.toObject(), id: user._id.toString() } 
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await req.json();
    const validation = adminDeleteUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid data",
        },
        { status: 400 },
      );
    }

    const { userId } = validation.data;
    await dbConnect();

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    await logAction({
      action: "USER_DELETE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "USER",
      entityId: userId,
      changes: { deletedUserEmail: user.email },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
