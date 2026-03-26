"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Award, TrendingUp, Copy } from "lucide-react";
import { toast } from "sonner";

interface LoyaltyTabProps {
  points?: number;
  referralCode?: string;
  tier?: string;
}

export function LoyaltyTab({ points = 0, referralCode = "", tier = "Bronze" }: LoyaltyTabProps) {
  
  const copyToClipboard = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    }
  };

  const tierColors: Record<string, string> = {
    bronze: "from-orange-700 to-orange-500",
    silver: "from-slate-400 to-slate-300",
    gold: "from-yellow-500 to-amber-400",
    platinum: "from-indigo-500 to-purple-500",
  };

  const currentTierColor = tierColors[tier.toLowerCase()] || tierColors.bronze;

  return (
    <div className="space-y-8">
      {/* Status Card */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${currentTierColor} rounded-[32px] p-8 text-white shadow-xl`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-widest opacity-90">{tier} Member</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">{points.toLocaleString()} Points</h2>
            <p className="opacity-80 font-medium">Earn more points to reach next tier</p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px]">
                <p className="text-xs font-bold uppercase tracking-widest mb-1">Lifetime Earned</p>
                <p className="text-2xl font-black">{(points * 1.5).toLocaleString()}</p>
             </div>
             {referralCode && (
               <div 
                 onClick={copyToClipboard}
                 className="bg-black/20 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-black/30 transition-colors"
               >
                 <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Referral Code</p>
                    <p className="font-mono font-bold text-lg tracking-widest">{referralCode}</p>
                 </div>
                 <Copy className="w-4 h-4 opacity-70" />
               </div>
             )}
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-90">
            <span>{tier}</span>
            <span>Next Tier</span>
          </div>
          <Progress value={65} className="h-3 bg-black/20" />
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" /> Available Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-[32px] border border-border/50 p-6 flex gap-4 items-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xl shrink-0">
                ${10 * i}
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-1">Store Credit</h4>
                <p className="text-sm text-muted-foreground mb-3">Redeem for {1000 * i} points</p>
                <Button size="sm" variant="outline" className="rounded-xl w-full font-bold">Redeem</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Points History
        </h3>
        <div className="bg-card rounded-[32px] border border-border/50 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border-b border-border/50 last:border-0 flex items-center justify-between">
              <div>
                <p className="font-bold">Purchase #ORD-{1000 + i}</p>
                <p className="text-xs text-muted-foreground">Jan {20 - i}, 2024</p>
              </div>
              <span className="font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs">
                +150 pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
