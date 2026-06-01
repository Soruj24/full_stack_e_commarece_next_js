import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";

export async function getCategories() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function createCategory(req: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await req.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    await dbConnect();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const category = await Category.create({ ...body, slug }) as unknown as { _id: { toString: () => string }; name: string };

    await logAction({
      action: "CATEGORY_CREATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "CATEGORY",
      entityId: category._id.toString(),
      changes: { name: category.name },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function getCategoryById(id: string) {
  try {
    await dbConnect();
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    const products = await Product.find({ category: id });
    return NextResponse.json({ success: true, category, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function updateCategory(req: Request, id: string) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const body = await req.json();
    await dbConnect();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });

    await logAction({
      action: "CATEGORY_UPDATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "CATEGORY",
      entityId: id,
      changes: body,
    });

    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update" },
      { status: 500 }
    );
  }
}

export async function deleteCategory(id: string) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 500 }
    );
  }
}