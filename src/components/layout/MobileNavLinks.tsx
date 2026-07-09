"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Home, Mail, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavLinksProps {
  pathname: string;
  onClose: () => void;
}

const publicNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
];

export const MobileNavLinks = memo(function MobileNavLinks({ pathname, onClose }: MobileNavLinksProps) {
  return (
    <div className="space-y-3">
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-5 px-2">
        System Access
      </p>
      <div className="space-y-2">
        {publicNavigation.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-[22px] transition-all group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                    : "hover:bg-muted/50 border border-transparent hover:border-border/40",
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-white/20"
                        : "bg-primary/5 text-primary group-hover:bg-primary/10",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">
                    {item.name}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 -rotate-90 transition-opacity relative z-10",
                    isActive
                      ? "opacity-100"
                      : "opacity-20 group-hover:opacity-100",
                  )}
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.02] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
