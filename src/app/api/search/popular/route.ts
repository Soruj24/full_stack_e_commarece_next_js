import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { PopularSearch } from "@/core/database/models/PopularSearch";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const popular = await PopularSearch.find()
      .sort({ count: -1, lastSearchedAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(
      {
        success: true,
        searches: popular.map((s) => ({
          query: s.query,
          count: s.count,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Popular searches error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular searches" },
      { status: 500 }
    );
  }
}
