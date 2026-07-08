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

    const product = await Product.findById(id)
      .select("frequentlyBoughtTogether category")
      .lean();

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (product.frequentlyBoughtTogether && product.frequentlyBoughtTogether.length > 0) {
      const fbtProducts = await Product.find({
        _id: { $in: product.frequentlyBoughtTogether },
        isActive: true,
        isArchived: false,
      })
        .populate("category", "name slug")
        .limit(6)
        .lean();

      if (fbtProducts.length > 0) {
        const total = (product as Record<string, unknown>).price as number +
          fbtProducts.reduce((sum, p) => sum + (p as Record<string, unknown>).price as number, 0);

        return NextResponse.json({
          success: true,
          products: fbtProducts,
          totalPrice: Math.round(total * 100) / 100,
          savings: fbtProducts.length > 0
            ? Math.round(fbtProducts.reduce((s, p) => {
              const pp = p as Record<string, unknown>;
              const dp = pp.discountPrice as number | undefined;
              return s + (dp && dp < (pp.price as number) ? (pp.price as number) - dp : 0);
            }, 0) * 100) / 100
            : 0,
        });
      }
    }

    const sameCategory = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true,
      isArchived: false,
    })
      .populate("category", "name slug")
      .sort({ numReviews: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({ success: true, products: sameCategory });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 });
  }
}
