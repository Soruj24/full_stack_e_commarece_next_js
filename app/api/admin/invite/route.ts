import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import Token from "@/models/Token";
import { sendInvitationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Generate invitation token
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create a temporary user or just store the token?
    // Let's create a placeholder user with no password
    const placeholderUser = await User.create({
      email,
      name: name || email.split("@")[0],
      role: role || "user",
      isVerified: false,
    });

    await Token.create({
      userId: placeholderUser._id,
      token: inviteToken,
      type: "invite",
      expiresAt,
    });

    const inviteLink = `${process.env.NEXTAUTH_URL}/accept-invite?token=${inviteToken}`;

    await sendInvitationEmail(
      email,
      inviteLink,
      session.user.name || "Administrator",
    );

    return NextResponse.json({ message: "Invitation sent successfully" });
  } catch (error: unknown) {
    console.error("Invite Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
