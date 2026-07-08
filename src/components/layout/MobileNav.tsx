"use client";

import { ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ProductSearch } from "@/components/products/ProductSearch";
import { MobileNavLinks } from "./MobileNavLinks";
import { MobileNavCategories } from "./MobileNavCategories";
import { MobileNavFooter } from "./MobileNavFooter";
import { ICategory } from "@/shared/types";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  isAdmin: boolean;
  pathname: string;
  categories: ICategory[];
  onLogout: () => void;
}

export function MobileNav({
  open,
  onOpenChange,
  user,
  isAdmin,
  pathname,
  categories,
  onLogout,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[450px] p-0 border-l-0 bg-background/95 backdrop-blur-2xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Access platform features and account settings
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="p-6 sm:p-8 border-b border-border/40 flex items-center justify-between relative z-10 bg-background/50 backdrop-blur-md">
            <div className="flex items-center gap-4 group">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                <ShieldCheck className="text-white h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tighter italic">
                  NEXUS
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">
                  Identity Core
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all h-10 w-10 sm:h-12 sm:w-12"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative z-[50]"
            >
              <ProductSearch />
            </motion.div>

            <MobileNavLinks
              pathname={pathname}
              onClose={() => onOpenChange(false)}
            />

            <MobileNavCategories
              categories={categories}
              onClose={() => onOpenChange(false)}
            />
          </div>

          <MobileNavFooter
            user={user}
            isAdmin={isAdmin}
            onLogout={onLogout}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
