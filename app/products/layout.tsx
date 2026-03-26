import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | ShopHub",
  description: "Browse our full catalog of products. Filter by category, price, brand, and more.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
