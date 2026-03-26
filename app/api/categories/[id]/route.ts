import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Category } from "@/models/Category";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";
import mongoose from "mongoose";

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
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const category = await Category.findById(id).populate("parent", "name slug");
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const children = await Category.find({ parent: id }).select("name slug order isActive isFeatured");

    return NextResponse.json({ success: true, category: { ...category.toObject(), children } });
  } catch (error) {
    console.error("Category GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const { id } = params;
    const body = await request.json();
    const {
      name,
      description,
      image,
      icon,
      parent,
      isFeatured,
      isActive,
      order,
      metaTitle,
      metaDescription,
    } = body;

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};
    const changes: Record<string, { old: unknown; new: unknown }> = {};

    if (name !== undefined) {
      const currentCategory = await Category.findById(id).select("name");
      if (currentCategory && currentCategory.name !== name) {
        changes.name = { old: currentCategory.name, new: name };
        updateData.name = name.trim();
        updateData.slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
    }

    if (description !== undefined) updateData.description = description?.trim() || "";
    if (image !== undefined) updateData.image = image?.trim() || "";
    if (icon !== undefined) updateData.icon = icon?.trim() || "";
    if (parent !== undefined) {
      const currentCategory = await Category.findById(id).select("parent");
      if (currentCategory) {
        const oldParent = currentCategory.parent?.toString() || null;
        const newParent = parent || null;
        if (oldParent !== newParent) {
          changes.parent = { old: oldParent, new: newParent };
        }
      }
      updateData.parent = parent || null;
    }
    if (isFeatured !== undefined) {
      const currentCategory = await Category.findById(id).select("isFeatured");
      if (currentCategory) {
        changes.isFeatured = { old: currentCategory.isFeatured, new: isFeatured };
      }
      updateData.isFeatured = isFeatured;
    }
    if (isActive !== undefined) {
      const currentCategory = await Category.findById(id).select("isActive");
      if (currentCategory) {
        changes.isActive = { old: currentCategory.isActive, new: isActive };
      }
      updateData.isActive = isActive;
    }
    if (order !== undefined) {
      const currentCategory = await Category.findById(id).select("order");
      if (currentCategory) {
        changes.order = { old: currentCategory.order, new: order };
      }
      updateData.order = order;
    }
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle?.trim() || "";
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription?.trim() || "";

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("parent", "name slug");

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    await logAction({
      action: "CATEGORY_UPDATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "CATEGORY",
      entityId: id,
      changes,
    });

    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 },
      );
    }
    console.error("Category PATCH error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 },
      );
    }

    await dbConnect();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    const hasChildren = await Category.findOne({ parent: id });
    if (hasChildren) {
      return NextResponse.json(
        { success: false, error: "Cannot delete category with subcategories. Remove or reassign subcategories first." },
        { status: 400 },
      );
    }

    await Category.findByIdAndDelete(id);

    await logAction({
      action: "CATEGORY_DELETE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "CATEGORY",
      entityId: id,
      changes: { name: category.name },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: unknown) {
    console.error("Category DELETE error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
