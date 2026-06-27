import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds | ShopHub",
  description: "Track your return requests and refunds. Easy returns within 30 days.",
};

export default function ReturnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
