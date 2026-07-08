import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { PriceHistory } from "@/core/database/models/PriceHistory";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const history = await PriceHistory.findOne({ productId: id })
      .select("pricePoints")
      .lean();

    if (!history) {
      return NextResponse.json({ success: true, pricePoints: [] });
    }

    return NextResponse.json({
      success: true,
      pricePoints: history.pricePoints,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 });
  }
}
