"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex items-center justify-between mt-8">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
        className="rounded-xl px-6 h-12 gap-2 disabled:opacity-30"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      {currentStepId !== "payment" ||
      !["stripe"].includes(paymentMethod) ? (
        <Button
          onClick={
            currentStepId === "payment" ? onPlaceOrder : onContinue
          }
          disabled={loading}
          className="rounded-xl px-8 h-12 font-bold gap-2 shadow-lg"
        >
          {loading
            ? "Processing..."
            : currentStepId === "payment"
              ? "Place Order"
              : "Continue"}
          {currentStepId === "payment" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Button>
      ) : null}
    </div>
  );
}
