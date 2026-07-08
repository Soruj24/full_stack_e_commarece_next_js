import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Category } from "@/core/database/models/Category";
import { Brand } from "@/core/database/models/Brand";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, suggestions: { products: [], categories: [], brands: [] } });
    }

    const regex = new RegExp(q, "i");

    const [products, categories, brands] = await Promise.all([
      Product.find({
        $or: [
          { name: { $regex: regex } },
          { sku: { $regex: regex } },
          { "variants.sku": { $regex: regex } },
          { tags: { $in: [regex] } },
        ],
        isActive: true,
        isArchived: false,
      })
        .select("name slug images price discountPrice stock")
        .limit(8)
        .lean(),

      Category.find({ name: { $regex: regex }, isActive: true })
        .select("name slug image")
        .limit(4)
        .lean(),

      Brand.find({ name: { $regex: regex }, isActive: true })
        .select("name slug logo")
        .limit(4)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      suggestions: { products, categories, brands },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
