"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserMenu } from "./UserMenu";
import { AuthButtons } from "./AuthButtons";

interface HeaderActionsProps {
  user?: { name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  isAdmin: boolean;
  totalItems: number;
  badgeRef: React.RefObject<HTMLSpanElement | null>;
  onCartOpen: () => void;
  onLogout: () => void;
}

function ActionButton({ children, label, onClick, href }: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls = "relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/60 transition-colors";

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={label}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls} aria-label={label}>
      {children}
    </button>
  );
}

export const HeaderActions = memo(function HeaderActions({
  user, isAdmin, totalItems, badgeRef, onCartOpen, onLogout,
}: HeaderActionsProps) {
  return (
    <>
      <div className="hidden sm:block">
        <ModeToggle />
      </div>

      <ActionButton label="Wishlist" href="/wishlist">
        <Heart className="w-[20px] h-[20px] text-muted-foreground" />
      </ActionButton>

      <ActionButton label={`Cart, ${totalItems} items`} onClick={onCartOpen}>
        <ShoppingCart className="w-[20px] h-[20px] text-muted-foreground" />
        {totalItems > 0 && (
          <span
            ref={badgeRef}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-semibold flex items-center justify-center ring-2 ring-background transition-transform"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </ActionButton>

      {user ? (
        <div className="hidden md:flex items-center gap-0.5">
          <NotificationDropdown />
          <UserMenu user={user} isAdmin={isAdmin} onLogout={onLogout} />
        </div>
      ) : (
        <div className="hidden sm:block">
          <AuthButtons />
        </div>
      )}
    </>
  );
});
