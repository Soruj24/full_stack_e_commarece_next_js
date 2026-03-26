"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, CreditCard, ArrowUpRight } from "lucide-react";

const stats = [
  {
    label: "Total Orders",
    value: "24",
    change: "+12%",
    icon: ShoppingBag,
    color: "bg-blue-500",
  },
  {
    label: "Loyalty Points",
    value: "1,250",
    change: "+150",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    label: "Active Sessions",
    value: "2",
    change: "Current",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    label: "Account Balance",
    value: "$450.00",
    change: "Safe",
    icon: CreditCard,
    color: "bg-orange-500",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group p-8 bg-card rounded-[40px] border border-border/50 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700`}>
            <stat.icon className="h-24 w-24" />
          </div>
          
          <div className="relative z-10">
            <div className={`h-14 w-14 ${stat.color}/10 rounded-[22px] flex items-center justify-center ${stat.color.replace('bg-', 'text-')} mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="h-7 w-7" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-black tracking-tight">{stat.value}</h4>
                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
