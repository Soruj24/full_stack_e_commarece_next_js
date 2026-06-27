"use client";

import { useState } from "react";
import { Bell, BellRing, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStock } from "@/features/cart/context/StockContext";

interface BackInStockAlertProps {
  productId: string;
  productName: string;
  productImage?: string;
  variant?: "button" | "inline" | "card";
  className?: string;
}

export function BackInStockAlert({ productId, productName, productImage, variant = "button", className }: BackInStockAlertProps) {
  const { subscribeToStockAlert, unsubscribeFromStockAlert, isSubscribed } = useStock();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const isAlreadySubscribed = isSubscribed(productId);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) return;
    setIsSubmitting(true);
    await subscribeToStockAlert(productId, productName, productImage, email);
    setEmail("");
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleUnsubscribe = () => unsubscribeFromStockAlert(productId);

  if (variant === "inline") {
    if (isAlreadySubscribed) {
      return (
        <div className={cn("flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200", className)}>
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700">You&apos;ll be notified when this is back</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleUnsubscribe} className="text-green-600 hover:text-green-700 hover:bg-green-100">Cancel</Button>
        </div>
      );
    }
    if (showForm) {
      return (
        <div className={cn("p-4 bg-muted/50 rounded-xl space-y-3", className)}>
          <div className="flex items-center gap-2 text-sm"><BellRing className="w-4 h-4 text-muted-foreground" /><span>Get notified when this product is back in stock</span></div>
          <div className="flex gap-2">
            <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 h-10 rounded-lg" />
            <Button onClick={handleSubscribe} disabled={isSubmitting || !email} size="sm" className="h-10">{isSubmitting ? "..." : "Notify Me"}</Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="w-full">Cancel</Button>
        </div>
      );
    }
    return (
      <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className={cn("gap-2", className)}>
        <Bell className="w-4 h-4" />Notify When Available
      </Button>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-card rounded-2xl border p-6 space-y-4", className)}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl"><Bell className="w-6 h-6 text-primary" /></div>
          <div className="flex-1">
            <h4 className="font-semibold">Get Notified</h4>
            <p className="text-sm text-muted-foreground mt-1">This product is currently out of stock. Leave your email and we&apos;ll notify you when it&apos;s back.</p>
          </div>
        </div>
        {isAlreadySubscribed ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-700">You&apos;re on the list!</p>
              <p className="text-sm text-green-600">We&apos;ll email you when this is back.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleUnsubscribe} className="text-green-600">Cancel</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
            <Button onClick={handleSubscribe} disabled={isSubmitting || !email} className="w-full h-12 rounded-xl"><Bell className="w-4 h-4 mr-2" />Notify Me When Available</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => { isAlreadySubscribed ? handleUnsubscribe() : subscribeToStockAlert(productId, productName, productImage); }}
      className={cn("gap-2", isAlreadySubscribed && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100", className)}
    >
      {isAlreadySubscribed ? <><CheckCircle2 className="w-4 h-4" /> Subscribed</> : <><Bell className="w-4 h-4" /> Notify When Available</>}
    </Button>
  );
}
