"use client";

import Link from "next/link";
import { ArrowLeft, Gift, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useGiftCardPurchase } from "@/hooks/use-gift-card-purchase";
import { GiftCardAmountSelector } from "@/components/gift-cards/GiftCardAmountSelector";
import { GiftCardRecipientForm } from "@/components/gift-cards/GiftCardRecipientForm";
import { GiftCardSuccess } from "@/components/gift-cards/GiftCardSuccess";
import { GiftCardFeatures } from "@/components/gift-cards/GiftCardFeatures";

export default function GiftCardsPage() {
  const { giftCardAmounts, selectedAmount, customAmount, currentAmount, formData, loading, createdCard, handleAmountSelect, handleCustomAmount, handleInputChange, handleSubmit } = useGiftCardPurchase();

  if (createdCard) {
    return <GiftCardSuccess code={createdCard.code} amount={createdCard.amount} recipientName={formData.recipientName} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />Back to Shopping
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black mb-4">Digital Gift Cards</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">Give the perfect gift. Digital gift cards delivered instantly via email.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Choose Amount</CardTitle>
                <CardDescription>Select a gift card value</CardDescription>
              </CardHeader>
              <CardContent>
                <GiftCardAmountSelector amounts={giftCardAmounts} selectedAmount={selectedAmount} customAmount={customAmount}
                  currentAmount={currentAmount} onAmountSelect={handleAmountSelect} onCustomAmount={handleCustomAmount} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recipient Details</CardTitle>
                <CardDescription>Who is this gift for?</CardDescription>
              </CardHeader>
              <CardContent>
                <GiftCardRecipientForm formData={formData} onInputChange={handleInputChange} />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" size="lg" disabled={loading || currentAmount < 1}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : <><CreditCard className="w-4 h-4 mr-2" />Create Gift Card - ${currentAmount.toFixed(2)}</>}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>

        <GiftCardFeatures />
      </div>
    </div>
  );
}
