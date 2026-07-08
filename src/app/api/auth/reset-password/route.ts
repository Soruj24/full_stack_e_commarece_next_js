import { dbConnect } from "@/core/config/database";
import { User } from "@/core/database/models/User";
import Session from "@/core/database/models/Session";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redisRateLimit } from "@/lib/redis";
import { logAction } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    const { success, remaining } = await redisRateLimit(ip, 5, 300);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": remaining.toString() },
        }
      );
    }

    const body = await request.json();
    const { token } = body;
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { password } = validation.data;
    await dbConnect();

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await Session.updateMany(
      { userId: user._id, revoked: false },
      { revoked: true }
    );

    await User.findByIdAndUpdate(user._id, {
      $unset: { refreshToken: "" },
    });

    await logAction({
      action: "PASSWORD_RESET_SUCCESS",
      userId: user._id.toString(),
      userEmail: user.email,
      entityType: "USER",
      entityId: user._id.toString(),
      changes: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
