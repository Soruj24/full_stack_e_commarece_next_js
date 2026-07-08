import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Category } from "@/core/database/models/Category";
import { Brand } from "@/core/database/models/Brand";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (q.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const [products, categories, brands] = await Promise.all([
      Product.find(
        {
          $or: [
            { name: { $regex: regex } },
            { sku: { $regex: regex } },
            { "variants.sku": { $regex: regex } },
            { tags: { $in: [regex] } },
          ],
          isActive: true,
          isArchived: false,
        },
        { name: 1, slug: 1, images: { $slice: 1 }, price: 1, discountPrice: 1 }
      )
        .limit(5)
        .lean(),

      Category.find(
        { name: { $regex: regex }, isActive: true },
        { name: 1, slug: 1, image: 1 }
      )
        .limit(5)
        .lean(),

      Brand.find(
        { name: { $regex: regex }, isActive: true },
        { name: 1, slug: 1, logo: 1 }
      )
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
