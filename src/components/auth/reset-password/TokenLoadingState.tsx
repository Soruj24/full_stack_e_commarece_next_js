"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function TokenLoadingState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2">
        <CardContent className="pt-20 pb-20">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="h-20 w-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            <span className="text-[10px] font-black text-primary animate-pulse tracking-[0.4em] uppercase">Authenticating Link...</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
