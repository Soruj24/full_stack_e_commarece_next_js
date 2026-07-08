import { dbConnect } from "@/core/config/database";
import { User } from "@/core/database/models/User";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redisRateLimit } from "@/lib/redis";
import { logAction } from "@/lib/audit";
import LoginHistory from "@/core/database/models/LoginHistory";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    const { success, remaining } = await redisRateLimit(ip, 5, 60);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": remaining.toString() },
        }
      );
    }

    let { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    email = email.toString().toLowerCase().trim();
    otp = otp.toString().trim();

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "User is already verified" }, { status: 400 });
    }

    if (!user.verificationOTP || !user.verificationOTPExpires) {
      return NextResponse.json({ error: "Verification code not found. Please register again." }, { status: 400 });
    }

    if (user.verificationOTPExpires < new Date()) {
      return NextResponse.json({ error: "Verification code has expired. Please register again." }, { status: 400 });
    }

    if (user.verificationOTP !== otp) {
      await logAction({
        action: "LOGIN_FAILED",
        userId: user._id.toString(),
        userEmail: user.email,
        entityType: "USER",
        entityId: user._id.toString(),
        changes: { reason: "Invalid verification OTP" },
      });

      try {
        await LoginHistory.create({
          userId: user._id,
          email: user.email,
          ipAddress: ip,
          userAgent,
          success: false,
          reason: "Invalid verification OTP",
        });
      } catch {}

      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
