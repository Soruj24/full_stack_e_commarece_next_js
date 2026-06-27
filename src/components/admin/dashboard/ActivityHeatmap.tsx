"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ActivityHeatmap() {
  // Simulated data: 7 days x 24 hours
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate random activity levels (0-4)
  const data = days.map(() => hours.map(() => Math.floor(Math.random() * 5)));

  const getColor = (level: number) => {
    switch (level) {
      case 0: return "bg-muted/30";
      case 1: return "bg-primary/20";
      case 2: return "bg-primary/40";
      case 3: return "bg-primary/70";
      case 4: return "bg-primary";
      default: return "bg-muted/30";
    }
  };

  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="bg-card border-b border-border py-6 px-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-black text-foreground">Activity Heatmap</CardTitle>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3 rounded-xl">
              <p className="text-xs font-medium">This heatmap shows user engagement levels across different times of the week. Darker squares indicate higher activity.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col gap-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 mb-2 ml-8">
            {hours.filter(h => h % 3 === 0).map(h => (
              <span key={h} className="text-[10px] font-bold text-muted-foreground w-12 text-center">
                {h === 0 ? "12am" : h === 12 ? "12pm" : h > 12 ? `${h-12}pm` : `${h}am`}
              </span>
            ))}
          </div>
          {data.map((dayData, dayIndex) => (
            <div key={days[dayIndex]} className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted-foreground w-6 uppercase tracking-tighter">
                {days[dayIndex]}
              </span>
              <div className="flex gap-1">
                {dayData.map((level, hourIndex) => (
                  <TooltipProvider key={hourIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-3 h-3 rounded-sm ${getColor(level)} transition-all hover:scale-125 cursor-pointer`}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="p-2 rounded-lg text-[10px] font-bold">
                        {days[dayIndex]} at {hourIndex}:00 — {level === 0 ? "No activity" : level === 4 ? "Peak activity" : "Moderate activity"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end gap-2 mt-6">
            <span className="text-[10px] font-bold text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getColor(level)}`} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
