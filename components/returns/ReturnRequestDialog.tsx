"use client";

import { useState } from "react";
import { RefreshCw, Package, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface ReturnRequestDialogProps {
  orderId: string;
  items: OrderItem[];
  children?: React.ReactNode;
}

const returnReasons = [
  "Wrong item received",
  "Item damaged/defective",
  "Item not as described",
  "Changed my mind",
  "Better price found elsewhere",
  "Arrived too late",
  "Other",
];

const itemConditions = [
  { value: "sealed", label: "Sealed - Unopened" },
  { value: "opened", label: "Opened - Used" },
  { value: "damaged", label: "Damaged/Defective" },
];

export function ReturnRequestDialog({ orderId, items, children }: ReturnRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [reason, setReason] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [itemConditions, setItemConditions] = useState<Record<string, string>>({});

  const toggleItem = (item: OrderItem) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to return");
      return;
    }
    if (!reason) {
      toast.error("Please select a return reason");
      return;
    }

    setLoading(true);
    try {
      const returnItems = selectedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        reason,
        condition: itemConditions[item.productId] || "opened",
      }));

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items: returnItems,
          reason,
          description,
          refundMethod: "original",
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Return request submitted successfully");
        setOpen(false);
        setSelectedItems([]);
        setReason("");
        setCondition("");
        setDescription("");
        setItemConditions({});
      } else {
        toast.error(data.error || "Failed to submit return request");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Request Return
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Request Return
          </DialogTitle>
          <DialogDescription>
            Select items to return and provide return details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-base">Select Items to Return *</Label>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedItems.find((i) => i.productId === item.productId)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleItem(item)}
                >
                  <Checkbox
                    checked={!!selectedItems.find((i) => i.productId === item.productId)}
                    onCheckedChange={() => toggleItem(item)}
                  />
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                    <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} | ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedItems.length > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reason">Return Reason *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {returnReasons.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Item Condition *</Label>
                {selectedItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <span className="text-sm flex-1 line-clamp-1">{item.name}</span>
                    <Select
                      value={itemConditions[item.productId] || "opened"}
                      onValueChange={(val) => setItemConditions((prev) => ({ ...prev, [item.productId]: val }))}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {condition && (
                          <SelectItem value="sealed">Sealed - Unopened</SelectItem>
                        )}
                        <SelectItem value="opened">Opened - Used</SelectItem>
                        <SelectItem value="damaged">Damaged/Defective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional information about the return..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || selectedItems.length === 0 || !reason}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
