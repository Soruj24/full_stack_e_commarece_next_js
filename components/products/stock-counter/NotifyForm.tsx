"use client";

import { Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StockStatus {
  label: string; description: string; color: string; bgColor: string; borderColor: string; dotColor: string;
}

interface NotifyFormProps {
  isOutOfStock: boolean;
  showNotifyButton: boolean;
  status: StockStatus;
  notifyEmail: string;
  setNotifyEmail: (v: string) => void;
  isSubscribed: boolean;
  showNotifyForm: boolean;
  setShowNotifyForm: (v: boolean) => void;
  handleNotifySubmit: () => void;
}

export function NotifyForm({ isOutOfStock, showNotifyButton, status, notifyEmail, setNotifyEmail, isSubscribed, showNotifyForm, setShowNotifyForm, handleNotifySubmit }: NotifyFormProps) {
  if (!isOutOfStock || !showNotifyButton) return null;

  return (
    <div className="flex items-center gap-2">
      {isSubscribed ? (
        <div className="flex items-center gap-2 text-green-600">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Subscribed</span>
        </div>
      ) : showNotifyForm ? (
        <div className="flex items-center gap-2">
          <input type="email" placeholder="Your email" value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            className="h-9 px-3 rounded-lg border text-sm w-40 focus:outline-none focus:ring-2 focus:ring-primary" />
          <Button size="sm" onClick={handleNotifySubmit} className="h-9">Notify</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowNotifyForm(false)} className="h-9">Cancel</Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setShowNotifyForm(true)} className={cn("gap-1", status.borderColor)}>
          <Bell className="w-4 h-4" />Notify Me
        </Button>
      )}
    </div>
  );
}
