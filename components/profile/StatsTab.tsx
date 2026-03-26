"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShoppingBag,  
  Award,  
  Calendar,
  Wallet,
  Zap
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface StatsTabProps {
  loyaltyPoints: number;
  ordersCount: number;
  totalSpent: number;
  tier: string;
}

const data = [
  { name: 'Jan', amount: 400 },
  { name: 'Feb', amount: 300 },
  { name: 'Mar', amount: 600 },
  { name: 'Apr', amount: 800 },
  { name: 'May', amount: 500 },
  { name: 'Jun', amount: 900 },
];

export function StatsTab({ loyaltyPoints, ordersCount, totalSpent, tier }: StatsTabProps) {
  const stats = [
    { 
      label: "Total Spent", 
      value: `$${totalSpent.toLocaleString()}`, 
      icon: Wallet, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: "+12.5%" 
    },
    { 
      label: "Orders", 
      value: ordersCount.toString(), 
      icon: ShoppingBag, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      trend: "+2" 
    },
    { 
      label: "Loyalty Points", 
      value: loyaltyPoints.toLocaleString(), 
      icon: Award, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      trend: "Gold Tier" 
    },
    { 
      label: "Next Perk", 
      value: "Free Shipping", 
      icon: Zap, 
      color: "text-cyan-500", 
      bg: "bg-cyan-500/10",
      trend: "In 250 pts" 
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tighter">Your <span className="text-primary">Insights</span></h3>
          <p className="text-[10px] sm:text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest">Personal spending & activity analytics</p>
        </div>
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl self-start sm:self-auto">
          <Calendar className="w-3 h-3" />
          Last 6 Months
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border/50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className={cn("p-2.5 sm:p-3 rounded-xl sm:rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[9px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5 sm:mb-1">{stat.label}</p>
              <h4 className="text-xl sm:text-2xl font-black">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-card border border-border/50 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8">
          <h4 className="font-black text-lg sm:text-xl mb-6 sm:mb-8 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Spending Trends
          </h4>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: 'rgba(0,0,0,0.4)' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8">
          <h4 className="font-black text-lg sm:text-xl mb-6 sm:mb-8 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Category Distribution
          </h4>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: 'rgba(0,0,0,0.4)' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="var(--primary)" 
                  radius={[8, 8, 8, 8]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
