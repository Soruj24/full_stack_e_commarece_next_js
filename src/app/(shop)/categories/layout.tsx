import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Categories | ShopHub",
  description: "Browse our product categories. Find laptops, phones, audio, cameras, gaming, and more.",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
