"use client";

import { CreditCard } from "lucide-react";
import { ReviewDeliveryCard } from "./ReviewDeliveryCard";

interface ReviewPaymentCardProps {
  paymentMethod: string;
}

const labels: Record<string, string> = {
  stripe: "Credit/Debit Card",
  paypal: "PayPal",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
};

export function ReviewPaymentCard({ paymentMethod }: ReviewPaymentCardProps) {
  return (
    <ReviewDeliveryCard icon={<CreditCard className="w-4 h-4 text-primary" />} label="Payment Method">
      <p className="font-semibold mt-1">{labels[paymentMethod] || paymentMethod}</p>
    </ReviewDeliveryCard>
  );
}
