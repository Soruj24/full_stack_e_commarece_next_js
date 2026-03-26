import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { logAction } from "@/lib/audit";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    await dbConnect();

    const secret = authenticator.generateSecret();
    const issuer = "User Management System";
    const otpauth = authenticator.keyuri(session.user.email, issuer, secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    const user = await User.findById(session.user.id).select("+twoFactorSecret");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;
    await user.save();

    await logAction({
      action: "2FA_SETUP_INITIATED",
      userId: session.user.id,
      userEmail: session.user.email,
      entityType: "USER",
      entityId: session.user.id,
      changes: { issuer }
    });

    return NextResponse.json({ qrCodeUrl, secret });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
