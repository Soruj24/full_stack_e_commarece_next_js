"use client";

import { Truck as TruckIcon, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShippingRate } from "@/lib/checkout-utils";
import { useLocalization } from "@/context/LocalizationContext";
import { convertPrice, formatPrice } from "@/lib/localization";
import { cn } from "@/lib/utils";

interface DeliveryStepProps {
  rates: ShippingRate[];
  selectedRate: ShippingRate | null;
  onSelect: (rate: ShippingRate) => void;
  onBack: () => void;
}

export function DeliveryStep({ rates, selectedRate, onSelect, onBack }: DeliveryStepProps) {
  const { currency } = useLocalization();

  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <TruckIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Delivery Method</h2>
          <p className="text-sm text-muted-foreground">
            How would you like to receive your order?
          </p>
        </div>
      </div>

      {rates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rates.map((rate) => (
            <button
              key={rate.id}
              onClick={() => onSelect(rate)}
              className={cn(
                "p-6 rounded-2xl border-2 text-left transition-all",
                selectedRate?.id === rate.id
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/50 bg-card",
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-muted">
                  <Truck className="w-5 h-5" />
                </div>
                {selectedRate?.id === rate.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <h4 className="font-bold mb-1">
                {rate.carrier} {rate.service}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {rate.estimatedDays}
              </p>
              <p className="text-lg font-black text-primary">
                {rate.rate === 0
                  ? "FREE"
                  : formatPrice(convertPrice(rate.rate, currency), currency)}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-muted/50 rounded-2xl">
          <p className="text-muted-foreground mb-4">
            Enter your ZIP code on the shipping step to see delivery options.
          </p>
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
}
