import { dbConnect } from "@/config/db";
import Token from "@/models/Token";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, name, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const tokenDoc = await Token.findOne({
      token,
      type: "invite",
      expiresAt: { $gt: new Date() },
      revoked: false,
    });

    if (!tokenDoc) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.name = name || user.name;
    user.password = hashedPassword;
    user.isVerified = true;
    await user.save();

    // Revoke the token
    tokenDoc.revoked = true;
    await tokenDoc.save();

    return NextResponse.json({ message: "Account setup complete" });
  } catch (error: unknown) {
    console.error("Accept Invite Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
