"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Plus, CreditCard, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { IPaymentMethod } from "@/shared/types";

const cardBrands: Record<string, { color: string; gradient: string }> = {
  visa: { color: "from-blue-600 to-blue-800", gradient: "from-blue-500/20 to-blue-600/10" },
  mastercard: { color: "from-red-500 to-yellow-500", gradient: "from-red-500/20 to-yellow-500/10" },
  amex: { color: "from-blue-400 to-blue-600", gradient: "from-blue-400/20 to-blue-600/10" },
  discover: { color: "from-orange-400 to-orange-600", gradient: "from-orange-400/20 to-orange-600/10" },
};

interface PaymentMethodDisplay extends IPaymentMethod {
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
}

const emptyPayment: PaymentMethodDisplay = {
  provider: "stripe",
  last4: "",
  brand: "visa",
  isDefault: false,
  cardholderName: "",
  expiryMonth: "",
  expiryYear: "",
};

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyPayment);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.success) {
          setPaymentMethods(data.user.paymentMethods || []);
        }
      } catch {
        toast.error("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethods();
  }, [session]);

  const handleSave = async () => {
    if (!form.last4 || form.last4.length < 4) {
      toast.error("Please enter the last 4 digits of your card");
      return;
    }
    setSaving(true);
    try {
      const updated = [...paymentMethods, form];
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethods: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.user.paymentMethods || updated);
        toast.success("Payment method added");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to save payment method");
    } finally {
      setSaving(false);
      setDialogOpen(false);
      setForm(emptyPayment);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = paymentMethods.filter((_, i) => i !== index);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethods: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.user.paymentMethods || updated);
        toast.success("Payment method removed");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to delete payment method");
    }
  };

  const getBrandStyle = (brand?: string) => {
    const key = (brand || "visa").toLowerCase();
    return cardBrands[key] || cardBrands.visa;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your saved payment methods.</p>
        </div>
        <Button onClick={() => { setForm(emptyPayment); setDialogOpen(true); }} className="rounded-xl font-black gap-2 h-12 px-6">
          <Plus className="w-4 h-4" />
          Add Payment Method
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-card rounded-[32px] border border-border/50 shadow-2xl shadow-primary/5">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <CreditCard className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black tracking-tight mb-2">No payment methods</h3>
          <p className="text-muted-foreground font-medium text-center max-w-sm mb-6">
            Add a payment method for faster checkout.
          </p>
          <Button onClick={() => { setForm(emptyPayment); setDialogOpen(true); }} className="rounded-xl font-black gap-2 h-12 px-6">
            <Plus className="w-4 h-4" />
            Add Payment Method
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method, index) => {
            const brandStyle = getBrandStyle(method.brand);
            return (
              <div
                key={index}
                className="bg-card rounded-[32px] border border-border/50 shadow-2xl shadow-primary/5 overflow-hidden"
              >
                <div className={`h-3 bg-gradient-to-r ${brandStyle.color}`} />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 bg-gradient-to-br ${brandStyle.gradient} rounded-2xl flex items-center justify-center`}>
                        <CreditCard className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <p className="font-bold capitalize text-foreground">{method.brand || "Card"}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          **** {method.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {method.isDefault && (
                        <Badge variant="success" size="sm" className="gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Default
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-destructive hover:text-destructive"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {method.cardholderName && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cardholder</p>
                        <p className="font-bold text-foreground">{method.cardholderName}</p>
                      </div>
                    )}
                    {(method.expiryMonth && method.expiryYear) && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expires</p>
                        <p className="font-bold text-foreground">{method.expiryMonth}/{method.expiryYear}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Provider</p>
                      <p className="font-bold text-foreground capitalize">{method.provider}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!saving) { setDialogOpen(open); if (!open) setForm(emptyPayment); } }}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to save a payment method.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={form.cardholderName || ""}
                onChange={(e) => setForm({ ...form, cardholderName: e.target.value })}
                placeholder="John Doe"
                className="rounded-xl h-12"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="last4">Last 4 Digits</Label>
              <Input
                id="last4"
                value={form.last4 || ""}
                onChange={(e) => setForm({ ...form, last4: e.target.value })}
                placeholder="4242"
                maxLength={4}
                className="rounded-xl h-12 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input
                id="expiryMonth"
                value={form.expiryMonth || ""}
                onChange={(e) => setForm({ ...form, expiryMonth: e.target.value })}
                placeholder="MM"
                maxLength={2}
                className="rounded-xl h-12 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                id="expiryYear"
                value={form.expiryYear || ""}
                onChange={(e) => setForm({ ...form, expiryYear: e.target.value })}
                placeholder="YY"
                maxLength={2}
                className="rounded-xl h-12 font-mono"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="brand">Card Brand</Label>
              <Select
                value={form.brand || "visa"}
                onValueChange={(v) => setForm({ ...form, brand: v })}
              >
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="discover">Discover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="provider">Payment Provider</Label>
              <Select
                value={form.provider}
                onValueChange={(v: "stripe" | "paypal") => setForm({ ...form, provider: v })}
              >
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={form.isDefault}
                onCheckedChange={(checked) => setForm({ ...form, isDefault: checked === true })}
              />
              <Label htmlFor="isDefault" className="font-medium">Set as default payment method</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); setForm(emptyPayment); }}
              className="rounded-xl font-bold h-12 px-6"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl font-black h-12 px-6 gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
