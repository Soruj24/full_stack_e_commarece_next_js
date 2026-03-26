"use client";

import { Coupon } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface CouponsTableProps {
  coupons: Coupon[];
  loading: boolean;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  onToggleActive: (coupon: Coupon) => void;
}

export function CouponsTable({
  coupons,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: CouponsTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading coupons...</p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No coupons found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Min. Purchase</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Valid Until</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon) => (
          <TableRow key={coupon._id}>
            <TableCell className="font-medium">{coupon.code}</TableCell>
            <TableCell>
              {coupon.discountType === "percentage" ? (
                <span>{coupon.discountValue}%</span>
              ) : (
                <span>${coupon.discountValue}</span>
              )}
            </TableCell>
            <TableCell>${coupon.minPurchase}</TableCell>
            <TableCell>
              {coupon.usedCount} / {coupon.usageLimit || "∞"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(coupon.endDate)}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={coupon.isActive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(coupon)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Coupon
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleActive(coupon)}>
                    {coupon.isActive ? (
                      <>
                        <ToggleLeft className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(coupon._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Coupon
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
