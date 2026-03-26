"use client";

import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

interface CartFeaturesProps {
  shipping: number;
}

export function CartFeatures({ shipping }: CartFeaturesProps) {
  const features = [
    {
      icon: Truck,
      text: shipping === 0 ? "Free Shipping" : "Standard Shipping",
    },
    {
      icon: ShieldCheck,
      text: "Secure Checkout",
    },
    {
      icon: RotateCcw,
      text: "30 Day Returns",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
      {features.map((feature, i) => (
        <div
          key={i}
          className="p-8 rounded-[32px] bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-3"
        >
          <feature.icon className="w-6 h-6 text-primary" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {feature.text}
          </p>
        </div>
      ))}
    </div>
  );
}