import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Find all products that have reviews
    const productsWithReviews = await Product.find({
      "reviews.0": { $exists: true },
    })
      .select("name reviews")
      .sort({ updatedAt: -1 });

    // Flatten all reviews from all products
    const allReviews: {
      _id: string;
      rating: number;
      comment: string;
      user: string;
      createdAt: Date;
      updatedAt: Date;
      productId: string;
      productName: string;
    }[] = [];
    productsWithReviews.forEach((product) => {
      product.reviews.forEach((review: {
        _id: string;
        rating: number;
        comment: string;
        user: string;
        createdAt: Date;
        updatedAt: Date;
      }) => {
        allReviews.push({
          ...review,
          productId: product._id,
          productName: product.name,
        });
      });
    });

    // Sort by date descending
    allReviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = allReviews.length;
    const paginatedReviews = allReviews.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      reviews: paginatedReviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const { reviewId, productId } = await req.json();

    if (!reviewId || !productId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Filter out the review
    product.reviews = product.reviews.filter(
      (r: { _id: { toString: () => string } }) => r._id.toString() !== reviewId,
    );

    // Recalculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (acc: number, r: { rating: number }) => acc + r.rating,
        0,
      );
      product.rating = totalRating / product.reviews.length;
      product.numReviews = product.reviews.length;
    } else {
      product.rating = 0;
      product.numReviews = 0;
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 },
    );
  }
}
