"use client";

import { CheckCircle2, MapPin, Truck } from "lucide-react";
import { useLocalization } from "@/features/common/hooks/LocalizationContext";
import { formatPrice } from "@/lib/localization";
import { ReviewDeliveryCard } from "./ReviewDeliveryCard";
import { ReviewItemList } from "./ReviewItemList";
import { ReviewOrderSummary } from "./ReviewOrderSummary";
import { ReviewPaymentCard } from "./ReviewPaymentCard";
import type { ShippingRate, ShippingAddress } from "@/features/checkout/types/checkout";
import type { CartItem as CartItemType } from "@/features/cart/context/CartContext";

interface ReviewOrderProps {
  cart: CartItemType[];
  shippingAddress: ShippingAddress;
  selectedRate: ShippingRate | null;
  onEditShipping: () => void;
  onEditDelivery: () => void;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export function ReviewOrder({ cart, shippingAddress, selectedRate, onEditShipping, onEditDelivery,
  subtotal, shippingCost, tax, discount, total, paymentMethod }: ReviewOrderProps) {
  const { currency } = useLocalization();

  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Review Your Order</h2>
            <p className="text-sm text-muted-foreground">Make sure everything looks correct</p>
          </div>
        </div>
      </div>

      <ReviewDeliveryCard icon={<MapPin className="w-4 h-4 text-primary" />} label="Ship to" onEdit={onEditShipping}>
        <p className="font-semibold">{shippingAddress.fullName}</p>
        <p className="text-sm text-muted-foreground">{shippingAddress.street}</p>
        <p className="text-sm text-muted-foreground">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
        <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
        <p className="text-sm text-muted-foreground mt-1">{shippingAddress.phone}</p>
      </ReviewDeliveryCard>

      <ReviewDeliveryCard icon={<Truck className="w-4 h-4 text-primary" />} label="Delivery" onEdit={onEditDelivery}>
        {selectedRate ? (
          <>
            <p className="font-semibold mt-1">{selectedRate.carrier} {selectedRate.service}</p>
            <p className="text-sm text-muted-foreground">{selectedRate.estimatedDays} business days</p>
            <p className="text-sm font-semibold text-primary mt-1">
              {formatPrice(selectedRate.rate, currency)}
              {selectedRate.rate === 0 && <span className="ml-2 text-green-600">FREE</span>}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">No delivery method selected</p>
        )}
      </ReviewDeliveryCard>

      <ReviewItemList items={cart} />
      <ReviewOrderSummary subtotal={subtotal} shippingCost={shippingCost} tax={tax} discount={discount} total={total} />
      <ReviewPaymentCard paymentMethod={paymentMethod} />
    </div>
  );
}
