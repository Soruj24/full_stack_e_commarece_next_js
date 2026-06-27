"use client";

import { Check, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Payout } from "@/features/vendor/types/vendor";

interface VendorPayoutHistoryProps {
  payouts: Payout[];
}

function PayoutStatusIcon({ status }: { status: string }) {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        status === "completed"
          ? "bg-green-100"
          : status === "pending"
          ? "bg-yellow-100"
          : "bg-red-100"
      )}
    >
      {status === "completed" ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : status === "pending" ? (
        <Clock className="w-5 h-5 text-yellow-600" />
      ) : (
        <X className="w-5 h-5 text-red-600" />
      )}
    </div>
  );
}

export function VendorPayoutHistory({ payouts }: VendorPayoutHistoryProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No payouts yet
          </p>
        ) : (
          <div className="space-y-3">
            {payouts.slice(0, 5).map((payout) => (
              <div
                key={payout._id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <PayoutStatusIcon status={payout.status} />
                  <div>
                    <p className="font-medium">${payout.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    payout.status === "completed" &&
                      "text-green-600 border-green-300",
                    payout.status === "pending" &&
                      "text-yellow-600 border-yellow-300"
                  )}
                >
                  {payout.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
