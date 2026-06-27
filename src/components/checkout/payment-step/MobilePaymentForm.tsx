"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/localization";

interface MobilePaymentFormProps {
  amount: number;
  currency: string;
  transactionId: string;
  paymentPhoneNumber: string;
  onTransactionChange: (id: string) => void;
  onPhoneChange: (phone: string) => void;
}

export function MobilePaymentForm({ amount, currency, transactionId, paymentPhoneNumber, onTransactionChange, onPhoneChange }: MobilePaymentFormProps) {
  return (
    <div className="p-6 bg-muted/50 rounded-xl space-y-4">
      <div className="p-4 bg-primary/5 rounded-lg text-center">
        <p className="font-medium text-primary">
          Send {formatPrice(amount, currency)} to <span className="font-black">017XXXXXXXX</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Transaction ID</Label>
          <Input placeholder="Enter Transaction ID" className="h-12 rounded-xl"
            value={transactionId} onChange={(e) => onTransactionChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Sender Phone</Label>
          <Input placeholder="Phone Number" className="h-12 rounded-xl"
            value={paymentPhoneNumber} onChange={(e) => onPhoneChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
