"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl w-9 h-9 hover:bg-primary/10 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl p-2 shadow-xl border-border/40">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors",
            theme === "light" ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <Sun className="h-4 w-4" />
          <span className="text-sm font-medium">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors",
            theme === "dark" ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <Moon className="h-4 w-4" />
          <span className="text-sm font-medium">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors",
            theme === "system" ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <Laptop className="h-4 w-4" />
          <span className="text-sm font-medium">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
