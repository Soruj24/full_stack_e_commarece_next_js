import { dbConnect } from "@/config/db";
import { sendVerificationOTP } from "@/lib/email";
import { User } from "@/models/User";
import Settings from "@/models/Settings";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { registerSchema } from "@/lib/validations";
import { redisRateLimit } from "@/lib/redis";
import { logAction } from "@/lib/audit";
export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    const { success, remaining } = await redisRateLimit(ip, 3, 60);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": remaining.toString() },
        }
      );
    }

    try {
      await dbConnect();
    } catch (e) {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    try {
      const settings = await Settings.findOne();
      if (settings && settings.allowRegistration === false) {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
          return Response.json(
            { error: "Registration is currently disabled by administrator." },
            { status: 403 }
          );
        }
      }
    } catch {
      return NextResponse.json(
        { error: "Database unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { referralCode: refCode } = body;
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password, image } = validation.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json({ error: "User already exists" }, { status: 400 });
      }

      // If user exists but is not verified, update their info and send new OTP
      const hashedPassword = await bcrypt.hash(password, 12);
      const verificationOTP = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.image = image;
      existingUser.verificationOTP = verificationOTP;
      existingUser.verificationOTPExpires = verificationOTPExpires;
      await existingUser.save();

      await sendVerificationOTP(email, verificationOTP);

      return Response.json(
        {
          success: true,
          message: "A new verification OTP has been sent to your email",
          email: email,
        },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check for referral
    let referredBy = null;
    if (refCode) {
      const referrer = await User.findOne({ referralCode: refCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Check if it's the first user, if so make them admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    // Create verification OTP (6 digit number)
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
      role,
      isVerified: role === "admin", // Admin is auto-verified
      verificationOTP: role === "admin" ? undefined : verificationOTP,
      verificationOTPExpires:
        role === "admin" ? undefined : verificationOTPExpires,
      referredBy,
      referralCode: `UM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    });

    // Log the action
    await logAction({
      action: "SIGNUP_SUCCESS",
      userId: user._id.toString(),
      userEmail: user.email,
      entityType: "USER",
      entityId: user._id.toString(),
      changes: { role }
    });

    // Send verification OTP if not admin
    if (role !== "admin") {
      await sendVerificationOTP(email, verificationOTP);
    }

    return Response.json(
      {
        success: true,
        message:
          role === "admin"
            ? "Admin registered"
            : "Verification OTP sent to your email",
        email: role === "admin" ? null : email, // Only return email if verification is needed
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
