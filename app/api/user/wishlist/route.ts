import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    await dbConnect();
    
    // Get total count first
    const userCount = await User.findById(session.user.id);
    if (!userCount) {
      return NextResponse.json({ success: false, error: "User account not found. Please log out and log in again." }, { status: 404 });
    }
    const total = userCount.wishlist.length;

    // Get paginated wishlist
    const user = await User.findById(session.user.id).populate({
      path: "wishlist",
      options: {
        limit: limit,
        skip: skip,
      },
      populate: { path: "category", select: "name slug" },
    });

    return NextResponse.json({ 
      success: true, 
      wishlist: user.wishlist,
      allIds: userCount.wishlist, // Return all IDs for global check
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: true,
      wishlist: [],
      allIds: [],
      pagination: { total: 0, page: 1, pages: 1 }
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found. Please log out and log in again." },
        { status: 404 },
      );
    }

    const index = user.wishlist.indexOf(productId);
    let action = "";
    if (index === -1) {
      user.wishlist.push(productId);
      action = "added";
    } else {
      user.wishlist.splice(index, 1);
      action = "removed";
    }

    await user.save();

    return NextResponse.json({
      success: true,
      action,
      wishlist: user.wishlist,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
