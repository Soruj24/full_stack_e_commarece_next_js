import { dbConnect } from "@/config/db";
import { StockAlert } from "@/models/StockAlert";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const productId = searchParams.get("productId");
    const session = await auth();

    const filter: Record<string, unknown> = {};
    
    if (type) filter.type = type;
    if (productId) filter.productId = productId;

    if (session?.user?.role !== "admin") {
      if (session?.user?.id) {
        filter.$or = [
          { userId: session.user.id },
          { email: session.user.email },
        ];
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const alerts = await StockAlert.find(filter)
      .populate("productId", "name images stock")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error("StockAlert GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, email } = body;

    if (!productId || !email) {
      return NextResponse.json({ error: "Product ID and email required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock > 5) {
      return NextResponse.json({ error: "Product is in stock" }, { status: 400 });
    }

    const existingAlert = await StockAlert.findOne({ productId, email, type: "back_in_stock", status: "pending" });
    if (existingAlert) {
      return NextResponse.json({ error: "Already subscribed to this alert" }, { status: 400 });
    }

    const session = await auth();
    const alert = await StockAlert.create({
      productId,
      userId: session?.user?.id,
      email,
      type: "back_in_stock",
      status: "pending",
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error("StockAlert POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const email = searchParams.get("email");
    const session = await auth();

    if (!productId || !email) {
      return NextResponse.json({ error: "Product ID and email required" }, { status: 400 });
    }

    const filter: Record<string, unknown> = { productId, email, type: "back_in_stock" };
    
    if (session?.user?.role !== "admin") {
      filter.email = email;
    }

    await StockAlert.deleteOne(filter);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("StockAlert DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
