import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Bundles | ShopHub",
  description: "Save big with curated product bundles. Get multiple items at incredible discounts.",
};

export default function BundlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
