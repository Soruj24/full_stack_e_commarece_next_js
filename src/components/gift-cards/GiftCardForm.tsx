"use client";

import { useState } from "react";
import { Gift, X, Loader2, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface GiftCardInfo {
  code: string;
  amount: number;
  remainingBalance: number;
  currency: string;
  isValid: boolean;
  expiresAt: string;
  senderName: string;
  message?: string;
}

interface GiftCardFormProps {
  onApply?: (code: string, amount: number) => void;
  appliedCode?: string;
  onRemove?: () => void;
  maxAmount?: number;
}

export function GiftCardForm({ onApply, appliedCode, onRemove, maxAmount }: GiftCardFormProps) {
  const [code, setCode] = useState(appliedCode || "");
  const [loading, setLoading] = useState(false);
  const [giftCardInfo, setGiftCardInfo] = useState<GiftCardInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateGiftCard = async () => {
    if (!code.trim()) {
      setError("Please enter a gift card code");
      return;
    }

    setLoading(true);
    setError(null);
    setGiftCardInfo(null);

    try {
      const res = await fetch(`/api/gift-cards/${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid gift card");
      }

      if (!data.giftCard.isValid) {
        throw new Error("This gift card is no longer valid");
      }

      setGiftCardInfo(data.giftCard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to validate gift card");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (giftCardInfo && onApply) {
      const applyAmount = maxAmount
        ? Math.min(giftCardInfo.remainingBalance, maxAmount)
        : giftCardInfo.remainingBalance;
      onApply(giftCardInfo.code, applyAmount);
      toast.success(`Gift card applied! $${applyAmount.toFixed(2)} added`);
    }
  };

  const handleRemove = () => {
    setCode("");
    setGiftCardInfo(null);
    setError(null);
    if (onRemove) onRemove();
    toast.success("Gift card removed");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(giftCardInfo?.code || code);
    toast.success("Code copied to clipboard");
  };

  if (appliedCode && giftCardInfo) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{giftCardInfo.code}</span>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Applied
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${giftCardInfo.remainingBalance.toFixed(2)} remaining
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Enter gift card code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="pl-10 font-mono tracking-wider"
            disabled={loading}
          />
        </div>
        <Button variant="outline" onClick={validateGiftCard} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Validate"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {giftCardInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg tracking-wider">{giftCardInfo.code}</span>
                  <Button variant="ghost" size="sm" onClick={copyCode}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <Badge variant="secondary">
                  {giftCardInfo.remainingBalance < giftCardInfo.amount ? "Partially Used" : "Full Balance"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="font-medium">${giftCardInfo.amount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-bold text-green-600">
                  ${giftCardInfo.remainingBalance.toFixed(2)}
                </span>
              </div>

              {giftCardInfo.senderName && (
                <div className="text-sm">
                  <span className="text-muted-foreground">From: </span>
                  <span>{giftCardInfo.senderName}</span>
                </div>
              )}

              {giftCardInfo.message && (
                <p className="text-sm italic text-muted-foreground bg-muted/50 p-2 rounded">
                  &quot;{giftCardInfo.message}&quot;
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Expires:</span>
                <span>{new Date(giftCardInfo.expiresAt).toLocaleDateString()}</span>
              </div>

              <Button className="w-full" onClick={handleApply}>
                Apply ${Math.min(giftCardInfo.remainingBalance, maxAmount || Infinity).toFixed(2)} to order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
