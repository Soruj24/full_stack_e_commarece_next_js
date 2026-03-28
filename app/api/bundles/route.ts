import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Bundle } from "@/models/Bundle";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: { $gte: now } },
      ],
    })
      .populate("category", "name slug")
      .populate("products.product", "name images stock price")
      .sort({ createdAt: -1 });

    const formattedBundles = bundles.map((bundle) => ({
      _id: bundle._id,
      name: bundle.name,
      description: bundle.description,
      products: bundle.products.map((p: { product: { _id: string; name: string; images: string[]; price: number }; name: string; price: number; image: string; quantity: number }) => ({
        id: p.product?._id || p.name,
        name: p.product?.name || p.name,
        price: p.product?.price || p.price,
        image: p.product?.images?.[0] || p.image || "/placeholder.svg",
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
      validUntil: bundle.validUntil,
      maxQuantity: bundle.maxQuantityPerOrder,
    }));

    return NextResponse.json({ success: true, bundles: formattedBundles });
  } catch (error) {
    console.warn("Error fetching bundles:", error);
    return NextResponse.json({ success: true, bundles: [] });
  }
}
