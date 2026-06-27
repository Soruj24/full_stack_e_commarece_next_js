"use client";

import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PayPalButton } from "./PayPalButton";
import { PaymentMethodGrid } from "./payment-step/PaymentMethodGrid";
import { MobilePaymentForm } from "./payment-step/MobilePaymentForm";
import { StripePaymentForm } from "./payment-step/StripePaymentForm";

interface PaymentStepProps {
  paymentMethod: string;
  paymentEnabled: { stripe: boolean; paypal: boolean; cod: boolean; bkash: boolean; nagad: boolean; rocket: boolean };
  transactionId: string;
  paymentPhoneNumber: string;
  totalForGateway: number;
  clientSecret: string;
  stripeError: string;
  currency: string;
  onMethodChange: (method: string) => void;
  onTransactionChange: (id: string) => void;
  onPhoneChange: (phone: string) => void;
  onCreateIntent: () => void;
  onPayPalApprove: (orderId: string, txnId?: string) => Promise<void>;
  onStripeSuccess: (id: string) => void;
}

export function PaymentStep({ paymentMethod, paymentEnabled, transactionId, paymentPhoneNumber, totalForGateway, clientSecret, stripeError, currency, onMethodChange, onTransactionChange, onPhoneChange, onCreateIntent, onPayPalApprove, onStripeSuccess }: PaymentStepProps) {
  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl"><CreditCard className="w-6 h-6 text-primary" /></div>
        <div>
          <h2 className="text-2xl font-bold">Payment Method</h2>
          <p className="text-sm text-muted-foreground">Choose how you&apos;d like to pay</p>
        </div>
      </div>

      <PaymentMethodGrid paymentMethod={paymentMethod} paymentEnabled={paymentEnabled} onMethodChange={onMethodChange} />

      {["bkash", "nagad", "rocket"].includes(paymentMethod) && (
        <MobilePaymentForm amount={totalForGateway} currency={currency} transactionId={transactionId}
          paymentPhoneNumber={paymentPhoneNumber} onTransactionChange={onTransactionChange} onPhoneChange={onPhoneChange} />
      )}

      {paymentMethod === "cod" && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl space-y-4">
          <div className="flex items-center gap-3 text-green-800"><Truck className="w-6 h-6" /><h3 className="font-bold">Cash on Delivery</h3></div>
          <p className="text-sm text-green-700">Pay with cash upon delivery. Your order will be confirmed after we receive confirmation.</p>
          <div className="flex items-center gap-2 text-sm text-green-600"><ShieldCheck className="w-4 h-4" /><span>100% Safe & Secure</span></div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="p-6 bg-muted/50 rounded-xl">
          <PayPalButton amount={totalForGateway} currency={currency} onApproved={onPayPalApprove} onError={(msg) => toast.error(msg)} />
        </div>
      )}

      {paymentMethod === "stripe" && (
        <StripePaymentForm clientSecret={clientSecret} stripeError={stripeError} total={totalForGateway} onRetry={onCreateIntent} onSuccess={onStripeSuccess} />
      )}
    </div>
  );
}
