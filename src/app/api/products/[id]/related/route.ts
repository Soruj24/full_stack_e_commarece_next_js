import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findById(id).select("category relatedProducts").lean();
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (product.relatedProducts && product.relatedProducts.length > 0) {
      const related = await Product.find({
        _id: { $in: product.relatedProducts },
        isActive: true,
        isArchived: false,
      })
        .populate("category", "name slug")
        .limit(8)
        .lean();

      if (related.length > 0) {
        return NextResponse.json({ success: true, products: related });
      }
    }

    const sameCategory = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true,
      isArchived: false,
    })
      .populate("category", "name slug")
      .sort({ rating: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, products: sameCategory });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 });
  }
}
