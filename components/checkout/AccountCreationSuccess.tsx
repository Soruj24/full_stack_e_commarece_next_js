"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AccountCreationSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountCreationSuccess({ isOpen, onClose }: AccountCreationSuccessProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <Check className="w-8 h-8 text-green-600" />
        </motion.div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Welcome!</DialogTitle>
          <DialogDescription>
            Your account has been created successfully. You can now access your orders and enjoy all features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full h-12">
            <Link href="/profile/orders">
              View Your Order
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full h-12">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
