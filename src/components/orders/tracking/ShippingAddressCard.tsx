"use client";

import { MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface ShippingAddressCardProps {
  address: {
    fullName?: string;
    name?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
}

export function ShippingAddressCard({ address }: ShippingAddressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 lg:p-8"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Shipping Address
      </h3>
      <div className="space-y-1 text-sm">
        <p className="font-medium">{address.fullName || address.name}</p>
        <p className="text-muted-foreground">{address.street}</p>
        <p className="text-muted-foreground">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-muted-foreground">{address.country}</p>
      </div>
      {address.phone && (
        <div className="flex items-center gap-2 mt-3 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{address.phone}</span>
        </div>
      )}
    </motion.div>
  );
}