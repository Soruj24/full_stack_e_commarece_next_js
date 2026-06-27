import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BundleDetailsNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Package className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Bundle not found</h1>
      <p className="text-muted-foreground mb-6">
        This bundle may have expired or been removed.
      </p>
      <Link href="/bundles">
        <Button>Browse All Bundles</Button>
      </Link>
    </div>
  );
}
