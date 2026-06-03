"use client";

import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { useStock } from "@/context/StockContext";

export function StockAlertsList() {
  const { alerts, unsubscribeFromStockAlert } = useStock();

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No stock alerts yet</p>
        <p className="text-sm text-muted-foreground/70">Subscribe to get notified when out-of-stock items are back</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <motion.div
          key={alert.productId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-card rounded-xl border"
        >
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
            {alert.productImage ? (
              <Image
                src={getSafeImageSrc(alert.productImage)}
                alt={alert.productName}
                fill
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(); }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{alert.productName}</p>
            <p className="text-sm text-muted-foreground">{alert.email ? `Notifying: ${alert.email}` : "Subscribed"}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => unsubscribeFromStockAlert(alert.productId)} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
