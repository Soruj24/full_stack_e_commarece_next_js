"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaymentMethods, type PaymentMethodOption } from "@/lib/data/payment-methods";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  enabledMethods: Record<string, boolean>;
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange, enabledMethods }: PaymentMethodSelectorProps) {
  const methods = getPaymentMethods(enabledMethods);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Select Payment Method
      </h3>
      <div className="grid gap-3">
        {methods.map((method) => (
          <button key={method.id} onClick={() => method.enabled && onMethodChange(method.id)}
            disabled={!method.enabled}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              !method.enabled && "opacity-50 cursor-not-allowed"
            )}>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
              selectedMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground"
            )}>
              {selectedMethod === method.id && <Check className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">{method.icon}</div>
                <div>
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            </div>
            {!method.enabled && <span className="text-xs text-muted-foreground">Coming Soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
