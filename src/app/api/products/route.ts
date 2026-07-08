import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { checkRole } from "@/lib/rbac";
import { productSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    const keyword = searchParams.get("keyword") || searchParams.get("q") || "";
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { sku: { $regex: keyword, $options: "i" } },
        { "variants.sku": { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $in: [new RegExp(keyword, "i")] } },
      ];
    }

    const category = searchParams.get("category");
    if (category) query.category = category;

    const brand = searchParams.get("brand");
    if (brand) {
      query.$or = query.$or || [];
      query.$or = [
        ...(Array.isArray(query.$or) ? query.$or : []),
        { brand: { $regex: brand, $options: "i" } },
        { brandRef: brand },
      ];
    }

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, unknown>).$gte = parseFloat(minPrice);
      if (maxPrice) (query.price as Record<string, unknown>).$lte = parseFloat(maxPrice);
    }

    const inStock = searchParams.get("inStock");
    if (inStock === "true") query.stock = { $gt: 0 };

    const onSale = searchParams.get("onSale");
    if (onSale === "true") query.discountPrice = { $exists: true, $ne: null };

    const color = searchParams.get("color");
    if (color) query.colors = { $in: [new RegExp(color, "i")] };

    const size = searchParams.get("size");
    if (size) query.sizes = { $in: [new RegExp(size, "i")] };

    const tags = searchParams.get("tags");
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagList };
    }

    const isActive = searchParams.get("isActive");
    const isArchived = searchParams.get("isArchived");
    if (isActive === "true") query.isActive = true;
    else if (isActive === "false") query.isActive = false;
    else query.isActive = true;

    if (isArchived === "true") {
      query.isArchived = true;
      delete query.isActive;
    } else if (isArchived === "false") {
      query.isArchived = false;
    } else {
      query.isArchived = false;
    }

    const featured = searchParams.get("featured");
    if (featured === "true") query.isFeatured = true;

    const rating = searchParams.get("rating");
    if (rating) query.rating = { $gte: parseFloat(rating) };

    const ids = searchParams.get("ids");
    if (ids) {
      const idList = ids.split(",").map((id) => id.trim());
      query._id = { $in: idList };
    }

    const sortBy = searchParams.get("sortBy") || "-createdAt";
    const sortMap: Record<string, string> = {
      "price_asc": "price",
      "price_desc": "-price",
      "name_asc": "name",
      "name_desc": "-name",
      "rating": "-rating",
      "newest": "-createdAt",
      "oldest": "createdAt",
      "popular": "-numReviews",
      "stock": "-stock",
    };
    const sort = sortMap[sortBy] || "-createdAt";

    const select = searchParams.get("select") || "";

    let productsQuery = Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (select) {
      productsQuery = productsQuery.select(select.replace(/,/g, " "));
    } else {
      productsQuery = productsQuery.populate("category", "name slug")
        .populate("brandRef", "name slug logo");
    }

    const products = await productsQuery.lean();
    const total = await Product.countDocuments(query);

    const filters = searchParams.get("filters");
    let filterOptions: Record<string, unknown> = {};
    if (filters === "true") {
      const [brands, colors, sizes, priceRange] = await Promise.all([
        Product.distinct("brand", { isActive: true, isArchived: false }),
        Product.distinct("colors", { isActive: true, isArchived: false }),
        Product.distinct("sizes", { isActive: true, isArchived: false }),
        Product.aggregate([
          { $match: { isActive: true, isArchived: false } },
          {
            $group: {
              _id: null,
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
            },
          },
        ]),
      ]);
      filterOptions = {
        brands: brands.filter(Boolean),
        colors: colors.flat().filter(Boolean),
        sizes: sizes.flat().filter(Boolean),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
      };
    }

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
      ...(Object.keys(filterOptions).length > 0 ? { filters: filterOptions } : {}),
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch products",
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized, response } = await checkRole(["admin", "vendor"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      }, { status: 400 });
    }

    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json({
        success: false,
        error: "A product with this slug already exists",
      }, { status: 409 });
    }

    const product = await Product.create({ ...validation.data, slug });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    }, { status: 500 });
  }
}
