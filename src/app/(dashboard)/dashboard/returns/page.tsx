"use client";

import { RotateCcw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReturnsPage } from "@/modules/orders/hooks/use-returns-page";
import { motion } from "framer-motion";

const RETURN_STATUS: Record<string, { label: string; variant: "warning" | "info" | "success" | "destructive" | "secondary" }> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "info" },
  rejected: { label: "Rejected", variant: "destructive" },
  received: { label: "Received", variant: "info" },
  refunded: { label: "Refunded", variant: "success" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ReturnsPage() {
  const { returns, loading, formatDate } = useReturnsPage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Return Requests</h1>
          <p className="text-muted-foreground mt-1">Track your returns and refunds</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : returns.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <RotateCcw className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold mb-2">No Returns Yet</h3>
              <p className="text-muted-foreground">
                You haven&apos;t initiated any return requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {returns.map((r) => {
              const status = RETURN_STATUS[r.status] || RETURN_STATUS.pending;
              return (
                <motion.div key={r._id} variants={item}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-sm font-mono">
                              {r._id.slice(-8).toUpperCase()}
                            </h3>
                            <Badge variant={status.variant} size="sm">
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Order{" "}
                            <span className="font-medium text-foreground">
                              {r.orderId?.orderNumber ?? "N/A"}
                            </span>{" "}
                            &middot; {r.items?.length ?? 0} item(s)
                          </p>
                          {r.reason && (
                            <p className="text-sm bg-muted/50 rounded-lg px-3 py-2 line-clamp-2">
                              <span className="text-muted-foreground">Reason: </span>
                              {r.reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {r.refundAmount > 0 && (
                            <p className="text-lg font-bold">
                              ${r.refundAmount.toFixed(2)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(r.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
