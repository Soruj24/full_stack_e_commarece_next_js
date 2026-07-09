import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Brand } from "@/core/database/models/Brand";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const isActive = searchParams.get("isActive") !== "false";
    const keyword = searchParams.get("keyword") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (isActive) query.isActive = true;
    if (keyword) query.name = { $regex: keyword, $options: "i" };

    const [brands, total] = await Promise.all([
      Brand.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Brand.countDocuments(query),
    ]);

    const response = NextResponse.json({
      success: true,
      brands,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch brands",
    }, { status: 500 });
  }
}
