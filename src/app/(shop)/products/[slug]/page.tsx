import { notFound } from "next/navigation";
import { dbConnect } from "@/core/config/database";
import { Product } from "@/core/database/models/Product";
import { Category } from "@/core/database/models/Category";
import { Brand } from "@/core/database/models/Brand";
import type { Metadata } from "next";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const product = await (Product as any).findOne({
    $or: [{ _id: slug }, { slug }],
  })
    .select("name description metaTitle metaDescription ogImage images")
    .lean();

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle || `${product.name} | Nexus`,
    description: product.metaDescription || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 200),
      images: product.ogImage || product.images?.[0] ? [{ url: product.ogImage || product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  await dbConnect();

  const product = await (Product as any).findOne({
    $or: [{ _id: slug }, { slug }],
  })
    .populate("category", "name slug")
    .populate("brandRef", "name slug logo")
    .populate("relatedProducts", "name slug price discountPrice images stock rating numReviews brand")
    .populate("frequentlyBoughtTogether", "name slug price discountPrice images stock rating")
    .lean();

  if (!product) notFound();

  const relatedProducts = product.relatedProducts?.length
    ? product.relatedProducts
    : await (Product as any).find({
        category: product.category?._id,
        _id: { $ne: product._id },
        isActive: true,
        isArchived: false,
      })
        .select("name slug price discountPrice images stock rating numReviews brand")
        .limit(8)
        .lean();

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts || []))}
    />
  );
}
