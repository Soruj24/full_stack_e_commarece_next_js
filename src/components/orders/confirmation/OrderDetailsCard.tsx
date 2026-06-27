"use client";

import Image from "next/image";
import { MapPin, Truck, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFallbackImage, getSafeImageSrc } from "@/lib/utils";

interface OrderDetailsCardProps {
  order: {
    _id: string;
    orderStatus: string;
    paymentStatus: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    shippingCarrier?: string;
    shippingService?: string;
    trackingNumber?: string;
    paymentMethod: string;
    items: {
      name: string;
      image?: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
    shippingPrice: number;
    taxPrice: number;
  };
}

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const subtotal = order.totalAmount - order.shippingPrice - order.taxPrice;

  return (
    <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden print:border-none print:shadow-none">
      <div className="p-10 border-b border-border/50 bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Order ID
          </p>
          <h3 className="text-xl font-black uppercase">
            {order._id.slice(-12)}
          </h3>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
            {order.orderStatus}
          </Badge>
          <Badge className="bg-green-500/10 text-green-500 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <MapPin className="w-5 h-5" />
            <h4 className="font-black text-xs uppercase tracking-widest">
              Shipping Address
            </h4>
          </div>
          <div className="text-sm font-medium text-muted-foreground leading-relaxed">
            <p className="text-foreground font-black">
              {order.shippingAddress.street}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Truck className="w-5 h-5" />
            <h4 className="font-black text-xs uppercase tracking-widest">
              Delivery Method
            </h4>
          </div>
          <div className="text-sm font-medium text-muted-foreground leading-relaxed">
            <p className="text-foreground font-black">
              {order.shippingCarrier || "Standard"}{" "}
              {order.shippingService || "Delivery"}
            </p>
            {order.trackingNumber ? (
              <p className="text-primary font-black mt-1">
                Tracking: {order.trackingNumber}
              </p>
            ) : (
              <p>Estimated Arrival: 3-5 Business Days</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <CreditCard className="w-5 h-5" />
            <h4 className="font-black text-xs uppercase tracking-widest">
              Payment Info
            </h4>
          </div>
          <div className="text-sm font-medium text-muted-foreground leading-relaxed">
            <p className="text-foreground font-black uppercase">
              {order.paymentMethod}
            </p>
            <p>Transaction: SEC-{order._id.slice(0, 8)}</p>
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 space-y-8">
        <div className="h-px bg-border/50" />
        <div className="space-y-6">
          <h4 className="font-black text-xs uppercase tracking-widest text-primary">
            Order Items
          </h4>
          <div className="space-y-4">
            {order.items.map((item, idx: number) => (
              <div key={idx} className="flex items-center gap-6 group">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0">
                  <Image
                    src={getSafeImageSrc(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImage();
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-black text-sm group-hover:text-primary transition-colors">
                    {item.name}
                  </h5>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-black text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <div className="flex flex-col items-end space-y-3">
          <div className="flex justify-between w-full max-w-xs text-sm font-medium">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-black">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-xs text-sm font-medium">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-black">${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-xs text-sm font-medium">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-black">${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-xs pt-4 border-t border-border/50">
            <span className="text-lg font-black tracking-tight">
              Grand Total
            </span>
            <span className="text-3xl font-black tracking-tighter text-primary">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}