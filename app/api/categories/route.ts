import { dbConnect } from "@/config/db";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";
import { logAction } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const all = searchParams.get("all");
    const tree = searchParams.get("tree");
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1000");
    const keyword = searchParams.get("keyword");
    const sortBy = searchParams.get("sortBy") || "order";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (all !== "true" && !keyword && tree !== "true") {
      query.parent = null;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (active === "true") {
      query.isActive = true;
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortBy === "name" || sortBy === "order" || sortBy === "createdAt") {
      sort[sortBy] = sortOrder;
    } else {
      sort.order = 1;
    }

    const categories = await Category.find(query)
      .populate("parent", "name slug")
      .sort(sort)
      .limit(limit)
      .skip(skip);

    if (tree === "true") {
      const categoryMap = new Map();
      const rootCategories: unknown[] = [];

      categories.forEach((cat: any) => {
        categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] });
      });

      categories.forEach((cat: any) => {
        const categoryObj = categoryMap.get(cat._id.toString());
        if (cat.parent) {
          const parentId = typeof cat.parent === "object" ? cat.parent._id.toString() : cat.parent.toString();
          const parent = categoryMap.get(parentId);
          if (parent) {
            parent.children.push(categoryObj);
          } else {
            rootCategories.push(categoryObj);
          }
        } else {
          rootCategories.push(categoryObj);
        }
      });

      return NextResponse.json({
        success: true,
        categories: rootCategories,
        pagination: { total: categories.length, page: 1, pages: 1 },
      });
    }

    const total = await Category.countDocuments(query);
    const totalTopLevel = await Category.countDocuments({ parent: null });
    const totalSubcategories = await Category.countDocuments({
      parent: { $ne: null },
    });
    const totalActive = await Category.countDocuments({ isActive: true });

    return NextResponse.json({
      success: true,
      categories,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalTopLevel,
        totalSubcategories,
        totalActive,
      },
    });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, response, session } = await checkRole(["admin"]);
    if (!authorized || !session) return response as NextResponse;

    await dbConnect();
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

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: "Parent category not found" },
          { status: 400 },
        );
      }
      const depth = await getCategoryDepth(parent);
      if (depth >= 3) {
        return NextResponse.json(
          { success: false, error: "Maximum category depth (4 levels) exceeded" },
          { status: 400 },
        );
      }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existingSlug = await Category.findOne({ slug });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const maxOrder = await Category.findOne({ parent: parent || null })
      .sort({ order: -1 })
      .select("order");
    const newOrder = order ?? (maxOrder?.order ?? 0) + 1;

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || "",
      image: image?.trim() || "",
      icon: icon?.trim() || "",
      parent: parent || null,
      isFeatured: isFeatured || false,
      isActive: isActive !== false,
      order: newOrder,
      metaTitle: metaTitle?.trim() || "",
      metaDescription: metaDescription?.trim() || "",
    });

    await logAction({
      action: "CATEGORY_CREATE",
      userId: (session as { user?: { id?: string } }).user?.id || "unknown",
      userEmail: (session as { user?: { email?: string } }).user?.email || "unknown",
      entityType: "CATEGORY",
      entityId: category._id.toString(),
      changes: { name: category.name },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 400 },
      );
    }
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function getCategoryDepth(categoryId: string): Promise<number> {
  let depth = 0;
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = await Category.findById(currentId).select("parent");
    if (!category || !category.parent) break;
    const parent = category.parent as { toString(): string };
    currentId = parent.toString();
    depth++;
  }

  return depth;
}
