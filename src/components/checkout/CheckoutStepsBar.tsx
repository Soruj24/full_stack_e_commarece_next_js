"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string; label: string; icon: React.ComponentType<{ className?: string }>;
}

interface CheckoutStepsBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function CheckoutStepsBar({ steps, currentStep, onStepClick }: CheckoutStepsBarProps) {
  return (
    <div className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isCompleted && onStepClick(index)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer",
                    !isActive && !isCompleted && "text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    isActive && "bg-white/20",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-muted",
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="font-semibold text-sm hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={cn("w-12 sm:w-20 h-0.5 mx-2", isCompleted ? "bg-green-500" : "bg-muted")} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
