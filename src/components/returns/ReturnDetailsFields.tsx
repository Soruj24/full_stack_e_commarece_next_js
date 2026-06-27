"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { returnReasons } from "@/lib/data/return-request";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface ReturnDetailsFieldsProps {
  reason: string;
  setReason: (v: string) => void;
  selectedItems: OrderItem[];
  itemConditions: Record<string, string>;
  setItemConditions: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  description: string;
  setDescription: (v: string) => void;
}

export function ReturnDetailsFields({
  reason, setReason, selectedItems, itemConditions, setItemConditions, description, setDescription,
}: ReturnDetailsFieldsProps) {
  return (
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
                <SelectItem value="sealed">Sealed - Unopened</SelectItem>
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
  );
}
