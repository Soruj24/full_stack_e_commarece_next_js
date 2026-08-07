"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

interface FlashSaleProps {
  endTime: Date;
}

export function FlashSale({ endTime }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="bg-primary text-primary-foreground rounded-xl p-6 sm:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">Flash Sale</h2>
            <p className="text-primary-foreground/80 text-sm">Up to 50% off on selected items</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {[
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Mins" },
            { value: timeLeft.seconds, label: "Secs" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="bg-white/15 rounded-lg p-3 min-w-[60px] text-center">
                <span className="text-xl font-semibold block">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-medium text-primary-foreground/60">
                  {item.label}
                </span>
              </div>
              {i < 2 && <span className="text-lg font-medium text-primary-foreground/40">:</span>}
            </div>
          ))}
        </div>

        <Button size="lg" variant="secondary" className="rounded-xl px-6 font-medium" asChild>
          <Link href="/products?sale=true">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
}
