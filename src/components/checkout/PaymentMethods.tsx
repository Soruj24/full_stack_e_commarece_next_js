"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { MobilePaymentForm } from "./MobilePaymentForm";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  enabledMethods: {
    stripe: boolean;
    paypal: boolean;
    bkash: boolean;
    nagad: boolean;
    rocket: boolean;
  };
  transactionId: string;
  onTransactionChange: (id: string) => void;
  paymentPhoneNumber: string;
  onPhoneChange: (phone: string) => void;
}

export function PaymentMethods({
  selectedMethod, onMethodChange, enabledMethods, transactionId,
  onTransactionChange, paymentPhoneNumber, onPhoneChange,
}: PaymentMethodsProps) {
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, "");
    if (cleaned.startsWith("+880")) return /^1[0-9]{9}$/.test(cleaned.substring(4));
    return /^01[0-9]{9}$/.test(cleaned);
  };

  const handlePhoneChange = (value: string) => {
    onPhoneChange(value);
    if (value && !validatePhone(value)) setPhoneError("Invalid BD phone number format");
    else setPhoneError("");
  };

  const isMobilePayment = ["bkash", "nagad", "rocket"].includes(selectedMethod);

  return (
    <div className="space-y-6">
      <PaymentMethodSelector selectedMethod={selectedMethod} onMethodChange={onMethodChange}
        enabledMethods={enabledMethods} />

      {isMobilePayment && (
        <MobilePaymentForm selectedMethod={selectedMethod} transactionId={transactionId}
          onTransactionChange={onTransactionChange} paymentPhoneNumber={paymentPhoneNumber}
          onPhoneChange={handlePhoneChange} phoneError={phoneError} />
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
}

export { PAYMENT_ICONS } from "@/lib/data/payment-methods";
