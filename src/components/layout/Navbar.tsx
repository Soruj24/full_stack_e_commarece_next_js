"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Menu } from "lucide-react";
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
    categories,
    pathname,
    handleLogout,
    isAdmin,
  } = useNavbar();
  const { totalItems } = useCart() || { totalItems: 0 };

  if (loading || !mounted) return <NavbarSkeleton />;

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm py-1"
          : "bg-gradient-to-b from-primary/5 via-transparent to-transparent border-b border-transparent py-3",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-12">
            <NavLogo />
            <NavLinks
              pathname={pathname}
              megaMenuOpen={megaMenuOpen}
              setMegaMenuOpen={setMegaMenuOpen}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden xl:block w-72">
              <ProductSearch />
            </div>

            <div className="flex items-center bg-muted/30 p-1 rounded-full border border-border/40">
              <ModeToggle />
              <div className="h-4 w-[1px] bg-border/60 mx-1 hidden md:block" />
              <Link href="/wishlist" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartDrawerOpen(true)}
                className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-all h-8 w-8 sm:h-10 sm:w-10"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-[8px] sm:text-[10px] font-black text-primary-foreground flex items-center justify-center ring-2 sm:ring-4 ring-background shadow-lg">
                  {totalItems}
                </span>
              </Button>
            </div>

            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <NotificationDropdown />
                <UserMenu
                  user={user}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <AuthButtons />
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-xl sm:rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all h-9 w-9 sm:h-11 sm:w-11"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </div>

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
    </nav>
  );
};

export default Navbar;
