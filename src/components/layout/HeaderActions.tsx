"use client";

import { memo } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserMenu } from "./UserMenu";
import { AuthButtons } from "./AuthButtons";
import { cn } from "@/lib/utils";

interface HeaderActionsProps {
  user?: { name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  isAdmin: boolean;
  totalItems: number;
  badgeRef: React.RefObject<HTMLSpanElement | null>;
  onCartOpen: () => void;
  onLogout: () => void;
}

function ActionButton({
  children,
  label,
  onClick,
  href,
  badge,
  badgeRef,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  badgeRef?: React.RefObject<HTMLSpanElement | null>;
}) {
  const cls = cn(
    "relative flex items-center justify-center w-9 h-9 rounded-lg",
    "text-muted-foreground hover:text-foreground hover:bg-accent/60",
    "transition-all duration-150 focus-premium",
  );

  const content = (
    <>
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          ref={badgeRef}
          className={cn(
            "absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1",
            "rounded-full bg-primary text-primary-foreground",
            "text-[10px] font-semibold flex items-center justify-center",
            "ring-2 ring-background",
            "transition-transform duration-200",
          )}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls} aria-label={label}>
      {content}
    </button>
  );
}

export const HeaderActions = memo(function HeaderActions({
  user,
  isAdmin,
  totalItems,
  badgeRef,
  onCartOpen,
  onLogout,
}: HeaderActionsProps) {
  return (
    <>
      <div className="hidden sm:block">
        <ModeToggle />
      </div>

      <ActionButton label="Wishlist" href="/wishlist">
        <Heart className="w-[18px] h-[18px]" strokeWidth={1.75} />
      </ActionButton>

      <ActionButton
        label={`Cart, ${totalItems} items`}
        onClick={onCartOpen}
        badge={totalItems}
        badgeRef={badgeRef}
      >
        <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.75} />
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
