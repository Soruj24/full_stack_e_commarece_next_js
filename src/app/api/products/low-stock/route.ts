import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { StockAlert } from "@/core/database/models/StockAlert";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

export async function GET() {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();

    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      isArchived: false,
    })
      .select("name slug stock lowStockThreshold images category brand variants.sku variants.stock variants.isActive variants.name")
      .populate("category", "name slug")
      .sort({ stock: 1 })
      .limit(100)
      .lean();

    const outOfStock = lowStockProducts.filter((p) => p.stock === 0);
    const lowStock = lowStockProducts.filter((p) => p.stock > 0);

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
