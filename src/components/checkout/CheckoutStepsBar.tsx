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
        <div className="flex items-center justify-between py-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                {/* Step Button */}
                <button
                  onClick={() => isCompleted && onStepClick(index)}
                  disabled={isFuture}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 group relative",
                    isActive && "bg-primary/10",
                    isCompleted && "cursor-pointer hover:bg-primary/5",
                    isFuture && "cursor-not-allowed opacity-40"
                  )}
                >
                  {/* Step Circle */}
                  <div className="relative">
                    <motion.div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
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

                  {/* Label */}
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider hidden sm:block transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-foreground",
                    isFuture && "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </button>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-0.5 rounded-full bg-border/50 overflow-hidden">
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
