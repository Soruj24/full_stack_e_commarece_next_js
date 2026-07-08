"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReturnRequest } from "@/modules/orders/hooks/use-return-request";
import { ReturnItemList } from "./ReturnItemList";
import { ReturnDetailsFields } from "./ReturnDetailsFields";

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

export function ReturnRequestDialog({ orderId, items, children }: ReturnRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const rr = useReturnRequest(orderId);

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
          <ReturnItemList items={items} selectedItems={rr.selectedItems} toggleItem={rr.toggleItem} />
          {rr.selectedItems.length > 0 && (
            <ReturnDetailsFields
              reason={rr.reason} setReason={rr.setReason}
              selectedItems={rr.selectedItems}
              itemConditions={rr.itemConditions} setItemConditions={rr.setItemConditions}
              description={rr.description} setDescription={rr.setDescription}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => rr.handleSubmit(() => setOpen(false))} disabled={rr.loading || rr.selectedItems.length === 0 || !rr.reason}>
            {rr.loading ? (
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
