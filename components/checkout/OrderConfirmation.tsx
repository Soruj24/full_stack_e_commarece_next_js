"use client";

import Link from "next/link";
import { CheckCircle2, Package, Mail, ArrowRight, Copy, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice } from "@/lib/localization";

interface OrderConfirmationProps {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  email: string;
  estimatedDelivery?: string;
}

export function OrderConfirmation({
  orderId,
  orderNumber,
  totalAmount,
  email,
  estimatedDelivery,
}: OrderConfirmationProps) {
  const { currency } = useLocalization();

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-100 rounded-full animate-ping opacity-20" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-green-600">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">#{orderNumber}</span>
                <button
                  onClick={copyOrderId}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                  title="Copy order ID"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(totalAmount, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm text-muted-foreground">
                {orderId.slice(-12)}
              </span>
            </div>
          </div>

          {estimatedDelivery && (
            <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-lg font-bold">{estimatedDelivery}</p>
              </div>
            </div>
          )}
        </div>

        {/* Email Notification */}
        <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-blue-900">
              Confirmation sent to {email}
            </p>
            <p className="text-xs text-blue-700">
              Check your inbox for order details and tracking information
            </p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-card rounded-3xl border border-border/50 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            What happens next?
          </h3>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Order Received",
                description: "Your order has been confirmed",
                completed: true,
              },
              {
                step: 2,
                title: "Processing",
                description: "We're preparing your items",
                completed: false,
              },
              {
                step: 3,
                title: "Shipped",
                description: "Your order is on its way",
                completed: false,
              },
              {
                step: 4,
                title: "Delivered",
                description: "Package delivered to your address",
                completed: false,
              },
            ].map((item, index) => (
              <div key={item.step} className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    item.completed
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    item.step
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="absolute left-4 w-0.5 h-8 bg-border -translate-y-6" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/profile/orders/${orderId}`} className="flex-1">
            <Button variant="outline" className="w-full h-12 gap-2">
              <Package className="w-4 h-4" />
              Track Order
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full h-12 gap-2">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
