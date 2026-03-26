import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Brand } from "@/models/Brand";
import { auth } from "@/auth";
import slugify from "slugify";

export async function GET(req: Request) {
  try {
    await dbConnect();
    // Allow public access for now if needed by frontend without auth,
    // or strictly check auth. Since it's /admin/, let's check auth or just return all.
    // Given the context of "Admin should add brands", this is primarily for admin consumption.
    // But if we use it in filters later, we might need a public route.
    // For now, let's keep it simple.

    const brands = await Brand.find({}).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = slugify(body.name, { lower: true, strict: true });
    }

    const brand = await Brand.create(body);

    return NextResponse.json({
      success: true,
      brand,
    });
  } catch (error: unknown) {
    console.error("Error creating brand:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Brand with this name or slug already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
