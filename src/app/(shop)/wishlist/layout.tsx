import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | ShopHub",
  description: "Save your favorite products for later. Manage your wishlist and continue shopping.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
