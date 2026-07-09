"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { SalesByCategory } from "@/modules/admin/types";

interface SalesByCategoryProps {
  data: SalesByCategory[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export function SalesByCategory({ data }: SalesByCategoryProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-8">Revenue by Category</h3>
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No category data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black tracking-tight mb-8">Revenue by Category</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="revenue"
              nameKey="name"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 mt-4">
        {data.map((item, i) => (
          <div key={item.categoryId || i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm font-bold">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground">
                {item.percentage.toFixed(1)}%
              </span>
              <span className="text-sm font-black">
                ${item.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
