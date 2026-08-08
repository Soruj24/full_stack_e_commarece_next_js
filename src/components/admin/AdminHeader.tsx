"use client";

import { useSession } from "next-auth/react";
import { Bell, Menu, LogOut, User as UserIcon, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { ThemeToggle } from "./ui/ThemeToggle";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-14 border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-30 px-4 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 rounded-lg shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="hidden md:block flex-1 max-w-md">
          <AdminCommandPalette />
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>

        <div className="w-px h-5 bg-border/60 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-1.5 pr-3 h-9 rounded-lg gap-2 hover:bg-muted/50"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {session?.user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {session?.user?.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2 text-sm">
              <UserIcon className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
