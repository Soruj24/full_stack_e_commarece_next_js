"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderProgressBarProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export function OrderProgressBar({ currentStep, steps, className }: OrderProgressBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent && "bg-primary text-primary-foreground",
                  isUpcoming && "bg-zinc-200 dark:bg-zinc-700 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-[10px] font-medium text-center max-w-[80px]",
                  isCompleted && "text-green-600",
                  isCurrent && "text-primary",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 px-4">
        {steps.slice(0, -1).map((_, index) => (
          <div key={index} className="flex-1">
            <div
              className={cn(
                "h-1 rounded-full transition-colors",
                index < currentStep ? "bg-green-500" : "bg-zinc-200 dark:bg-zinc-700"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
