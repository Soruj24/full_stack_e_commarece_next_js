"use client";

import { Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SaleProduct } from "@/features/admin/types/marketing";

interface FlashSalesSectionProps {
  products: SaleProduct[];
  saleLoading: boolean;
  onToggleSale: (productId: string, onSale: boolean, discountPrice?: number) => void;
}

export function FlashSalesSection({ products, saleLoading, onToggleSale }: FlashSalesSectionProps) {
  return (
    <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
      <CardHeader className="py-8 px-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-orange-600 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            Flash Sales & Promotions
          </CardTitle>
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-none font-black px-4 py-1.5 rounded-full">
            {products.filter((p) => p.onSale).length} Products on Sale
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div key={product._id} className="group p-5 rounded-[28px] bg-card border border-border/50 hover:border-orange-500/30 transition-all shadow-sm">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-muted">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.onSale && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Sale
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <p className="font-bold text-sm truncate">{product.name}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-xs font-bold", product.onSale ? "text-muted-foreground line-through" : "text-primary")}>
                      ${product.price.toFixed(2)}
                    </p>
                    {product.onSale && (
                      <p className="text-sm font-black text-orange-600">${product.discountPrice?.toFixed(2)}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={product.onSale ? "destructive" : "default"}
                    className={cn("rounded-xl h-9 px-4 font-black text-[10px] uppercase tracking-widest", !product.onSale && "bg-orange-500 hover:bg-orange-600")}
                    onClick={() => {
                      if (product.onSale) {
                        onToggleSale(product._id, false);
                      } else {
                        const discount = prompt("Enter discount price:", (product.price * 0.8).toFixed(2));
                        if (discount) onToggleSale(product._id, true, parseFloat(discount));
                      }
                    }}
                    disabled={saleLoading}
                  >
                    {product.onSale ? "Remove" : "Add Sale"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length > 8 && (
          <div className="mt-8 text-center">
            <Button variant="ghost" className="rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              View All Products <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
