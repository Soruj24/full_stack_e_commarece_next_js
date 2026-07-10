"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/cart/context/CartContext";
import { useNavbar } from "@/modules/common/hooks/use-navbar";
import { ModeToggle } from "@/components/mode-toggle";
import { ProductSearch } from "@/components/products/ProductSearch";
import { NavbarSkeleton } from "./NavbarSkeleton";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserMenu } from "./UserMenu";
import { AuthButtons } from "./AuthButtons";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "./CartDrawer";
import { MobileSearchOverlay } from "./MobileSearchOverlay";

const Navbar = () => {
  const {
    user,
    loading,
    mounted,
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    megaMenuOpen,
    setMegaMenuOpen,
    cartDrawerOpen,
    setCartDrawerOpen,
    mobileSearchOpen,
    setMobileSearchOpen,
    categories,
    pathname,
    handleLogout,
    isAdmin,
  } = useNavbar();
  const { totalItems } = useCart() || { totalItems: 0 };
  const prevItemsRef = useRef(totalItems);
  const cartBadgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (totalItems > prevItemsRef.current && cartBadgeRef.current) {
      cartBadgeRef.current.classList.add("animate-bounce");
      const timer = setTimeout(() => {
        cartBadgeRef.current?.classList.remove("animate-bounce");
      }, 600);
      return () => clearTimeout(timer);
    }
    prevItemsRef.current = totalItems;
  }, [totalItems]);

  if (loading || !mounted) return <NavbarSkeleton />;

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-background border-b border-border/20",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-14" : "h-[60px]",
          )}>
            <div className="flex items-center gap-8 lg:gap-10 shrink-0">
              <NavLogo />
              <NavLinks
                pathname={pathname}
                megaMenuOpen={megaMenuOpen}
                setMegaMenuOpen={setMegaMenuOpen}
              />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden xl:block w-72">
                <ProductSearch compact />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden rounded-full hover:bg-muted/50 transition-colors h-9 w-9"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px] text-muted-foreground" />
              </Button>

              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              <Link href="/wishlist" className="hidden sm:inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-muted/50 transition-colors h-9 w-9"
                  aria-label="Wishlist"
                >
                  <Heart className="w-[18px] h-[18px] text-muted-foreground" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartDrawerOpen(true)}
                className="relative rounded-full hover:bg-muted/50 transition-colors h-9 w-9"
                aria-label={`Shopping cart, ${totalItems} items`}
              >
                <ShoppingCart className="w-[18px] h-[18px] text-muted-foreground" />
                {totalItems > 0 && (
                  <span
                    ref={cartBadgeRef}
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[9px] font-semibold text-primary-foreground flex items-center justify-center ring-[2px] ring-background transition-transform"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>

              {user ? (
                <div className="flex items-center gap-0.5">
                  <NotificationDropdown />
                  <div className="hidden md:block">
                    <UserMenu
                      user={user}
                      isAdmin={isAdmin}
                      onLogout={handleLogout}
                    />
                  </div>
                </div>
              ) : (
                <div className="hidden sm:block">
                  <AuthButtons />
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-full hover:bg-muted/50 transition-colors h-9 w-9"
                aria-label="Open menu"
              >
                <div className="flex flex-col gap-[5px] w-4 items-center">
                  <span className="block h-[1.5px] w-full bg-foreground rounded-full transition-all" />
                  <span className="block h-[1.5px] w-3/4 bg-foreground rounded-full transition-all" />
                  <span className="block h-[1.5px] w-full bg-foreground rounded-full transition-all" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
      <MobileNav
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        user={user}
        isAdmin={isAdmin}
        pathname={pathname}
        categories={categories}
        onLogout={handleLogout}
      />
      <MobileSearchOverlay
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
