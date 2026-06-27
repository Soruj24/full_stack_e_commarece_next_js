"use client";

import { useState } from "react";
import { Bell, BellRing, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface BackInStockAlertProps {
  productId: string;
  productName: string;
  currentStock?: number;
  userEmail?: string;
}

export function BackInStockAlert({ productId, productName, currentStock, userEmail }: BackInStockAlertProps) {
  const [email, setEmail] = useState(userEmail || "");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setSubscribed(true);
      toast.success("You'll be notified when this item is back in stock!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stock-alerts?productId=${productId}&email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSubscribed(false);
        toast.success("Alert cancelled");
      }
    } catch {
      toast.error("Failed to cancel alert");
    } finally {
      setLoading(false);
    }
  };

  if (currentStock !== undefined && currentStock > 5) {
    return null;
  }

  if (subscribed) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <BellRing className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Alert Active</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll email you when &quot;{productName}&quot; is back
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleUnsubscribe} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium">Out of Stock</p>
            <p className="text-sm text-muted-foreground">
              Get notified when &quot;{productName}&quot; is back
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSubscribe} disabled={loading || !email}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />}
            Notify Me
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
