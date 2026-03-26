"use client";

import { CreditCard, Truck, ShieldCheck, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";
import { PayPalButton } from "./PayPalButton";
import { formatPrice } from "@/lib/localization";
import { cn } from "@/lib/utils";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

interface PaymentStepProps {
  paymentMethod: string;
  paymentEnabled: {
    stripe: boolean;
    paypal: boolean;
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    rocket: boolean;
  };
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

export function PaymentStep({
  paymentMethod,
  paymentEnabled,
  transactionId,
  paymentPhoneNumber,
  totalForGateway,
  clientSecret,
  stripeError,
  currency,
  onMethodChange,
  onTransactionChange,
  onPhoneChange,
  onCreateIntent,
  onPayPalApprove,
  onStripeSuccess,
}: PaymentStepProps) {
  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <CreditCard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Payment Method</h2>
          <p className="text-sm text-muted-foreground">
            Choose how you&apos;d like to pay
          </p>
        </div>
      </div>

      <PaymentMethodGrid
        paymentMethod={paymentMethod}
        paymentEnabled={paymentEnabled}
        onMethodChange={onMethodChange}
      />

      {["bkash", "nagad", "rocket"].includes(paymentMethod) && (
        <MobilePaymentForm
          amount={totalForGateway}
          currency={currency}
          transactionId={transactionId}
          paymentPhoneNumber={paymentPhoneNumber}
          onTransactionChange={onTransactionChange}
          onPhoneChange={onPhoneChange}
        />
      )}

      {paymentMethod === "cod" && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl space-y-4">
          <div className="flex items-center gap-3 text-green-800">
            <Truck className="w-6 h-6" />
            <h3 className="font-bold">Cash on Delivery</h3>
          </div>
          <p className="text-sm text-green-700">
            Pay with cash upon delivery. Your order will be confirmed after we receive confirmation.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Safe & Secure</span>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="p-6 bg-muted/50 rounded-xl">
          <PayPalButton
            amount={totalForGateway}
            currency={currency}
            onApproved={onPayPalApprove}
            onError={(msg) => toast.error(msg)}
          />
        </div>
      )}

      {paymentMethod === "stripe" && (
        <StripePaymentForm
          clientSecret={clientSecret}
          stripeError={stripeError}
          total={totalForGateway}
          onRetry={onCreateIntent}
          onSuccess={onStripeSuccess}
        />
      )}
    </div>
  );
}

interface PaymentMethodGridProps {
  paymentMethod: string;
  paymentEnabled: {
    stripe: boolean;
    paypal: boolean;
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    rocket: boolean;
  };
  onMethodChange: (method: string) => void;
}

function PaymentMethodGrid({ paymentMethod, paymentEnabled, onMethodChange }: PaymentMethodGridProps) {
  const methods = [
    { id: "stripe", label: "Card", icon: CreditCard, sub: "Visa, Mastercard, Amex", enabled: paymentEnabled.stripe },
    { id: "paypal", label: "PayPal", icon: ShieldCheck, sub: "Fast & Secure", enabled: paymentEnabled.paypal },
    { id: "cod", label: "Cash on Delivery", icon: Truck, sub: "Pay at door", enabled: paymentEnabled.cod },
    { id: "bkash", label: "bKash", icon: Smartphone, sub: "Bangladesh", enabled: paymentEnabled.bkash },
    { id: "nagad", label: "Nagad", icon: Smartphone, sub: "Bangladesh", enabled: paymentEnabled.nagad },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => method.enabled && onMethodChange(method.id)}
          disabled={!method.enabled}
          className={cn(
            "p-4 rounded-xl border-2 text-center transition-all",
            paymentMethod === method.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            !method.enabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
              paymentMethod === method.id ? "bg-primary text-white" : "bg-muted",
            )}
          >
            <method.icon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm">{method.label}</h4>
          <p className="text-xs text-muted-foreground">{method.sub}</p>
        </button>
      ))}
    </div>
  );
}

interface MobilePaymentFormProps {
  amount: number;
  currency: string;
  transactionId: string;
  paymentPhoneNumber: string;
  onTransactionChange: (id: string) => void;
  onPhoneChange: (phone: string) => void;
}

function MobilePaymentForm({
  amount,
  currency,
  transactionId,
  paymentPhoneNumber,
  onTransactionChange,
  onPhoneChange,
}: MobilePaymentFormProps) {
  return (
    <div className="p-6 bg-muted/50 rounded-xl space-y-4">
      <div className="p-4 bg-primary/5 rounded-lg text-center">
        <p className="font-medium text-primary">
          Send {formatPrice(amount, currency)} to{" "}
          <span className="font-black">017XXXXXXXX</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Transaction ID</Label>
          <Input
            placeholder="Enter Transaction ID"
            className="h-12 rounded-xl"
            value={transactionId}
            onChange={(e) => onTransactionChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sender Phone</Label>
          <Input
            placeholder="Phone Number"
            className="h-12 rounded-xl"
            value={paymentPhoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

interface StripePaymentFormProps {
  clientSecret: string;
  stripeError: string;
  total: number;
  onRetry: () => void;
  onSuccess: (id: string) => void;
}

function StripePaymentForm({
  clientSecret,
  stripeError,
  total,
  onRetry,
  onSuccess,
}: StripePaymentFormProps) {
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
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-40 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
