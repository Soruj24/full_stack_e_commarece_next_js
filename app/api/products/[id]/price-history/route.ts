import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { PriceHistory } from "@/models/PriceHistory";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let priceHistory = await PriceHistory.findOne({
      productId: id,
    }).lean();

    if (!priceHistory) {
      const currentPrice = product.discountPrice || product.price;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const generatedPricePoints = generateSamplePriceHistory(
        currentPrice,
        thirtyDaysAgo
      );

      priceHistory = await PriceHistory.create({
        productId: id,
        pricePoints: generatedPricePoints,
      });
    }

    const pricePoints = priceHistory.pricePoints.map((point: { date: Date; price: number; source: string }) => ({
      date: point.date.toISOString(),
      price: point.price,
      source: point.source,
    }));

    const prices = pricePoints.map((p: { price: number }) => p.price) as number[];
    const currentPrice = product.discountPrice || product.price;
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice =
      prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;

    const sortedByDate = [...pricePoints].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const lowestPriceDate = sortedByDate.find(
      (p) => p.price === lowestPrice
    )?.date;
    const highestPriceDate = sortedByDate.find(
      (p) => p.price === highestPrice
    )?.date;

    const priceChange = currentPrice - (sortedByDate[0]?.price || currentPrice);
    const priceChangePercentage =
      sortedByDate[0]?.price > 0
        ? ((currentPrice - sortedByDate[0].price) / sortedByDate[0].price) * 100
        : 0;

    const response = {
      productId: id,
      productName: product.name,
      currentPrice,
      lowestPrice,
      highestPrice,
      averagePrice,
      priceChange,
      priceChangePercentage,
      lowestPriceDate,
      highestPriceDate,
      pricePoints,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, priceHistory: response });
  } catch (error) {
    console.error("Price history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}

function generateSamplePriceHistory(
  currentPrice: number,
  startDate: Date
): { date: Date; price: number; source: string }[] {
  const points: { date: Date; price: number; source: string }[] = [];
  const now = new Date();
  let price = currentPrice * (0.85 + Math.random() * 0.3);

  const dayInMs = 24 * 60 * 60 * 1000;
  let currentDate = new Date(startDate);

  while (currentDate <= now) {
    const variation = (Math.random() - 0.5) * 0.1 * price;
    price = Math.max(price * 0.7, Math.min(price * 1.3, price + variation));

    if (Math.random() > 0.7) {
      price = price * (0.9 + Math.random() * 0.15);
    }

    points.push({
      date: new Date(currentDate),
      price: Math.round(price * 100) / 100,
      source: "system",
    });

    currentDate = new Date(currentDate.getTime() + dayInMs);
  }

  if (points.length > 0) {
    points[points.length - 1].price = currentPrice;
  }

  return points;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    const { price, date, source } = body;

    if (!price || !date) {
      return NextResponse.json(
        { success: false, error: "Price and date are required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let priceHistory = await PriceHistory.findOne({
      productId: id,
    });

    if (!priceHistory) {
      priceHistory = new PriceHistory({
        productId: id,
        pricePoints: [],
      });
    }

    priceHistory.pricePoints.push({
      date: new Date(date),
      price: parseFloat(price),
      source: source || "manual",
    });

    priceHistory.pricePoints.sort(
      (a: { date: Date }, b: { date: Date }) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (priceHistory.pricePoints.length > 365) {
      priceHistory.pricePoints = priceHistory.pricePoints.slice(-365);
    }

    await priceHistory.save();

    return NextResponse.json({
      success: true,
      message: "Price point added successfully",
    });
  } catch (error) {
    console.error("Add price point error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add price point" },
      { status: 500 }
    );
  }
}
