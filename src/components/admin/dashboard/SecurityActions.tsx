"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityActionsProps {
  onSetup2FA: () => void;
  auditLogs: any[];
}

export function SecurityActions({ onSetup2FA, auditLogs }: SecurityActionsProps) {
  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="bg-card border-b border-border py-6 px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-black text-foreground">Security Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Secure your admin account with 2FA</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onSetup2FA}
              className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              Enable 2FA
            </Button>
          </div>

          <div className="p-4 border-2 border-dashed border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-bold text-foreground">Recent Critical Events</p>
            </div>
            <div className="space-y-3">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log._id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{log.action}</span>
                  <span className="text-muted-foreground/60 font-bold">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center font-bold italic">No recent events</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
