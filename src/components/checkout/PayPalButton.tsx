"use client";

import { useEffect, useRef } from "react";

interface PayPalButtonProps {
  amount: number;
  currency: string;
  onApproved: (orderId: string, transactionId: string | undefined) => void;
  onError: (message: string) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalButton({ amount, currency, onApproved, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      onError("PayPal client ID not configured");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency.toUpperCase()}`;
    script.async = true;
    script.onload = async () => {
      if (!window.paypal || !containerRef.current) {
        onError("PayPal SDK failed to load");
        return;
      }

      window.paypal.Buttons({
        createOrder: async () => {
          try {
            const res = await fetch("/api/payments/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount, currency }),
            });
            const data = await res.json();
            if (!data.success) {
              throw new Error(data.error || "Unable to create PayPal order");
            }
            return data.id;
          } catch (e: any) {
            onError(e?.message || "Unable to create PayPal order");
            return "";
          }
        },
        onApprove: async (data: { orderID: string }) => {
          try {
            const res = await fetch("/api/payments/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const cap = await res.json();
            if (!cap.success) {
              throw new Error(cap.error || "Capture failed");
            }
            onApproved(data.orderID, cap.transactionId);
          } catch (e: any) {
            onError(e?.message || "Capture failed");
          }
        },
        onError: (err: any) => {
          onError(err?.message || "PayPal error");
        },
      }).render(containerRef.current);
    };
    script.onerror = () => onError("Failed to load PayPal SDK");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [amount, currency, onApproved, onError]);

  return <div ref={containerRef} />;
}

export default PayPalButton;
