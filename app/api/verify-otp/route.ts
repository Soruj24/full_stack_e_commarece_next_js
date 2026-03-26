import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Ensure types are consistent
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
      console.log(`OTP Missing in DB for ${email}`);
      return NextResponse.json({ error: "Verification code not found. Please register again." }, { status: 400 });
    }

    if (user.verificationOTPExpires < new Date()) {
      console.log(`OTP Expired for ${email}: Expired at ${user.verificationOTPExpires}, current time ${new Date()}`);
      return NextResponse.json({ error: "Verification code has expired. Please register again." }, { status: 400 });
    }

    if (user.verificationOTP !== otp) {
      console.log(`OTP Mismatch for ${email}: Expected ${user.verificationOTP}, got ${otp}`);
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Email verified successfully. You can now login." 
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
