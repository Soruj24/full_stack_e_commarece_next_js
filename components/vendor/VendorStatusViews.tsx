"use client";

import Link from "next/link";
import { Store, Clock, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Vendor } from "@/types/vendor";

interface VendorStatusViewsProps {
  loading: boolean;
  vendor: Vendor | null;
}

export function VendorStatusViews({ loading, vendor }: VendorStatusViewsProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">No Vendor Account</h2>
          <p className="text-muted-foreground mb-4">
            Create a vendor account to start selling.
          </p>
          <Button asChild>
            <Link href="/vendor/register">Register as Vendor</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (vendor.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Application Under Review</h2>
          <p className="text-muted-foreground mb-4">
            Your vendor application for <strong>{vendor.storeName}</strong> is
            being reviewed. We&apos;ll notify you once it&apos;s approved.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (vendor.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Application Rejected</h2>
          <p className="text-muted-foreground mb-4">
            Your vendor application was not approved.
          </p>
          <Button asChild>
            <Link href="/vendor/register">Try Again</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}
