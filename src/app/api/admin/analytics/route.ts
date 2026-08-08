import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Order } from "@/core/database/models/Order";
import { User } from "@/core/database/models/User";
import { Product } from "@/core/database/models/Product";
import { checkRole } from "@/lib/rbac";
import { startOfDay, endOfDay, subDays, subMonths, subYears, format } from "date-fns";

function getDateRange(preset: string, startDate?: string, endDate?: string) {
  const now = new Date();
  const end = endDate ? endOfDay(new Date(endDate)) : endOfDay(now);

  let start: Date;
  switch (preset) {
    case "7d":
      start = startOfDay(subDays(now, 7));
      break;
    case "30d":
      start = startOfDay(subDays(now, 30));
      break;
    case "90d":
      start = startOfDay(subDays(now, 90));
      break;
    case "1y":
      start = startOfDay(subYears(now, 1));
      break;
    case "custom":
      start = startDate ? startOfDay(new Date(startDate)) : startOfDay(subDays(now, 30));
      break;
    default:
      start = startOfDay(subDays(now, 30));
  }

  return { start, end };
}

function getInterval(preset: string) {
  switch (preset) {
    case "7d": return "day";
    case "30d": return "day";
    case "90d": return "week";
    case "1y": return "month";
    default: return "day";
  }
}

function formatDateByInterval(date: Date, interval: string): string {
  if (interval === "month") return format(date, "MMM yyyy");
  if (interval === "week") return format(date, "MMM dd");
  return format(date, "MMM dd");
}

export async function GET(req: Request) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const preset = searchParams.get("preset") || "30d";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const { start, end } = getDateRange(preset, startDate, endDate);
    const interval = getInterval(preset);

    const dateMatch = { createdAt: { $gte: start, $lte: end } };
    const paidMatch = { paymentStatus: "paid", createdAt: { $gte: start, $lte: end } };

    const [
      revenueResult,
      totalOrders,
      ordersInPeriod,
      totalUsers,
      newUsersInPeriod,
      totalProducts,
      activeUsers,
      categoryStats,
      topProducts,
      statusDistribution,
      ordersByDay,
    ] = await Promise.all([
      Order.aggregate([
        { $match: paidMatch },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments(dateMatch),
      User.countDocuments(),
      User.countDocuments(dateMatch),
      Product.countDocuments({ isArchived: false }),
      User.countDocuments({ status: "active" }),
      Order.aggregate([
        { $match: paidMatch },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $lookup: {
            from: "categories",
            localField: "productInfo.category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            orders: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
      ]),
      Order.aggregate([
        { $match: paidMatch },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "details",
          },
        },
        { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            name: { $ifNull: ["$details.name", "Unknown"] },
            image: { $arrayElemAt: [{ $ifNull: ["$details.images", []] }, 0] },
            totalSold: 1,
            revenue: 1,
            price: { $ifNull: ["$details.price", 0] },
          },
        },
      ]),
      Order.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const periodRevenue = revenueResult[0]?.total || 0;
    const periodOrders = revenueResult[0]?.count || 0;
    const aov = periodOrders > 0 ? periodRevenue / periodOrders : 0;
    const conversionRate = totalUsers > 0 ? (newUsersInPeriod / totalUsers) * 100 : 0;
    const returningUsers = ordersInPeriod - newUsersInPeriod;
    const retentionRate = ordersInPeriod > 0 ? Math.max(0, (returningUsers / ordersInPeriod) * 100) : 0;

    const revenueByInterval: { date: string; revenue: number; orders: number }[] = [];
    const ordersByInterval: { date: string; orders: number }[] = [];

    (ordersByDay || []).forEach((day: any) => {
      revenueByInterval.push({
        date: day._id,
        revenue: day.revenue,
        orders: day.orders,
      });
      ordersByInterval.push({
        date: day._id,
        orders: day.orders,
      });
    });

    return NextResponse.json({
      success: true,
      dateRange: { preset, start: start.toISOString(), end: end.toISOString() },
      stats: {
        totalRevenue: revenueResult[0]?.total || 0,
        totalOrders,
        totalUsers,
        totalProducts,
        activeUsers,
        periodRevenue,
        periodOrders,
        periodNewUsers: newUsersInPeriod,
        aov,
        conversionRate,
        retentionRate,
      },
      charts: {
        revenue: revenueByInterval,
        orders: ordersByInterval,
        status: statusDistribution.map((s: any) => ({ name: s._id, value: s.count })),
      },
      topProducts,
      topCategories: categoryStats,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
