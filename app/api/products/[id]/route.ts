// app/api/products/[id]/route.ts
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";
import { productSchema } from "@/lib/validations";
import z from "zod";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await Product.findById(id).populate(
      "category",
      "name slug",
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const { authorized, response, session } = await checkRole([
      "admin",
      "vendor",
    ]);
    if (!authorized || !session) return response as NextResponse;

    const { id } = params;
    const body = await req.json();

    // Use partial schema for updates
    const validation = productSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid data",
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const data = validation.data;
    const updateData: Partial<z.infer<typeof productSchema>> & {
      slug?: string;
    } = { ...data };

    // Update slug if name changes
    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Log the action
    await logAction({
      action: "PRODUCT_UPDATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "PRODUCT",
      entityId: id,
      changes: data,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const { authorized, response, session } = await checkRole([
      "admin",
      "vendor",
    ]);
    if (!authorized || !session) return response as NextResponse;

    const { id } = params;
    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Log the action
    await logAction({
      action: "PRODUCT_DELETE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "PRODUCT",
      entityId: id,
      changes: { name: product.name },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
