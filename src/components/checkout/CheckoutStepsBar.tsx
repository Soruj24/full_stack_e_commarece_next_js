"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CheckoutStepsBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function CheckoutStepsBar({ steps, currentStep, onStepClick }: CheckoutStepsBarProps) {
  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4 overflow-x-auto scrollbar-none gap-1 sm:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step.id} className="flex items-center flex-shrink-0 last:flex-none">
                {/* Step Button */}
                <button
                  onClick={() => isCompleted && onStepClick(index)}
                  disabled={isFuture}
                  className={cn(
                    "flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-2 rounded-xl transition-all duration-300 group relative",
                    isActive && "bg-primary/10",
                    isCompleted && "cursor-pointer hover:bg-primary/5",
                    isFuture && "cursor-not-allowed opacity-40"
                  )}
                >
                  {/* Step Circle */}
                  <div className="relative">
                    <motion.div
                      className={cn(
                        "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300",
                        isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                        isCompleted && "bg-primary text-primary-foreground",
                        isFuture && "bg-muted text-muted-foreground"
                      )}
                      animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </motion.div>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </div>

                  {/* Label — hidden on very small screens */}
                  <span className={cn(
                    "text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:block transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-foreground",
                    isFuture && "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </button>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="w-4 sm:w-6 lg:w-10 mx-0.5 sm:mx-1 h-0.5 rounded-full bg-border/50 overflow-hidden flex-shrink-0">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        isCompleted ? "bg-primary" : "bg-transparent"
                      )}
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
