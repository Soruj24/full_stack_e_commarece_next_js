import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { StockAlert } from "@/models/StockAlert";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

export async function GET() {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();

    const threshold = 10;
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$stock", threshold] },
      isArchived: false,
    })
      .select("name stock images category")
      .sort({ stock: 1 })
      .limit(50);

    const outOfStock = lowStockProducts.filter((p) => p.stock === 0);
    const lowStock = lowStockProducts.filter((p) => p.stock > 0 && p.stock <= threshold);

    const alerts = await StockAlert.aggregate([
      { $match: { type: "back_in_stock", status: "pending" } },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
          emails: { $push: "$email" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      lowStock: lowStockProducts,
      stats: {
        outOfStock: outOfStock.length,
        lowStock: lowStock.length,
        pendingAlerts: alerts.length,
      },
      alerts,
    });
  } catch (error) {
    console.error("LowStock GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
