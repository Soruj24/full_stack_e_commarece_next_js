import { NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { dbConnect } from "@/config/db";
import { User } from "@/lib/mongodb/models/User";
import bcrypt from "bcryptjs";
import { logAction } from "@/lib/audit";

export async function getSession() {
  try {
    const session = await auth();
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get session" }, { status: 500 });
  }
}

export async function validateToken() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select("role status");

    if (!user || user.status === "banned") {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true, role: user.role });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}

export async function registerUser(req: Request) {
  try {
    const { name, email, password, referrerCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email and password required" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let referralCode: string | undefined;
    let referredBy: string | undefined;

    if (referrerCode) {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (referrer) {
        referredBy = referrer._id.toString();
      }
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      referralCode: `UM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      referredBy,
      isVerified: false,
      status: "active",
    });

    await logAction({
      action: "USER_REGISTER",
      userId: user._id.toString(),
      userEmail: user.email,
      entityType: "USER",
      entityId: user._id.toString(),
    });

    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}

export async function changePassword(req: Request) {
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

    await logAction({
      action: "PASSWORD_CHANGE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "USER",
      entityId: session.user.id,
    });

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Password change failed" }, { status: 500 });
  }
}