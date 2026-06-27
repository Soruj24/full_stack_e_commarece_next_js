"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { PaymentForm } from "../PaymentForm";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface StripePaymentFormProps {
  clientSecret: string;
  stripeError: string;
  total: number;
  onRetry: () => void;
  onSuccess: (id: string) => void;
}

export function StripePaymentForm({ clientSecret, stripeError, total, onRetry, onSuccess }: StripePaymentFormProps) {
  if (clientSecret && stripePromise) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm amount={total} onSuccess={onSuccess} />
      </Elements>
    );
  }

  if (stripeError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
        <p className="font-medium">{stripeError}</p>
        <Button variant="outline" onClick={onRetry} className="mt-2">Retry</Button>
      </div>
    );
  }

  return (
    <div className="h-40 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
