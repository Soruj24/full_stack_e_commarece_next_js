"use client";

import { memo } from "react";
import Link from "next/link";
import { LogOut, User, LayoutDashboard, CreditCard, Settings, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
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
    ...(isAdmin ? [{ name: "Admin", href: "/admin/dashboard", icon: User }] : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/60 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-muted text-muted-foreground text-[11px] font-semibold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-xl border-border/40 bg-popover/95 backdrop-blur-xl mt-2">
        <div className="px-3 py-3">
          <p className="text-[13px] font-semibold text-foreground truncate">{user?.name}</p>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <div className="py-0.5">
          {items.map((item) => (
            <DropdownMenuItem key={item.name} asChild className="rounded-lg cursor-pointer px-3 py-2 focus:bg-muted/50">
              <Link href={item.href} className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[13px] font-medium">{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="rounded-lg text-red-500 focus:bg-red-500/5 cursor-pointer px-3 py-2">
          <LogOut className="w-4 h-4 mr-2.5" />
          <span className="text-[13px] font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
