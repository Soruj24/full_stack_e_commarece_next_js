import { dbConnect } from "@/config/db";
import Token from "@/models/Token";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const type = searchParams.get("type") || "reset";

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    await dbConnect();

    const tokenDoc = await Token.findOne({
      token,
      type,
      expiresAt: { $gt: new Date() },
      revoked: false,
    }).populate("userId");

    if (!tokenDoc || !tokenDoc.userId) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const user = tokenDoc.userId;

    return NextResponse.json({
      valid: true,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
