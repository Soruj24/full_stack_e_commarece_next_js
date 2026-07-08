import { dbConnect } from "@/core/config/database";
import { User } from "@/core/database/models/User";
import { sendVerificationOTP } from "@/lib/email";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redisRateLimit } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    const { success, remaining } = await redisRateLimit(ip, 2, 60);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": remaining.toString() },
        }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOTP = verificationOTP;
    user.verificationOTPExpires = verificationOTPExpires;
    await user.save();

    await sendVerificationOTP(email, verificationOTP);

    return NextResponse.json({
      success: true,
      message: "Verification code resent to your email",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
