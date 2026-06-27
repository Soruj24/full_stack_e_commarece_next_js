"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ContactSuccessProps {
  onReset: () => void;
}

export function ContactSuccess({ onReset }: ContactSuccessProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center text-center py-20"
    >
      <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
      </div>
      <h2 className="text-4xl font-black text-foreground mb-4">Message Sent!</h2>
      <p className="text-xl text-muted-foreground font-medium mb-10 max-w-md">
        Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
      </p>
      <Button 
        onClick={onReset}
        variant="outline"
        className="h-14 px-10 rounded-2xl border-2 font-bold text-lg hover:bg-muted"
      >
        Send Another Message
      </Button>
    </motion.div>
  );
}