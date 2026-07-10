"use client";

import { useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Heart, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/cart/context/CartContext";
import { useNavbar } from "@/modules/common/hooks/use-navbar";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MegaMenu } from "./MegaMenu";
import { SearchBar } from "./SearchBar";
import { HeaderActions } from "./HeaderActions";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "./CartDrawer";
import { MobileSearchOverlay } from "./MobileSearchOverlay";
import { NavbarSkeleton } from "./NavbarSkeleton";

export function MainHeader() {
  const {
    user, loading, mounted, isScrolled,
    mobileMenuOpen, setMobileMenuOpen,
    megaMenuOpen, setMegaMenuOpen,
    cartDrawerOpen, setCartDrawerOpen,
    mobileSearchOpen, setMobileSearchOpen,
    categories, pathname, handleLogout, isAdmin,
  } = useNavbar();

  const { totalItems } = useCart() || { totalItems: 0 };
  const prevItems = useRef(totalItems);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (totalItems > prevItems.current && badgeRef.current) {
      badgeRef.current.classList.add("header-cart-bounce");
      const t = setTimeout(() => badgeRef.current?.classList.remove("header-cart-bounce"), 500);
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  const closeMega = useCallback(() => setMegaMenuOpen(false), [setMegaMenuOpen]);

  if (loading || !mounted) return <NavbarSkeleton />;

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-background border-b border-border/20",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300 ease-out",
            isScrolled ? "h-14" : "h-[72px]",
          )}>
            {/* Left — Logo */}
            <NavLogo />

            {/* Center — Navigation */}
            <NavLinks pathname={pathname} megaMenuOpen={megaMenuOpen} setMegaMenuOpen={setMegaMenuOpen} />

            {/* Right — Search + Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:block w-80">
                <SearchBar />
              </div>

              <button
                onClick={() => setMobileSearchOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/60 transition-colors"
                aria-label="Search"
              >
                <Search className="w-[20px] h-[20px] text-muted-foreground" />
              </button>

              <HeaderActions
                user={user}
                isAdmin={isAdmin}
                totalItems={totalItems}
                badgeRef={badgeRef}
                onCartOpen={() => setCartDrawerOpen(true)}
                onLogout={handleLogout}
              />

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/60 transition-colors"
                aria-label="Open menu"
              >
                <div className="flex flex-col gap-[5px] w-[18px]">
                  <span className="block h-[1.5px] w-full bg-foreground/70 rounded-full" />
                  <span className="block h-[1.5px] w-3/4 bg-foreground/70 rounded-full" />
                  <span className="block h-[1.5px] w-full bg-foreground/70 rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <MegaMenu isOpen={megaMenuOpen} onClose={closeMega} />
      </nav>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <MobileNav
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        user={user}
        isAdmin={isAdmin}
        pathname={pathname}
        categories={categories}
        onLogout={handleLogout}
      />
      <MobileSearchOverlay isOpen={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
    </>
  );
}
