"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Inbox, History, Settings, Search,
  UserPlus, ShoppingBag, Package, DollarSign,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function AdminCommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full max-w-md px-3 py-2 text-xs text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg border border-border/60 transition-colors"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">Search or jump to...</span>
        <kbd className="ml-auto text-[10px] text-muted-foreground/60 border border-border/60 rounded px-1 py-0.5 font-mono shrink-0">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages and actions..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/orders"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/products"))}>
              <Package className="mr-2 h-4 w-4" />
              <span>Products</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/users"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Customers</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/sales"))}>
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Sales</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/dashboard?tab=inquiries"))}>
              <Inbox className="mr-2 h-4 w-4" />
              <span>View Inquiries</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/dashboard?tab=audit"))}>
              <History className="mr-2 h-4 w-4" />
              <span>Audit Logs</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
