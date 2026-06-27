"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Package, Heart, CreditCard, RotateCcw, Truck, Gift } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "My Orders",
      description: "Track your orders, view history, and manage returns.",
      icon: Package,
      href: "/orders",
      buttonText: "View Orders",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Shopping Cart",
      description: "Review items in your cart and proceed to checkout.",
      icon: ShoppingBag,
      href: "/cart",
      buttonText: "Go to Cart",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Wishlist",
      description: "Items you saved for later. Keep track of favorites.",
      icon: Heart,
      href: "/wishlist",
      buttonText: "View Wishlist",
      gradient: "from-red-500 to-rose-500",
    },
    {
      title: "Track Order",
      description: "Enter your order ID to see delivery status.",
      icon: Truck,
      href: "/track-order",
      buttonText: "Track Order",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Returns",
      description: "Start a return request or check return status.",
      icon: RotateCcw,
      href: "/returns",
      buttonText: "Start Return",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Gift Cards",
      description: "Check your balance or purchase gift cards.",
      icon: Gift,
      href: "/gift-cards",
      buttonText: "View Cards",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="group border-none shadow-xl hover:shadow-2xl hover:shadow-primary/10 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {action.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-11 rounded-xl font-bold"
                >
                  <Link href={action.href}>
                    {action.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
