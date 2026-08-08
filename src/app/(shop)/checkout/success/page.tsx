"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Package, Truck, CreditCard, ArrowRight, Home, ShoppingBag, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ORDER_STEPS = [
  { icon: Check, label: "Order Confirmed", color: "text-green-500" },
  { icon: Package, label: "Processing", color: "text-blue-500" },
  { icon: Truck, label: "Shipped", color: "text-purple-500" },
  { icon: CreditCard, label: "Delivered", color: "text-primary" },
];

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  const colors = ["bg-primary", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 8 + 4;
  const drift = (Math.random() - 0.5) * 200;

  return (
    <motion.div
      className={cn("absolute rounded-full", color)}
      style={{ width: size, height: size, left: `${x}%`, top: "30%" }}
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{
        y: [0, -80, 300],
        x: [0, drift, drift * 0.5],
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.5],
        rotate: [0, 360, 720],
      }}
      transition={{ duration: 2.5, delay, ease: "easeOut" }}
    />
  );
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const orderNumber = `NX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  useEffect(() => { setMounted(true); }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-primary/8 blur-[150px] rounded-full" />
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiParticle key={i} delay={Math.random() * 0.8} x={Math.random() * 100} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg"
      >
        <div className="rounded-3xl bg-card border border-border/30 shadow-2xl shadow-black/10 p-8 sm:p-10 text-center space-y-8">
          {/* Success Icon */}
          <motion.div
            className="relative mx-auto w-24 h-24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <div className="space-y-2">
            <motion.h1
              className="text-3xl font-black tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Order Placed!
            </motion.h1>
            <motion.p
              className="text-muted-foreground font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Thank you for your purchase. We&apos;ll send you a confirmation email shortly.
            </motion.p>
          </div>

          {/* Order Number */}
          <motion.div
            className="bg-muted/50 rounded-2xl p-4 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order Number</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg font-mono font-bold tracking-wider">{orderNumber}</p>
              <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Order Progress */}
          <motion.div
            className="flex items-center justify-between px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {ORDER_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2 relative">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    i === 0 ? "bg-green-500 border-green-500 text-white" : "bg-muted border-border text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{step.label}</span>
                  {i < ORDER_STEPS.length - 1 && (
                    <div className={cn(
                      "absolute top-5 left-full w-8 sm:w-12 h-0.5 -translate-x-[calc(50%+20px)] sm:-translate-x-[calc(50%+24px)]",
                      i === 0 ? "bg-green-500" : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1 h-12 rounded-xl font-bold"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => router.push("/products")}
              className="flex-1 h-12 rounded-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
