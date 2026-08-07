"use client";

import { memo } from "react";
import Link from "next/link";
import {
  LogOut, User, LayoutDashboard, CreditCard,
  Settings, Heart, ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string };
  isAdmin: boolean;
  onLogout: () => void;
}

export const UserMenu = memo(function UserMenu({ user, isAdmin, onLogout }: UserMenuProps) {
  const items = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: CreditCard },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ...(isAdmin ? [{ name: "Admin Panel", href: "/admin/dashboard", icon: User }] : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-accent/60 transition-colors duration-150 focus-premium"
          aria-label="User menu"
        >
          <Avatar size="sm">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback variant="primary">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-1.5 rounded-xl shadow-xl border-border/40 bg-popover/95 backdrop-blur-xl mt-2"
      >
        <div className="px-3 py-3 border-b border-border/30 mb-1">
          <p className="text-[13px] font-semibold text-foreground truncate">
            {user?.name}
          </p>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
            {user?.email}
          </p>
        </div>
        <div className="py-0.5">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.name}
              asChild
              className="rounded-lg cursor-pointer px-3 py-2 focus:bg-muted/50"
            >
              <Link href={item.href} className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-[13px] font-medium">{item.name}</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="rounded-lg text-destructive focus:bg-destructive/5 cursor-pointer px-3 py-2"
        >
          <LogOut className="w-4 h-4 mr-2.5" />
          <span className="text-[13px] font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
