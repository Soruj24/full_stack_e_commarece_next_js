"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TokenErrorStateProps {
  error: string;
  onReturn: () => void;
}

export function TokenErrorState({ error, onReturn }: TokenErrorStateProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }} className="w-full">
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <div className="h-2 bg-destructive/50" />
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-black text-[10px] uppercase tracking-[0.3em] mx-auto">Invalid Link</div>
          <CardTitle className="text-5xl font-black tracking-tighter uppercase italic text-destructive">Link <span className="text-foreground">Expired.</span></CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">
            This password reset link is invalid or has reached its timeout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="font-black uppercase tracking-widest text-[10px] ml-2">{error}</AlertDescription>
          </Alert>
          <Button onClick={onReturn} className="w-full h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] mb-8">
            Return to Uplink
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
