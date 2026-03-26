// app/orders/confirmation/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateInvoicePDF } from "@/lib/invoice";
import { IOrder } from "@/types";
import { useGuestCheckout } from "@/context/GuestCheckoutContext";
import { useSession } from "next-auth/react";
import { AccountCreationDialog } from "@/components/checkout/AccountCreationDialog";
import {
  ConfirmationHeader,
  OrderDetailsCard,
  ConfirmationFooter,
} from "@/components/orders/confirmation";

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { isGuestCheckout, clearGuestCheckout } = useGuestCheckout();
  const { data: session } = useSession();
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  useEffect(() => {
    if (!loading && order && isGuestCheckout && !session) {
      const timer = setTimeout(() => {
        setShowAccountDialog(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, order, isGuestCheckout, session]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (order) {
      generateInvoicePDF(order);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-black">Order not found</h2>
        <Link href="/products">
          <Button className="rounded-2xl">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 py-16 lg:py-24 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ConfirmationHeader
          orderId={order._id}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />

        <OrderDetailsCard order={order} />

        <ConfirmationFooter show={true} />
      </div>
      
      <AccountCreationDialog
        isOpen={showAccountDialog}
        onClose={() => {
          setShowAccountDialog(false);
          clearGuestCheckout();
        }}
        orderId={order?._id}
      />
    </div>
  );
}