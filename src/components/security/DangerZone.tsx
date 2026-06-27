"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";

export function DangerZone() {
  return (
    <Card className="border-none shadow-2xl shadow-red-500/5 rounded-[40px] overflow-hidden bg-red-500/5 backdrop-blur-md border border-red-500/20">
      <CardHeader className="py-8 px-10 border-b border-red-500/20">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-black text-red-500 flex items-center gap-4 uppercase italic tracking-tighter">
            <div className="p-3 bg-red-500 rounded-2xl rotate-3 shadow-lg shadow-red-500/20">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            Identity <span className="text-foreground">Termination.</span>
          </CardTitle>
          <CardDescription className="text-red-500/70 font-medium text-lg">
            Critical operations that result in permanent identity erasure.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-10">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-[32px] bg-red-500/5 border border-red-500/20 gap-8">
          <div className="space-y-2 flex-1">
            <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-red-500">Purge Identity Data</h4>
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-relaxed">
              Permanently delete your profile and all associated data within the Nexus matrix. This action is irreversible.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 rounded-2xl border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-[0.3em] shrink-0"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Terminate Identity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
