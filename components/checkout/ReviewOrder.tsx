"use client";

import Image from "next/image";
import { Edit2, MapPin, Truck, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice } from "@/lib/localization";
import type { ShippingRate, ShippingAddress } from "@/types/checkout";
import type { CartItem as CartItemType } from "@/context/CartContext";

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

export function ReviewOrder({
  cart,
  shippingAddress,
  selectedRate,
  onEditShipping,
  onEditDelivery,
  subtotal,
  shippingCost,
  tax,
  discount,
  total,
  paymentMethod,
}: ReviewOrderProps) {
  const { currency } = useLocalization();

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      stripe: "Credit/Debit Card",
      paypal: "PayPal",
      bkash: "bKash",
      nagad: "Nagad",
      rocket: "Rocket",
    };
    return labels[method] || method;
  };

  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Review Your Order</h2>
            <p className="text-sm text-muted-foreground">
              Make sure everything looks correct
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-muted/30 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-background rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ship to
                </span>
              </div>
              <p className="font-semibold">{shippingAddress.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {shippingAddress.street}
              </p>
              <p className="text-sm text-muted-foreground">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p className="text-sm text-muted-foreground">
                {shippingAddress.country}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {shippingAddress.phone}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary"
            onClick={onEditShipping}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Delivery Method */}
      <div className="bg-muted/30 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-background rounded-lg">
              <Truck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Delivery
              </span>
              {selectedRate ? (
                <>
                  <p className="font-semibold mt-1">
                    {selectedRate.carrier} {selectedRate.service}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRate.estimatedDays} business days
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatPrice(selectedRate.rate, currency)}
                    {selectedRate.rate === 0 && (
                      <span className="ml-2 text-green-600">FREE</span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  No delivery method selected
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary"
            onClick={onEditDelivery}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Items ({cart.length})
        </span>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background shrink-0">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price, currency)} each
              </p>
            </div>
            <p className="font-bold">
              {formatPrice(item.price * item.quantity, currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatPrice(shippingCost, currency)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(tax, currency)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount, currency)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total, currency)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-muted/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-background rounded-lg">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Payment Method
            </span>
            <p className="font-semibold mt-1">
              {getPaymentMethodLabel(paymentMethod)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
