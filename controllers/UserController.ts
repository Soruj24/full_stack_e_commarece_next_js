import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { auth } from "@/auth";

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

