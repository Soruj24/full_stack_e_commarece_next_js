"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PriceDropAlertProps {
  productId: string;
  productName: string;
  currentPrice: number;
  originalPrice?: number;
  onSuccess?: () => void;
}

export function PriceDropAlert({
  productId,
  productName,
  currentPrice,
  originalPrice,
  onSuccess,
}: PriceDropAlertProps) {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(session?.user?.email || "");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const potentialSavings = originalPrice ? originalPrice - currentPrice : 0;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email,
          currentPrice,
          productName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubscribed(true);
        toast.success("You'll be notified when the price drops!");
        onSuccess?.();
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/price-alerts?productId=${productId}&email=${email}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setIsSubscribed(false);
        toast.success("Price alert removed");
      } else {
        toast.error(data.error || "Failed to unsubscribe");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-green-800 dark:text-green-400">
                Alert Active
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                We'll email you when price drops
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="text-green-700 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-500/20"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">Price Drop Alert</p>
            {potentialSavings > 0 && (
              <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-500/20 px-2 py-0.5 rounded-full">
                Save ${potentialSavings.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Get notified when the price drops. No spam, unsubscribe anytime.
          </p>

          {!showEmailInput ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailInput(true)}
              className="rounded-xl"
            >
              <BellRing className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl text-sm"
              />
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmailInput(false)}
                className="h-10 w-10 rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
