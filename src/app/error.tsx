"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const animate = prefersReduced ? false : "visible";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-destructive/5 blur-[150px] rounded-full" />
      </div>

      <motion.div
        className="max-w-md w-full text-center"
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate={animate}
      >
        {/* Icon */}
        <motion.div variants={staggerItem} className="mb-8">
          <motion.div
            className="relative mx-auto w-24 h-24"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-destructive/5 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-black mb-4 tracking-tight"
        >
          Something Went Wrong
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={staggerItem}
          className="text-muted-foreground mb-8 leading-relaxed"
        >
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or contact support if the problem persists.
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold transition-colors hover:bg-primary/90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
          <motion.a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-xl font-bold transition-colors hover:bg-muted"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-4 h-4" />
            Go Home
          </motion.a>
        </motion.div>

        {/* Error digest (dev only) */}
        {process.env.NODE_ENV === "development" && error?.digest && (
          <motion.div
            variants={staggerItem}
            className="mt-8 p-4 bg-muted rounded-xl text-left"
          >
            <p className="text-xs font-mono text-muted-foreground break-all">
              Error ID: {error.digest}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
