"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Lock } from "lucide-react";

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
}

export function PaymentForm({ onSuccess, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-8 rounded-[40px] bg-muted/30 border border-border/50 space-y-6">
        <PaymentElement />
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          type="submit"
          disabled={!stripe || loading}
          className="w-full h-16 rounded-[24px] font-black text-xl shadow-2xl shadow-primary/20 gap-3"
        >
          {loading ? "Processing Payment..." : `Pay $${amount.toFixed(2)} Now`}
          {!loading && <CheckCircle2 className="w-6 h-6" />}
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Lock className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-widest">Secure encrypted payment by Stripe</p>
        </div>
      </div>
    </form>
  );
}
