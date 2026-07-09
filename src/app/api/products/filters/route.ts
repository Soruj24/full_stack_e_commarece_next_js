import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Category } from "@/core/database/models/Category";

export async function GET() {
  try {
    await dbConnect();

    const match = { isActive: true, isArchived: false };

    const [categories, brands, colors, sizes, priceRange] = await Promise.all([
      Product.distinct("category", match).then((ids) =>
        Category.find({ _id: { $in: ids }, isActive: true })
          .select("name slug")
          .sort({ name: 1 })
          .lean()
      ),

      Product.distinct("brand", match).then((names) =>
        names.filter(Boolean).sort()
      ),

      Product.distinct("colors", match).then((c) =>
        [...new Set(c.flat().filter(Boolean))].sort()
      ),

      Product.distinct("sizes", match).then((s) =>
        [...new Set(s.flat().filter(Boolean))].sort()
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

    const response = NextResponse.json({
      success: true,
      filters: {
        categories,
        brands,
        colors,
        sizes,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        ratingOptions: [4, 3, 2, 1],
      },
    });
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return response;
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch filters",
    }, { status: 500 });
  }
}
