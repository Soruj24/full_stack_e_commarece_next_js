import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products | ShopHub",
  description: "Search for products by name, category, or brand. Find exactly what you're looking for.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
