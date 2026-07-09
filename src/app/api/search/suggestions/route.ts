import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Category } from "@/core/database/models/Category";
import { Brand } from "@/core/database/models/Brand";
import { PopularSearch } from "@/core/database/models/PopularSearch";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const trimmed = q.trim();

    if (trimmed.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const escapedQ = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const useTextSearch = /^[\w\s]+$/.test(trimmed);

    const productQuery = useTextSearch
      ? { $text: { $search: trimmed }, isActive: true, isArchived: false }
      : {
          $or: [
            { name: { $regex: escapedQ, $options: "i" } },
            { sku: { $regex: escapedQ, $options: "i" } },
            { "variants.sku": { $regex: escapedQ, $options: "i" } },
            { tags: { $in: [new RegExp(escapedQ, "i")] } },
          ],
          isActive: true,
          isArchived: false,
        };

    const [products, categories, brands, popular] = await Promise.all([
      Product.find(
        productQuery,
        useTextSearch
          ? { name: 1, slug: 1, images: { $slice: 1 }, price: 1, discountPrice: 1, score: { $meta: "textScore" } }
          : { name: 1, slug: 1, images: { $slice: 1 }, price: 1, discountPrice: 1 }
      )
        .sort(useTextSearch ? { score: { $meta: "textScore" } } : { name: 1 })
        .limit(5)
        .lean(),

      Category.find(
        { name: { $regex: escapedQ, $options: "i" }, isActive: true },
        { name: 1, slug: 1, image: 1 }
      )
        .limit(5)
        .lean(),

      Brand.find(
        { name: { $regex: escapedQ, $options: "i" }, isActive: true },
        { name: 1, slug: 1, logo: 1 }
      )
        .limit(3)
        .lean(),

      PopularSearch.find(
        { query: { $regex: escapedQ, $options: "i" } },
        { query: 1, count: 1 }
      )
        .sort({ count: -1 })
        .limit(3)
        .lean(),
    ]);

    const suggestions = [
      ...products.map((p) => ({
        type: "product" as const,
        text: p.name,
        slug: p.slug,
        image: p.images?.[0] || "",
        price: p.price,
        discountPrice: p.discountPrice,
      })),
      ...categories.map((c) => ({
        type: "category" as const,
        text: c.name,
        slug: c.slug,
        image: c.image || "",
      })),
      ...brands.map((b) => ({
        type: "brand" as const,
        text: b.name,
        slug: b.slug,
        image: b.logo || "",
      })),
      ...popular.map((p) => ({
        type: "popular" as const,
        text: p.query,
        count: p.count,
      })),
    ];

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
