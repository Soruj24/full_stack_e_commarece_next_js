"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  Inbox,
  History,
  Settings,
  Search,
  Plus,
  UserPlus,
  Shield,
  Command as CommandIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-xl border border-border transition-all group"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-block">Search commands...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/dashboard"))}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/dashboard?tab=users"))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Users</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/dashboard?tab=inquiries"))}
            >
              <Inbox className="mr-2 h-4 w-4" />
              <span>Inquiries</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/dashboard?tab=audit"))}
            >
              <History className="mr-2 h-4 w-4" />
              <span>Audit Logs</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/dashboard?tab=settings"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>General Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                runCommand(() => {
                  window.dispatchEvent(new CustomEvent("open-invite-dialog"));
                });
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite New User</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
