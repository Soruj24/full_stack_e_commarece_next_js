"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, CreditCard, Mail, User, MessageSquare, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const giftCardAmounts = [10, 25, 50, 100, 200, 500];

interface GiftCardFormData {
  amount: number;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GiftCardFormData>({
    amount: 0,
    senderName: "",
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
  });
  const [createdCard, setCreatedCard] = useState<{ code: string; amount: number } | null>(null);

  const currentAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setFormData((prev) => ({ ...prev, amount }));
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 1) {
      setFormData((prev) => ({ ...prev, amount: num }));
    }
  };

  const handleInputChange = (field: keyof GiftCardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentAmount < 1) {
      toast.error("Please select or enter a valid amount");
      return;
    }

    if (!formData.senderName || !formData.senderEmail || !formData.recipientName || !formData.recipientEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: currentAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create gift card");
      }

      setCreatedCard({ code: data.giftCard.code, amount: data.giftCard.amount });
      toast.success("Gift card created successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create gift card");
    } finally {
      setLoading(false);
    }
  };

  if (createdCard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Gift Card Created!</h2>
              <p className="text-muted-foreground mb-8">
                Your digital gift card has been created and is ready to use.
              </p>
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl p-8 mb-8">
                <p className="text-sm text-muted-foreground mb-2">Gift Card Code</p>
                <p className="text-3xl font-mono font-bold tracking-wider mb-4">{createdCard.code}</p>
                <p className="text-2xl font-bold text-primary">${createdCard.amount.toFixed(2)}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Share this code with {formData.recipientName || "the recipient"} so they can use it at checkout.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => {
                  navigator.clipboard.writeText(createdCard.code);
                  toast.success("Code copied!");
                }}>
                  Copy Code
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Shopping
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black mb-4">Digital Gift Cards</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Give the perfect gift. Digital gift cards delivered instantly via email.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Choose Amount</CardTitle>
                <CardDescription>Select a gift card value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {giftCardAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={cn(
                        "p-4 rounded-xl border-2 font-bold text-lg transition-all",
                        selectedAmount === amount
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div>
                  <Label htmlFor="custom-amount">Or enter custom amount</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      className="pl-7 text-lg"
                    />
                  </div>
                </div>

                {currentAmount > 0 && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Selected Amount</p>
                    <p className="text-3xl font-bold text-primary">${currentAmount.toFixed(2)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recipient Details</CardTitle>
                <CardDescription>Who is this gift for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="recipient-name"
                      placeholder="Jane Smith"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange("recipientName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient-email">Recipient Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="recipient-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.recipientEmail}
                      onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-3">Your Details</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sender-name">Your Name *</Label>
                      <Input
                        id="sender-name"
                        placeholder="John Doe"
                        value={formData.senderName}
                        onChange={(e) => handleInputChange("senderName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sender-email">Your Email *</Label>
                      <Input
                        id="sender-email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.senderEmail}
                        onChange={(e) => handleInputChange("senderEmail", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (optional)</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      id="message"
                      placeholder="Add a personal message..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="w-full min-h-[100px] px-10 py-3 rounded-lg border bg-background resize-none"
                      maxLength={500}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.message.length}/500
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" size="lg" disabled={loading || currentAmount < 1}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Create Gift Card - ${currentAmount.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-1">Instant Delivery</h3>
            <p className="text-sm text-muted-foreground">Gift cards are delivered via email immediately</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-1">No Expiry</h3>
            <p className="text-sm text-muted-foreground">Valid for 12 months from purchase date</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-1">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">Apply at checkout in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
