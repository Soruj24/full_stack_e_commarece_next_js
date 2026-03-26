"use client";

import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, EstimatedDelivery } from "@/components/orders/OrderTracking";
import { OrderStatus } from "@/context/OrderTrackingContext";
import { Check, AlertTriangle, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrackingStatusOverviewProps {
  currentStatus: OrderStatus;
  tracking: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    lastUpdated?: string;
  } | null;
}

export function TrackingStatusOverview({ currentStatus, tracking }: TrackingStatusOverviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (tracking?.trackingNumber) {
      navigator.clipboard.writeText(tracking.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIcon = () => {
    if (currentStatus === "delivered") return <Check className="w-8 h-8 text-green-500" />;
    if (currentStatus === "cancelled") return <AlertTriangle className="w-8 h-8 text-red-500" />;
    return <Truck className="w-8 h-8 text-primary" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 lg:p-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            {getStatusIcon()}
          </div>
          <div>
            <OrderStatusBadge status={currentStatus} className="mb-2" />
            <EstimatedDelivery
              estimatedDate={tracking?.estimatedDelivery}
              status={currentStatus}
            />
          </div>
        </div>

        {tracking?.trackingNumber && (
          <div className="flex items-center gap-2">
            <Input
              value={tracking.trackingNumber}
              readOnly
              className="w-48 bg-muted"
            />
            <Button size="icon" variant="ghost" onClick={handleCopy} aria-label="Copy tracking number">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            {tracking.carrier && (
              <a
                href={`https://track.aftership.com/${tracking.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon" variant="ghost" aria-label="Track shipment">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { Check as CheckIcon } from "lucide-react";