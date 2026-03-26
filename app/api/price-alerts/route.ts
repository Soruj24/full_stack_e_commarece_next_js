import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";

interface PriceAlert {
  _id?: string;
  productId: string;
  productName: string;
  email: string;
  originalPrice: number;
  targetPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PriceAlertSchema = new (require("mongoose")).Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  email: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  targetPrice: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PriceAlert =
  (require("mongoose").models.PriceAlert as typeof PriceAlertSchema) ||
  (require("mongoose") as any).model("PriceAlert", PriceAlertSchema);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const email = searchParams.get("email");

    await dbConnect();

    const query: Record<string, string> = {};
    if (productId) query.productId = productId;
    if (email) query.email = email;

    const alerts = await PriceAlert.find(query);
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error("Price alerts GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, email, productName, currentPrice } = body;

    if (!productId || !email || !productName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingAlert = await PriceAlert.findOne({ productId, email });
    if (existingAlert) {
      return NextResponse.json(
        { success: false, error: "You're already subscribed to this price alert" },
        { status: 400 }
      );
    }

    const alert = await PriceAlert.create({
      productId,
      email,
      productName,
      originalPrice: currentPrice,
    });

    return NextResponse.json(
      { success: true, message: "Price alert created", alert },
      { status: 201 }
    );
  } catch (error) {
    console.error("Price alerts POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const email = searchParams.get("email");

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing productId or email" },
        { status: 400 }
      );
    }

    await dbConnect();

    const alert = await PriceAlert.findOneAndDelete({ productId, email });
    if (!alert) {
      return NextResponse.json(
        { success: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Price alert removed" }
    );
  } catch (error) {
    console.error("Price alerts DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
