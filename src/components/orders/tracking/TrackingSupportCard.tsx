"use client";

import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function TrackingSupportCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-primary/5 rounded-3xl border border-primary/10 p-6 lg:p-8"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">Need Help with Your Order?</h3>
          <p className="text-sm text-muted-foreground">
            Our support team is available 24/7 to assist you
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="gap-2">
          <Phone className="w-4 h-4" />
          Call Support
        </Button>
        <Button variant="outline" className="gap-2">
          <Mail className="w-4 h-4" />
          Email Us
        </Button>
        <Link href="/contact" className="flex-1">
          <Button className="w-full gap-2">
            <MessageCircle className="w-4 h-4" />
            Live Chat
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}