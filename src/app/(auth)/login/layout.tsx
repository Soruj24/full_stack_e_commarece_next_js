import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | ShopHub",
  description: "Sign in to your ShopHub account to track orders, manage your wishlist, and enjoy faster checkout.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
