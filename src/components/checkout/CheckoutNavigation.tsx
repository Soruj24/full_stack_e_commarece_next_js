"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CheckoutNavigationProps {
  currentStep: number;
  currentStepId: string;
  paymentMethod: string;
  loading: boolean;
  onBack: () => void;
  onContinue: () => void;
  onPlaceOrder: () => void;
}

export function CheckoutNavigation({
  currentStep,
  currentStepId,
  paymentMethod,
  loading,
  onBack,
  onContinue,
  onPlaceOrder,
}: CheckoutNavigationProps) {
  const isPayment = currentStepId === "payment";
  const isStripe = paymentMethod === "stripe";

  return (
    <motion.div
      className="flex items-center justify-between mt-8 pt-6 border-t border-border/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
        className="rounded-xl px-6 h-12 gap-2 disabled:opacity-30 font-semibold hover:bg-muted/50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {!(isPayment && isStripe) && (
        <Button
          onClick={isPayment ? onPlaceOrder : onContinue}
          disabled={loading}
          className="rounded-xl px-8 h-12 font-bold gap-2 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : isPayment ? (
            <>
              Place Order
              <CheckCircle2 className="w-4 h-4" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}
