import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const rating = searchParams.get("rating") || "";
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sortBy") || "relevance";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    if (category) {
      filter["category.slug"] = category;
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice) {
      filter.price = { ...((filter.price as object) || {}), $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filter.price = { ...((filter.price as object) || {}), $lte: parseFloat(maxPrice) };
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    if (inStock) {
      filter.stock = { $gt: 0 };
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sortBy) {
      case "price_asc":
        sort = { price: 1 };
        break;
      case "price_desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "rating":
        sort = { rating: -1 };
        break;
      default:
        if (query) {
          sort = { "name.keyword": -1 } as Record<string, 1 | -1>;
        }
    }

    const [results, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const formattedResults = results.map((product) => ({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.discountPrice ? product.price : undefined,
      images: product.images || [],
      category: product.category,
      brand: product.brand,
      rating: product.rating,
      numReviews: product.numReviews,
      stock: product.stock,
      discountPrice: product.discountPrice,
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
