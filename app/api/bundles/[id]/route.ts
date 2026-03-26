import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Bundle } from "@/models/Bundle";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const bundle = await Bundle.findById(id)
      .populate("category", "name slug")
      .populate("products.product", "name images stock price description");

    if (!bundle) {
      return NextResponse.json(
        { success: false, error: "Bundle not found" },
        { status: 404 }
      );
    }

    const formattedBundle = {
      _id: bundle._id,
      name: bundle.name,
      description: bundle.description,
      products: bundle.products.map((p: { product: { _id: string; name: string; images: string[]; price: number; stock: number; description: string }; name: string; price: number; image: string; quantity: number }) => ({
        id: p.product?._id,
        name: p.product?.name || p.name,
        price: p.product?.price || p.price,
        image: p.product?.images?.[0] || p.image || "/placeholder.svg",
        quantity: p.quantity,
        stock: p.product?.stock,
        description: p.product?.description,
      })),
      originalPrice: bundle.originalPrice,
      bundlePrice: bundle.bundlePrice,
      discount: bundle.discount,
      discountPercentage: bundle.discountPercentage,
      stock: bundle.stock,
      images: bundle.images,
      category: bundle.category,
      brand: bundle.brand,
      isActive: bundle.isActive,
      validFrom: bundle.validFrom,
      validUntil: bundle.validUntil,
      maxQuantity: bundle.maxQuantityPerOrder,
    };

    return NextResponse.json({ success: true, bundle: formattedBundle });
  } catch (error) {
    console.error("Error fetching bundle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bundle" },
      { status: 500 }
    );
  }
}
