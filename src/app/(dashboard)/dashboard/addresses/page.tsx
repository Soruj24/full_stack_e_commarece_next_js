"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, Plus, MapPin, Pencil, Trash2 } from "lucide-react";
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
import type { IAddress } from "@/shared/types";
import {
  staggerContainer,
  staggerItem,
  fadeUp,
  viewportOnce,
  ease,
  duration,
} from "@/lib/animations";

const emptyAddress: IAddress & { name?: string; phone?: string } = {
  type: "shipping",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isDefault: false,
  name: "",
  phone: "",
};

export default function AddressesPage() {
  const { data: session } = useSession();
  const prefersReduced = useReducedMotion();
  const [addresses, setAddresses] = useState<(IAddress & { name?: string; phone?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.success) {
          setAddresses(data.user.addresses || []);
        }
      } catch {
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = [...addresses];
      if (editingIndex !== null) {
        updated[editingIndex] = form;
      } else {
        updated.push(form);
      }
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.user.addresses || updated);
        toast.success(editingIndex !== null ? "Address updated" : "Address added");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
      setDialogOpen(false);
      setEditingIndex(null);
      setForm(emptyAddress);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.user.addresses || updated);
        toast.success("Address removed");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const openAdd = () => {
    setEditingIndex(null);
    setForm(emptyAddress);
    setDialogOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setForm({ ...addresses[index] });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const animate = prefersReduced ? false : "visible";

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight">Addresses</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your shipping and billing addresses.</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={openAdd} className="rounded-xl font-black gap-2 h-12 px-6">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </motion.div>
      </motion.div>

      {/* Empty state */}
      {addresses.length === 0 ? (
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, scale: 0.96 }}
          animate={prefersReduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: duration.slow, ease: ease.out }}
          className="flex flex-col items-center justify-center py-20 px-4 bg-card rounded-[32px] border border-border/50 shadow-2xl shadow-primary/5"
        >
          <motion.div
            initial={prefersReduced ? undefined : { scale: 0 }}
            animate={prefersReduced ? undefined : { scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6"
          >
            <MapPin className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-black tracking-tight mb-2">No addresses yet</h3>
          <p className="text-muted-foreground font-medium text-center max-w-sm mb-6">
            Add a shipping or billing address to make checkout faster.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={openAdd} className="rounded-xl font-black gap-2 h-12 px-6">
              <Plus className="w-4 h-4" />
              Add Your First Address
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        /* Card grid with stagger */
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate={animate}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {addresses.map((addr, index) => (
              <motion.div
                key={`${addr.street}-${index}`}
                variants={staggerItem}
                layout
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="bg-card rounded-[32px] border border-border/50 shadow-2xl shadow-primary/5 p-6 space-y-4 relative overflow-hidden group hover:border-primary/20 hover:shadow-primary/10 transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={addr.type === "shipping" ? "info" : "warning"} size="sm">
                      {addr.type === "shipping" ? "Shipping" : "Billing"}
                    </Badge>
                    {addr.isDefault && (
                      <Badge variant="success" size="sm">Default</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => openEdit(index)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-destructive hover:text-destructive"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-1 text-sm font-medium">
                  {addr.name && <p className="font-bold text-foreground">{addr.name}</p>}
                  <p className="text-muted-foreground">{addr.street}</p>
                  <p className="text-muted-foreground">
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                  <p className="text-muted-foreground">{addr.country}</p>
                  {addr.phone && <p className="text-muted-foreground">{addr.phone}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!saving) { setDialogOpen(open); if (!open) { setEditingIndex(null); setForm(emptyAddress); } } }}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Address" : "Add Address"}</DialogTitle>
            <DialogDescription>
              {editingIndex !== null ? "Update your address details." : "Enter your new address details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="rounded-xl h-12"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="123 Main St"
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="New York"
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="NY"
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                placeholder="10001"
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="United States"
                className="rounded-xl h-12"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="rounded-xl h-12"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="type">Address Type</Label>
              <Select
                value={form.type}
                onValueChange={(v: "billing" | "shipping") => setForm({ ...form, type: v })}
              >
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={form.isDefault}
                onCheckedChange={(checked) => setForm({ ...form, isDefault: checked === true })}
              />
              <Label htmlFor="isDefault" className="font-medium">Set as default address</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); setEditingIndex(null); setForm(emptyAddress); }}
              className="rounded-xl font-bold h-12 px-6"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl font-black h-12 px-6 gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingIndex !== null ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
