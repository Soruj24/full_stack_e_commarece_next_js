"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Package, 
  Truck,
  Download,
  ChevronRight,
  Search,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { cn, getFallbackImage, getSafeImageSrc } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/invoice";
import { IOrder, IOrderItem } from "@/types";

export function OrdersTab() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch  {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some((item: IOrderItem) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Order <span className="text-primary">History</span></h3>
          <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest">Track and manage your purchases</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            className="pl-11 h-12 rounded-2xl bg-muted/50 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      { (filteredOrders || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center space-y-8 bg-card/50 rounded-[40px] border border-dashed border-border/40 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative group">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] bg-card border border-border/40 flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-12">
              <ShoppingBag className="w-10 h-10 sm:w-16 sm:h-16 text-primary" />
            </div>
          </div>
          <div className="space-y-3 max-w-md relative z-10 px-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic">
              Archive <span className="text-primary not-italic">Empty</span>
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed uppercase tracking-widest">
              No acquisition records detected in your current clearance level. Begin procurement to populate this archive.
            </p>
          </div>
          <Link href="/products" className="relative z-10">
            <Button className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-14 px-10 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-500">
              Initialize Procurement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {(filteredOrders || []).map((order) => (
            <div 
              key={order._id}
              className="bg-card border border-border/50 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
            >
              {/* Order Header */}
              <div className="p-8 border-b border-border/50 bg-muted/30 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order ID</p>
                    <h4 className="font-black text-lg uppercase">#{order._id.slice(-8)}</h4>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Date</p>
                    <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <Badge className={cn(
                    "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none",
                    order.orderStatus === "delivered" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                  )}>
                    {order.orderStatus}
                  </Badge>
                  <Link href={`/profile/orders/${order._id}`}>
                    <Button variant="outline" size="icon" className="rounded-xl border-border/50">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-8 space-y-6">
                <div className="grid gap-4">
                  {(order.items || []).slice(0, 2).map((item: IOrderItem, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border/50 shrink-0">
                        <Image 
                          src={getSafeImageSrc(item.image)} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getFallbackImage();
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-sm truncate">{item.name}</h5>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {(order.items || []).length > 2 && (
                    <p className="text-xs font-black text-primary uppercase tracking-widest pl-20">
                      + {(order.items || []).length - 2} more items
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-black text-primary">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Shipping</p>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        {order.shippingCarrier || "Standard"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 border-border/50 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => generateInvoicePDF(order)}
                    >
                      <Download className="w-4 h-4" /> Invoice
                    </Button>
                    <Link href={`/profile/orders/${order._id}`}>
                      <Button className="rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20">
                        {order.orderStatus === "delivered" ? "View Details" : "Track Order"} <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
