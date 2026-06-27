import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Products | ShopHub",
  description: "Compare products side by side. Find the best product that suits your needs.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
