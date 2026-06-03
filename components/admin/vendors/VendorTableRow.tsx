"use client";

import { Store, Check, X, Eye, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Vendor } from "@/types/vendor";

interface VendorTableRowProps {
  vendor: Vendor;
  onViewDetails: (vendor: Vendor) => void;
  onAction: (action: string, vendor: Vendor) => void;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "approved" && "text-green-600 border-green-300",
        status === "pending" && "text-yellow-600 border-yellow-300",
        status === "rejected" && "text-red-600 border-red-300",
        status === "suspended" && "text-gray-600 border-gray-300"
      )}
    >
      {status}
    </Badge>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function VendorTableRow({
  vendor,
  onViewDetails,
  onAction,
}: VendorTableRowProps) {
  return (
    <TableRow key={vendor._id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{vendor.storeName}</p>
            <p className="text-xs text-muted-foreground">/{vendor.storeSlug}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">
            {vendor.userId?.name || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">
            {vendor.userId?.email}
          </p>
        </div>
      </TableCell>
      <TableCell>{vendor.commissionRate}%</TableCell>
      <TableCell className="font-medium text-green-600">
        ${vendor.totalEarnings.toFixed(2)}
      </TableCell>
      <TableCell>
        <StatusBadge status={vendor.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(vendor.createdAt)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(vendor)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {vendor.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => onAction("approved", vendor)}>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails(vendor)}>
                  <X className="w-4 h-4 mr-2 text-red-600" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {vendor.status === "approved" && (
              <DropdownMenuItem onClick={() => onAction("suspended", vendor)}>
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                Suspend
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
