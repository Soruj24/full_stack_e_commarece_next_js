import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { checkRole } from "@/lib/rbac";
import { PriceHistory } from "@/core/database/models/PriceHistory";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await (Product as any).findOne({
      $or: [
        { _id: id },
        { slug: id },
      ],
    })
      .populate("category", "name slug metaTitle metaDescription")
      .populate("brandRef", "name slug logo")
      .populate("relatedProducts", "name slug price discountPrice images stock")
      .populate("frequentlyBoughtTogether", "name slug price discountPrice images stock")
      .lean();

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await checkRole(["admin", "vendor"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    if (body.price && body.price !== product.price) {
      await PriceHistory.findOneAndUpdate(
        { productId: id },
        {
          $push: {
            pricePoints: {
              date: new Date(),
              price: body.price,
              source: "manual_update",
            },
          },
        },
        { upsert: true }
      );
    }

    Object.assign(product, body);
    await product.save();

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();
    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product",
    }, { status: 500 });
  }
}
