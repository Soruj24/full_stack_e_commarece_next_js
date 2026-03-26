import { HardHat, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative mx-auto w-24 h-24 bg-card border border-border rounded-[32px] flex items-center justify-center shadow-2xl">
            <HardHat className="h-12 w-12 text-primary animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-foreground tracking-tight uppercase italic">
            Under Maintenance
          </h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed px-4">
            We&apos;re currently performing some scheduled updates to improve
            your experience. We&apos;ll be back online shortly!
          </p>
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
            <Settings className="h-4 w-4 text-primary animate-spin-slow" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Estimated Downtime: 30 minutes
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Button
            asChild
            variant="ghost"
            className="font-bold text-muted-foreground hover:text-primary"
          >
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
