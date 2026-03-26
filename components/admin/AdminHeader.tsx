"use client";

import { useSession } from "next-auth/react";
import { 
  Bell, 
  Search, 
  Menu, 
  User as UserIcon,
  LogOut,
  Settings,
  ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { AdminCommandPalette } from "./AdminCommandPalette";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="hidden md:block">
          <AdminCommandPalette />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl relative" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="pl-2 pr-4 h-12 rounded-2xl gap-3 hover:bg-muted/50">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {session?.user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left hidden sm:flex">
                <span className="text-sm font-bold text-foreground leading-none">
                  {session?.user?.name}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Administrator
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border">
            <DropdownMenuLabel className="font-bold px-3 py-2">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl p-3 font-medium cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl p-3 font-medium cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4" /> Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-xl p-3 font-medium cursor-pointer text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
