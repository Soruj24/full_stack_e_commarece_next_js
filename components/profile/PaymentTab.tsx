// components/profile/PaymentTab.tsx
"use client";

import { useState } from "react";
import { Plus, CreditCard, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IPaymentMethod } from "@/types";

interface PaymentTabProps {
  paymentMethods: IPaymentMethod[];
  onUpdate: (methods: IPaymentMethod[]) => Promise<void>;
  loading: boolean;
}

export function PaymentTab({ paymentMethods, onUpdate, loading }: PaymentTabProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDummyCard = async () => {
    // In a real app, this would open Stripe/PayPal SDK
    const newMethod: IPaymentMethod = {
      provider: "stripe",
      brand: "Visa",
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      isDefault: (paymentMethods || []).length === 0,
    };
    await onUpdate([...(paymentMethods || []), newMethod]);
    setIsAdding(false);
  };

  const handleDelete = async (index: number) => {
    const updated = (paymentMethods || []).filter((_, i) => i !== index);
    await onUpdate(updated);
  };

  const handleSetDefault = async (index: number) => {
    const updated = (paymentMethods || []).map((method, i) => ({
      ...method,
      isDefault: i === index,
    }));
    await onUpdate(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight">Payment Methods</h3>
          <p className="text-muted-foreground font-medium">Securely manage your cards and accounts</p>
        </div>
        <Button 
          onClick={handleAddDummyCard}
          loading={loading}
          className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Method
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-6 rounded-[32px] flex items-start gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-primary">Secure Payments</h4>
          <p className="text-sm text-primary/70 font-medium leading-relaxed">
            Your payment details are encrypted and stored securely. We never store full card numbers on our servers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(paymentMethods || []).map((method, index) => (
          <div 
            key={index}
            className={cn(
              "p-8 rounded-[40px] border transition-all duration-500 relative group overflow-hidden",
              method.isDefault ? "bg-slate-900 text-white border-transparent shadow-2xl shadow-slate-900/20 scale-[1.02]" : "bg-card border-border/50 hover:border-primary/30"
            )}
          >
            {/* Abstract Card Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full -ml-12 -mb-12" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className={cn(
                  "p-3 rounded-2xl",
                  method.isDefault ? "bg-white/10" : "bg-primary/5 text-primary"
                )}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!method.isDefault && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleSetDefault(index)}
                      className="rounded-xl hover:bg-white/10 text-inherit"
                      aria-label="Set as default payment method"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(index)}
                    className="rounded-xl hover:bg-red-500/20 hover:text-red-400 text-inherit"
                    aria-label="Delete payment method"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    method.isDefault ? "text-white/50" : "text-muted-foreground/60"
                  )}>Card Number</p>
                  <p className="text-xl font-mono tracking-widest font-bold">
                    •••• •••• •••• {method.last4}
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em]",
                      method.isDefault ? "text-white/50" : "text-muted-foreground/60"
                    )}>Provider</p>
                    <p className="font-black text-lg uppercase italic">{method.brand || method.provider}</p>
                  </div>
                  {method.isDefault && (
                    <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider">Primary</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(paymentMethods || []).length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-[40px] border-2 border-dashed border-border/50">
            <div className="p-4 bg-muted rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h4 className="font-bold text-lg">No payment methods</h4>
            <p className="text-muted-foreground max-w-xs mx-auto mt-1">Add a credit card or PayPal account to start shopping.</p>
          </div>
        )}
      </div>
    </div>
  );
}
