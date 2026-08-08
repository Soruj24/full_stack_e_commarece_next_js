"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Grid3X3 } from "lucide-react";
import { useCart } from "@/modules/cart/context/CartContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/products", icon: Grid3X3, label: "Browse" },
  { href: "/cart", icon: ShoppingBag, label: "Cart" },
  { href: "/dashboard", icon: User, label: "Account" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { cart } = useCart();
  const cartCount = cart?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-xl border-t border-border/30 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const isCart = item.label === "Cart";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold text-primary-foreground bg-primary rounded-full">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold mt-0.5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
