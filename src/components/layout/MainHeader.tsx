"use client";

import { useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
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
import { CommandSearch } from "./CommandSearch";
import { NavbarSkeleton } from "./NavbarSkeleton";

export function MainHeader() {
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
    commandSearchOpen,
    setCommandSearchOpen,
    categories,
    pathname,
    handleLogout,
    isAdmin,
  } = useNavbar();

  const { totalItems } = useCart() || { totalItems: 0 };
  const prevItems = useRef(totalItems);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (totalItems > prevItems.current && badgeRef.current) {
      badgeRef.current.classList.add("header-cart-bounce");
      const t = setTimeout(
        () => badgeRef.current?.classList.remove("header-cart-bounce"),
        500,
      );
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  const closeMega = useCallback(
    () => setMegaMenuOpen(false),
    [setMegaMenuOpen],
  );

  if (loading || !mounted) return <NavbarSkeleton />;

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "navbar-glass border-b border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-background border-b border-border/40",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              isScrolled ? "h-14" : "h-16",
            )}
          >
            <NavLogo />

            <NavLinks
              pathname={pathname}
              megaMenuOpen={megaMenuOpen}
              setMegaMenuOpen={setMegaMenuOpen}
            />

            <div className="flex items-center gap-1">
              {/* Desktop search with Cmd+K hint */}
              <div className="hidden lg:block">
                <SearchBar />
              </div>

              {/* Mobile search trigger */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-150"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </button>

              <HeaderActions
                user={user}
                isAdmin={isAdmin}
                totalItems={totalItems}
                badgeRef={badgeRef}
                onCartOpen={() => setCartDrawerOpen(true)}
                onLogout={handleLogout}
              />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-150"
                aria-label="Open menu"
              >
                <div className="flex flex-col gap-[4px] w-[16px]">
                  <span className="block h-[1.5px] w-full bg-current rounded-full transition-all" />
                  <span className="block h-[1.5px] w-3/4 bg-current rounded-full transition-all" />
                  <span className="block h-[1.5px] w-full bg-current rounded-full transition-all" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <MegaMenu isOpen={megaMenuOpen} onClose={closeMega} />
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
      <CommandSearch
        isOpen={commandSearchOpen}
        onClose={() => setCommandSearchOpen(false)}
      />
    </>
  );
}
