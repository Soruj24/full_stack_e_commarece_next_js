import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { checkRole } from "@/lib/rbac";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET(req: Request) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();

    // 1. Get Summary Stats
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" }); // Assuming 'status' field exists
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } }); // Threshold 10

    // 2. Revenue Over Last 30 Days (Sales Trend)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        start: startOfDay(date),
        end: endOfDay(date),
        label: format(date, "MMM dd")
      };
    }).reverse();

    const salesData = await Promise.all(last30Days.map(async (day) => {
      const dailyRevenue = await Order.aggregate([
        { 
          $match: { 
            paymentStatus: "paid",
            createdAt: { $gte: day.start, $lte: day.end }
          } 
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);
      return {
        _id: day.label,
        revenue: dailyRevenue[0]?.total || 0
      };
    }));

    // 3. Category Performance
    const categoryStats = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // 4. Top Selling Products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "details"
        }
      },
      { $unwind: "$details" },
      {
        $project: {
          details: { name: 1, images: 1 },
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    // 5. User Engagement (Registrations last 30 days)
    const userEngagement = await Promise.all(last30Days.map(async (day) => {
      const count = await User.countDocuments({
        createdAt: { $gte: day.start, $lte: day.end }
      });
      return {
        _id: day.label,
        count
      };
    }));

    // 6. Order Status Distribution
    const statusDistribution = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders: totalOrders,
        totalUsers: totalUsers,
        totalProducts: totalProducts,
        activeUsers,
        lowStockCount,
      },
      salesData,
      categoryStats,
      topProducts,
      userEngagement,
      charts: {
        revenue: salesData,
        status: statusDistribution.map(s => ({ name: s._id, value: s.count })),
      }
    });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
