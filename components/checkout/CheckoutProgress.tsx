"use client";

import { User, MapPin, Truck, ClipboardCheck, CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/types/checkout";

interface Step {
  id: CheckoutStep;
  label: string;
  icon: typeof User;
}

const STEPS: Step[] = [
  { id: "account", label: "Account", icon: User },
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "review", label: "Review", icon: ClipboardCheck },
  { id: "payment", label: "Payment", icon: CreditCard },
];

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  onStepClick?: (step: CheckoutStep) => void;
}

export function CheckoutProgress({
  currentStep,
  completedSteps,
  onStepClick,
}: CheckoutProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const getStepStatus = (index: number) => {
    if (index < currentIndex || completedSteps.includes(STEPS[index].id)) {
      return "completed";
    }
    if (index === currentIndex) {
      return "active";
    }
    return "pending";
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-center min-w-max px-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);
          const isClickable = status === "completed" && onStepClick;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isClickable && "cursor-pointer hover:opacity-80"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                    status === "completed" &&
                      "bg-green-500 text-white shadow-lg shadow-green-500/30",
                    status === "active" &&
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                    status === "pending" &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {status === "completed" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden md:block transition-colors",
                    status === "completed" && "text-green-600",
                    status === "active" && "text-primary",
                    status === "pending" && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-8 md:w-16 h-0.5 mx-1 md:mx-2 transition-all",
                    index < currentIndex
                      ? "bg-green-500"
                      : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  step: number;
  total: number;
  label?: string;
}

export function StepIndicator({ step, total, label }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium">
        Step {step} of {total}
      </span>
      {label && (
        <>
          <span>•</span>
          <span>{label}</span>
        </>
      )}
    </div>
  );
}
