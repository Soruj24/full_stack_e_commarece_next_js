import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment } = await request.json();
    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const productId = id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r: { user: { toString: () => string } }) =>
        r.user.toString() === session.user.id,
    );

    if (alreadyReviewed) {
      return NextResponse.json(
        { error: "Product already reviewed" },
        { status: 400 },
      );
    }

    // Check if verified purchase (optional but good for UX)
    const order = await Order.findOne({
      user: session.user.id,
      "items.product": productId,
      status: "Delivered",
    });

    const review = {
      user: session.user.id,
      name: session.user.name || "Anonymous",
      rating: Number(rating),
      comment,
      isVerified: !!order,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc: number, item: { rating: number }) => item.rating + acc, 0) /
      product.reviews.length;



    await product.save();

    return NextResponse.json({ success: true, message: "Review added" });
  } catch (error: unknown) {
    console.error("Review Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
