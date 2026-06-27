"use client";

import { CreditCard, ShieldCheck, Truck, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodGridProps {
  paymentMethod: string;
  paymentEnabled: {
    stripe: boolean; paypal: boolean; cod: boolean; bkash: boolean; nagad: boolean; rocket: boolean;
  };
  onMethodChange: (method: string) => void;
}

export function PaymentMethodGrid({ paymentMethod, paymentEnabled, onMethodChange }: PaymentMethodGridProps) {
  const methods = [
    { id: "stripe", label: "Card", icon: CreditCard, sub: "Visa, Mastercard, Amex", enabled: paymentEnabled.stripe },
    { id: "paypal", label: "PayPal", icon: ShieldCheck, sub: "Fast & Secure", enabled: paymentEnabled.paypal },
    { id: "cod", label: "Cash on Delivery", icon: Truck, sub: "Pay at door", enabled: paymentEnabled.cod },
    { id: "bkash", label: "bKash", icon: Smartphone, sub: "Bangladesh", enabled: paymentEnabled.bkash },
    { id: "nagad", label: "Nagad", icon: Smartphone, sub: "Bangladesh", enabled: paymentEnabled.nagad },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {methods.map((method) => (
        <button key={method.id} onClick={() => method.enabled && onMethodChange(method.id)}
          disabled={!method.enabled}
          className={cn("p-4 rounded-xl border-2 text-center transition-all", paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50", !method.enabled && "opacity-50 cursor-not-allowed")}>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", paymentMethod === method.id ? "bg-primary text-white" : "bg-muted")}>
            <method.icon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm">{method.label}</h4>
          <p className="text-xs text-muted-foreground">{method.sub}</p>
        </button>
      ))}
    </div>
  );
}
