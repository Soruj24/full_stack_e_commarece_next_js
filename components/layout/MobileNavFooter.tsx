"use client";

import Link from "next/link";
import { LogOut, Home, User as UserIcon, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MobileNavFooterProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  isAdmin: boolean;
  onLogout: () => void;
  onClose: () => void;
}

const userNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

export function MobileNavFooter({ user, isAdmin, onLogout, onClose }: MobileNavFooterProps) {
  const displayedNav = [
    ...userNavigation,
    ...(isAdmin ? [{ name: "Admin", href: "/admin/dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="p-6 sm:p-8 bg-muted/30 border-t border-border/40 relative z-10 backdrop-blur-md">
      {user ? (
        <div className="flex flex-col gap-6">
          {displayedNav.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-1 px-2">
                Authorized Ops
              </p>
              {displayedNav.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-background shadow-lg">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-primary text-white text-[12px] font-black">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-4 ring-background shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tight italic">
                {user?.name}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {user?.role}
              </span>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start gap-4 h-16 sm:h-20 px-6 rounded-2xl sm:rounded-[28px] text-red-500 hover:text-red-600 hover:bg-red-500/5 font-black uppercase tracking-widest text-[11px] sm:text-[12px] border border-transparent hover:border-red-500/20 transition-all"
          >
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            Terminate Session
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Button
            asChild
            variant="outline"
            className="h-16 sm:h-20 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest text-[10px] sm:text-[11px] border-border/60 hover:bg-muted hover:border-foreground/20 transition-all italic"
          >
            <Link href="/login" onClick={onClose}>Initialize</Link>
          </Button>
          <Button
            asChild
            className="h-16 sm:h-20 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest text-[10px] sm:text-[11px] bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all italic"
          >
            <Link href="/register" onClick={onClose}>Join Nexus</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
