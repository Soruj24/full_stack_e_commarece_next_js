import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function updateProfile(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, image, address, preferences } = body;

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, phone, image, address, preferences },
      { new: true }
    ).select("-password");

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}

export async function changeUserPassword(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Current and new password required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select("+password");

    if (!user?.password) {
      return NextResponse.json({ success: false, error: "No password set" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Current password incorrect" }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to change password" }, { status: 500 });
  }
}