"use client";

import { MapPin, Truck, CreditCard } from "lucide-react";
import { IOrder } from "@/types";

interface OrderDetailsGridProps {
  order: IOrder;
}

export function OrderDetailsGrid({ order }: OrderDetailsGridProps) {
  return (
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
  );
}