import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Brand } from "@/models/Brand";
import { auth } from "@/auth";
import slugify from "slugify";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    const body = await req.json();

    if (body.name && !body.slug) {
        body.slug = slugify(body.name, { lower: true, strict: true });
    }

    const brand = await Brand.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      brand,
    });
  } catch (error: unknown) {
    console.error("Error updating brand:", error);
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        return NextResponse.json(
            { error: "Brand with this name or slug already exists" },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
