"use client";

import { Users, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import Link from "next/link";

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

interface RecentCustomersProps {
  customers: Customer[];
  loading?: boolean;
}

export function RecentCustomers({ customers, loading }: RecentCustomersProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-500/10 rounded-lg">
            <Users className="h-4 w-4 text-violet-500" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Recent Customers</h3>
        </div>
        <Link
          href="/admin/users"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border/60">
        {recentCustomers.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No customers yet
          </div>
        ) : (
          recentCustomers.map((customer) => (
            <div key={customer._id} className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge variant={customer.role === "admin" ? "info" : "muted"}>
                  {customer.role}
                </StatusBadge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
