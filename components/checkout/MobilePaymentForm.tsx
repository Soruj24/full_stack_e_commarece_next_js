"use client";

import { Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MobilePaymentFormProps {
  selectedMethod: string;
  transactionId: string;
  onTransactionChange: (id: string) => void;
  paymentPhoneNumber: string;
  onPhoneChange: (phone: string) => void;
  phoneError: string;
}

export function MobilePaymentForm({ selectedMethod, transactionId, onTransactionChange, paymentPhoneNumber, onPhoneChange, phoneError }: MobilePaymentFormProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
      <div className="flex items-center gap-2 text-sm">
        <Smartphone className="w-4 h-4" />
        <span className="font-medium">Mobile Payment Details</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID <span className="text-destructive">*</span></Label>
          <Input id="transactionId" value={transactionId}
            onChange={(e) => onTransactionChange(e.target.value)}
            placeholder={`Enter your ${selectedMethod.toUpperCase()} transaction ID`} className="h-12" />
          <p className="text-xs text-muted-foreground">
            Find this in your {selectedMethod} app after completing the payment
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentPhone">Your {selectedMethod} Number <span className="text-destructive">*</span></Label>
          <Input id="paymentPhone" value={paymentPhoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="01XXXXXXXXX" className="h-12" />
          {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
          <p className="text-xs text-muted-foreground">
            Enter the mobile number you used for the payment
          </p>
        </div>
      </div>
    </div>
  );
}
