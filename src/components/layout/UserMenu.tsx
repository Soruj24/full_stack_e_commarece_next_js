"use client";

import { memo } from "react";
import Link from "next/link";
import { LogOut, Home, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  isAdmin: boolean;
  onLogout: () => void;
}

export const UserMenu = memo(function UserMenu({ user, isAdmin, onLogout }: UserMenuProps) {
  const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: UserIcon },
    ...(isAdmin ? [{ name: "Admin", href: "/admin/dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="pl-1 sm:pl-1.5 pr-2 sm:pr-4 py-1 sm:py-1.5 h-10 sm:h-12 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border/40"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-background shadow-md">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-[8px] sm:text-[10px] font-black">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full ring-2 ring-background shadow-sm" />
            </div>
            <div className="flex flex-col items-start text-left hidden lg:flex">
              <span className="text-xs font-black text-foreground leading-none uppercase tracking-tight">
                {user?.name}
              </span>
              <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] mt-1 opacity-80">
                {user?.role}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-2 rounded-[28px] shadow-2xl border-border/40 bg-popover/95 backdrop-blur-xl mt-2"
      >
        <div className="px-4 py-4 mb-1">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Signed in as
          </p>
          <p className="text-sm font-black text-foreground truncate">
            {user?.name}
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/70 truncate">
            {user?.email}
          </p>
        </div>
        <div className="h-[1px] bg-border/40 mx-2 mb-2" />
        <div className="space-y-1">
          {userNavigation.map((item) => (
            <DropdownMenuItem
              key={item.name}
              asChild
              className="rounded-2xl focus:bg-primary/5 focus:text-primary cursor-pointer px-4 py-2.5 transition-colors group"
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-3 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {item.name}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="h-[1px] bg-border/40 mx-2 my-2" />
        <DropdownMenuItem
          onClick={onLogout}
          className="rounded-2xl text-red-500 focus:bg-red-500/5 focus:text-red-600 cursor-pointer px-4 py-2.5 transition-colors group"
        >
          <LogOut className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
