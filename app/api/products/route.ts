// app/api/products/route.ts
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";
import { productSchema } from "@/lib/validations";
import { logAction } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filtering
    const filter: Record<string, unknown> = {};

    const keyword = searchParams.get("keyword");
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
        { tags: { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    const categories = searchParams.get("category")?.split(",");
    if (categories && categories.length > 0) {
      const catDocs = await Category.find({ slug: { $in: categories } });
      if (catDocs.length > 0) {
        filter.category = { $in: catDocs.map((c) => c._id) };
      }
    }

    const brand = searchParams.get("brand");
    if (brand) filter.brand = brand;

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as { $gte?: number }).$gte = parseFloat(minPrice);
      if (maxPrice) (filter.price as { $lte?: number }).$lte = parseFloat(maxPrice);
    }

    const minRating = searchParams.get("rating");
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    const inStock = searchParams.get("inStock");
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Sorting
    const sort: Record<string, 1 | -1> = {};
    const sortBy = searchParams.get("sortBy") || "newest";

    switch (sortBy) {
      case "price-asc":
        sort.price = 1;
        break;
      case "price-desc":
        sort.price = -1;
        break;
      case "rating":
        sort.rating = -1;
        break;
      case "name":
        sort.name = 1;
        break;
      case "newest":
      default:
        sort.createdAt = -1;
        break;
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Product API Error:", error);
    return NextResponse.json({
      success: true,
      products: [],
      pagination: {
        total: 0,
        page: 1,
        pages: 1,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized, response, session } = await checkRole([
      "admin",
      "vendor",
    ]);
    if (!authorized || !session) return response as NextResponse;

    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid product data",
        },
        { status: 400 },
      );
    }

    const data = validation.data;
    await dbConnect();

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const productData = {
      ...data,
      slug,
    };

    const product = await Product.create(productData);

    // Log the action
    await logAction({
      action: "PRODUCT_CREATE",
      userId: session.user.id,
      userEmail: session.user.email!,
      entityType: "PRODUCT",
      entityId: product._id.toString(),
      changes: { name: product.name, price: product.price },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
