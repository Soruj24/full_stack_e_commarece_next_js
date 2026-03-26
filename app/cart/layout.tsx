import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | ShopHub",
  description: "Review items in your shopping cart, apply coupons, and proceed to checkout.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
