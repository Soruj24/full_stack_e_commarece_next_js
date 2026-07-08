import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Category } from "@/core/database/models/Category";
import { PopularSearch } from "@/core/database/models/PopularSearch";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const rating = searchParams.get("rating") || "";
    const inStock = searchParams.get("inStock") === "true";
    const onSale = searchParams.get("onSale") === "true";
    const color = searchParams.get("color") || "";
    const size = searchParams.get("size") || "";
    const tags = searchParams.get("tags") || "";
    const sortBy = searchParams.get("sortBy") || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const andConditions: Record<string, unknown>[] = [];
    const match: Record<string, unknown> = { isActive: true, isArchived: false };

    if (q) {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const orClause = [
        { name: { $regex: escapedQ, $options: "i" } },
        { sku: { $regex: escapedQ, $options: "i" } },
        { "variants.sku": { $regex: escapedQ, $options: "i" } },
        { description: { $regex: escapedQ, $options: "i" } },
        { tags: { $in: [new RegExp(escapedQ, "i")] } },
        { brand: { $regex: escapedQ, $options: "i" } },
      ];
      andConditions.push({ $or: orClause });

      PopularSearch.updateOne(
        { normalizedQuery: q.toLowerCase().trim() },
        {
          $inc: { count: 1 },
          $setOnInsert: { query: q.trim(), normalizedQuery: q.toLowerCase().trim() },
          $set: { lastSearchedAt: new Date() },
        },
        { upsert: true }
      ).catch(() => {});
    }

    if (category) {
      const cat = await Category.findOne({ slug: category }).select("_id").lean();
      if (cat) match.category = cat._id;
    }

    if (brand) {
      andConditions.push({
        $or: [
          { brandRef: brand },
          { brand: { $regex: brand, $options: "i" } },
        ],
      });
    }

    if (minPrice || maxPrice) {
      match.price = {};
      if (minPrice) (match.price as Record<string, unknown>).$gte = parseFloat(minPrice);
      if (maxPrice) (match.price as Record<string, unknown>).$lte = parseFloat(maxPrice);
    }

    if (rating) match.rating = { $gte: parseFloat(rating) };
    if (inStock) match.stock = { $gt: 0 };
    if (onSale) match.discountPrice = { $exists: true, $ne: null };
    if (color) match.colors = { $in: [new RegExp(color, "i")] };
    if (size) match.sizes = { $in: [new RegExp(size, "i")] };
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      match.tags = { $in: tagList };
    }

    if (andConditions.length > 0) match.$and = andConditions;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      rating: { rating: -1 },
      popular: { numReviews: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };
    const sort = sortMap[sortBy] || { createdAt: -1 };

    const [results, total, filteredCategories, filteredBrands, priceRange] = await Promise.all([
      (Product as any).find(match)
        .populate("category", "name slug")
        .populate("brandRef", "name slug logo")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      (Product as any).countDocuments(match),

      (Product as any).distinct("category", match).then((ids: string[]) =>
        Category.find({ _id: { $in: ids } })
          .select("name slug")
          .sort({ name: 1 })
          .lean()
      ),

      (Product as any).distinct("brand", match).then((names: string[]) =>
        names.filter(Boolean).sort()
      ),

      Product.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
    ]);

    const formattedResults = results.map((product: Record<string, unknown>) => ({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.discountPrice ? product.price : undefined,
      images: product.images || [],
      category: product.category,
      brand: product.brand,
      brandRef: product.brandRef,
      rating: product.rating,
      numReviews: product.numReviews,
      stock: product.stock,
      discountPrice: product.discountPrice,
      onSale: product.discountPrice != null,
      colors: product.colors,
      sizes: product.sizes,
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        categories: filteredCategories,
        brands: filteredBrands,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
