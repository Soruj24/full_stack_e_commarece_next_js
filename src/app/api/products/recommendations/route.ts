import { NextResponse } from "next/server";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Order } from "@/core/database/models/Order";
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    let recommendations: any[] = [];

    if (session) {
      const userOrders = await Order.find({ user: session.user.id });
      const purchasedProductIds: string[] = userOrders.flatMap((order) =>
        order.items.map((item: { product: { toString: () => string } }) => item.product.toString()),
      );

      const purchasedProducts = await Product.find({
        _id: { $in: purchasedProductIds },
      });
      const userCategories: string[] = [
        ...new Set(purchasedProducts.map((p) => p.category.toString())),
      ];

      const similarOrders = await Order.find({
        "items.product": { $in: purchasedProductIds },
        user: { $ne: session.user.id },
      }).limit(20);

      const otherUsersProducts: string[] = [
        ...new Set(
          similarOrders
            .flatMap((order) =>
              order.items.map((item: { product: { toString: () => string } }) =>
                item.product.toString(),
              ),
            )
            .filter((id) => !purchasedProductIds.includes(id)),
        ),
      ];

      if (otherUsersProducts.length > 0) {
        recommendations = await Product.find({
          _id: { $in: otherUsersProducts },
          isActive: true,
          isArchived: false,
        })
          .populate("category", "name slug")
          .populate("brandRef", "name slug logo")
          .limit(4)
          .lean();
      }

      if (recommendations.length < 4 && userCategories.length > 0) {
        const excludeIds: string[] = [...purchasedProductIds, ...recommendations.map((r) => r._id.toString())];
        const categoryRecs = await Product.find({
          category: { $in: userCategories },
          _id: { $nin: excludeIds },
          isActive: true,
          isArchived: false,
        })
          .populate("category", "name slug")
          .populate("brandRef", "name slug logo")
          .sort({ rating: -1 })
          .limit(4 - recommendations.length)
          .lean();

        recommendations = [...recommendations, ...categoryRecs];
      }
    }

    if (recommendations.length < 4) {
      const fallbackProducts = await Product.find({
        isFeatured: true,
        isActive: true,
        isArchived: false,
      })
        .populate("category", "name slug")
        .populate("brandRef", "name slug logo")
        .sort({ rating: -1 })
        .limit(4 - recommendations.length)
        .lean();

      recommendations = [...recommendations, ...fallbackProducts];
    }

    if (recommendations.length < 4) {
      const recentProducts = await Product.find({
        isActive: true,
        isArchived: false,
        _id: { $nin: recommendations.map((r) => r._id.toString()) },
      })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(4 - recommendations.length)
        .lean();

      recommendations = [...recommendations, ...recentProducts];
    }

    return NextResponse.json(recommendations);
  } catch (error: unknown) {
    console.warn("Recommendation Error:", error);
    return NextResponse.json([]);
  }
}
