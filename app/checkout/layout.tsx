import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | ShopHub",
  description: "Complete your purchase securely. Review your cart and proceed to checkout.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
