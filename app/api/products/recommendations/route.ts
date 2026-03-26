import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await auth();

    let recommendations = [];

    if (session) {
      // 1. Get user's purchase history
      const userOrders = await Order.find({ user: session.user.id });
      const purchasedProductIds = userOrders.flatMap((order) =>
        order.items.map((item: { product: { toString: () => string } }) => item.product.toString()),
      );

      // 2. Find categories user is interested in
      const purchasedProducts = await Product.find({
        _id: { $in: purchasedProductIds },
      });
      const userCategories = [
        ...new Set(purchasedProducts.map((p) => p.category)),
      ];

      // 3. Collaborative Filtering logic:
      // Find other users who bought the same products
      const similarOrders = await Order.find({
        "items.product": { $in: purchasedProductIds },
        user: { $ne: session.user.id },
      }).limit(20);

      const otherUsersProducts = similarOrders
        .flatMap((order) =>
          order.items.map((item: { product: { toString: () => string } }) =>
            item.product.toString(),
          ),
        )
        .filter((id) => !purchasedProductIds.includes(id));

      // 4. Combine results:
      // - Products from same categories
      // - Products bought by similar users
      // - Featured products as fallback
      recommendations = await Product.find({
        _id: {
          $nin: purchasedProductIds,
          $in: otherUsersProducts.length > 0 ? otherUsersProducts : [],
        },
        isActive: true,
      })
        .populate("category", "name slug")
        .limit(4);

      if (recommendations.length < 4) {
        const categoryRecommendations = await Product.find({
          category: { $in: userCategories },
          _id: {
            $nin: [
              ...purchasedProductIds,
              ...recommendations.map((r) => r._id.toString()),
            ],
          },
          isActive: true,
        })
          .populate("category", "name slug")
          .limit(4 - recommendations.length);

        recommendations = [...recommendations, ...categoryRecommendations];
      }
    }

    // 5. Fallback if not logged in or not enough recommendations
    if (recommendations.length < 4) {
      const fallbackProducts = await Product.find({
        isFeatured: true,
        isActive: true,
      })
        .populate("category", "name slug")
        .limit(4 - recommendations.length);

      recommendations = [...recommendations, ...fallbackProducts];
    }

    return NextResponse.json(recommendations);
  } catch (error: unknown) {
    console.error("Recommendation Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
