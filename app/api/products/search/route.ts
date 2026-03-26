// app/api/products/search/route.ts
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    // AI-powered autocomplete simulation (regex-based for now)
    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    })
      .select("name slug category images")
      .limit(5);

    const categories = await Category.find({
      name: { $regex: q, $options: "i" },
    })
      .select("name slug")
      .limit(3);

    return NextResponse.json({
      success: true,
      suggestions: {
        products,
        categories,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
