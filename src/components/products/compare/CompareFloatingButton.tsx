"use client";

import { useCompare } from "@/features/compare/context/CompareContext";
import { GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CompareContent } from "./CompareContent";

export function CompareFloatingButton() {
  const { products, maxProducts } = useCompare();

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <Sheet>
        <SheetTrigger asChild>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl shadow-2xl border p-4 cursor-pointer hover:shadow-3xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <GitCompare className="w-5 h-5 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {products.length}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">Compare</p>
                <p className="text-xs text-muted-foreground">
                  {products.length}/{maxProducts} products
                </p>
              </div>
            </div>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[450px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              Compare Products
            </SheetTitle>
            <SheetDescription>
              Compare up to {maxProducts} products side by side
            </SheetDescription>
          </SheetHeader>
          <CompareContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}
