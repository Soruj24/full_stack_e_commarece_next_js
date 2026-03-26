import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (q.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q, "i");

    const [products, categories, brands] = await Promise.all([
      Product.find(
        { name: { $regex: regex } },
        { name: 1, slug: 1 }
      )
        .limit(5)
        .lean(),
      Category.find(
        { name: { $regex: regex } },
        { name: 1, slug: 1 }
      )
        .limit(5)
        .lean(),
      Brand.find(
        { name: { $regex: regex } },
        { name: 1, slug: 1 }
      )
        .limit(3)
        .lean(),
    ]);

    const suggestions = [
      ...products.map((p) => ({
        type: "product" as const,
        text: p.name,
        slug: p.slug,
      })),
      ...categories.map((c) => ({
        type: "category" as const,
        text: c.name,
        slug: c.slug,
      })),
      ...brands.map((b) => ({
        type: "brand" as const,
        text: b.name,
        slug: b.slug,
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
