"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Check, X, Package, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useReturnDetail } from "@/features/orders/hooks/use-return-detail";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { label: "Pending Review", icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  approved: { label: "Approved", icon: Check, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  rejected: { label: "Rejected", icon: X, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  received: { label: "Item Received", icon: Package, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  refunded: { label: "Refunded", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  cancelled: { label: "Cancelled", icon: X, color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-900/30" },
};

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { returnReq, loading, cancelling, trackingNumber, setTrackingNumber, handleCancel, formatDate } = useReturnDetail(id);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!returnReq) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8"><AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" /><h2 className="text-xl font-bold mb-2">Return Not Found</h2><Button asChild><Link href="/returns">Back to Returns</Link></Button></Card>
      </div>
    );
  }

  const config = statusConfig[returnReq.status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/returns" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" />Back to Returns</Link>

        <div className="flex items-center gap-4 mb-8">
          <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", config.bgColor)}><Icon className={cn("w-7 h-7", config.color)} /></div>
          <div><h1 className="text-2xl font-bold">Return Request</h1><p className="text-muted-foreground">Order #{returnReq.orderId?.orderNumber || returnReq.orderId?._id?.slice(-6)}</p></div>
          <Badge variant="outline" className={cn("ml-auto", config.bgColor, config.color)}>{config.label}</Badge>
        </div>

        {returnReq.status === "pending" && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <p className="text-sm">Your return request is being reviewed. You can cancel it while it&apos;s still pending.</p>
              <Button variant="outline" className="mt-3 text-red-600 border-red-200" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}Cancel Request
              </Button>
            </CardContent>
          </Card>
        )}

        {returnReq.status === "approved" && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4 space-y-3">
              <p className="font-medium">Ship Items Back</p>
              <p className="text-sm text-muted-foreground">Please ship the items back to our warehouse. Once received, your refund will be processed.</p>
              <div className="flex gap-2"><Input placeholder="Enter tracking number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} /><Button>Submit</Button></div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Items to Return</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {returnReq.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-16 h-16 rounded-lg bg-background overflow-hidden"><img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" /></div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} | ${item.price.toFixed(2)} each</p>
                    <div className="flex gap-2 mt-1"><Badge variant="secondary" className="text-xs">{item.condition}</Badge><Badge variant="outline" className="text-xs">{item.reason}</Badge></div>
                  </div>
                  <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Return Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Return Reason</p><p className="font-medium">{returnReq.reason}</p></div>
                <div><p className="text-sm text-muted-foreground">Refund Method</p><p className="font-medium capitalize">{returnReq.refundMethod.replace("_", " ")}</p></div>
                <div><p className="text-sm text-muted-foreground">Refund Amount</p><p className="font-bold text-green-600 text-lg">${returnReq.refundAmount.toFixed(2)}</p></div>
                <div><p className="text-sm text-muted-foreground">Requested On</p><p className="font-medium">{formatDate(returnReq.createdAt)}</p></div>
              </div>
              {returnReq.description && <div><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{returnReq.description}</p></div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnReq.notes.map((note, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between"><p className="font-medium text-sm capitalize">{note.by}</p><p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p></div>
                      <p className="text-sm text-muted-foreground">{note.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
