"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FlashSaleProps {
  endTime: Date;
}

export function FlashSale({ endTime }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

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
    <Card className="bg-primary text-primary-foreground overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-bold mb-2">Flash Sale!</h2>
          <p className="text-primary-foreground/90 text-lg">
            Up to 50% off on selected items.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="text-center">
            <div className="bg-background/90 text-foreground rounded-xl p-3 min-w-[70px] shadow-lg">
              <span className="text-2xl font-black block">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Hours
              </span>
            </div>
          </div>
          <span className="text-2xl font-bold animate-pulse">:</span>
          <div className="text-center">
            <div className="bg-background/90 text-foreground rounded-xl p-3 min-w-[70px] shadow-lg">
              <span className="text-2xl font-black block">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Mins
              </span>
            </div>
          </div>
          <span className="text-2xl font-bold animate-pulse">:</span>
          <div className="text-center">
            <div className="bg-background/90 text-foreground rounded-xl p-3 min-w-[70px] shadow-lg">
              <span className="text-2xl font-black block">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Secs
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products?sale=true">Shop Now</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
