"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RevenueByPaymentMethod } from "@/modules/admin/types";

interface RevenuePaymentMethodsProps {
  data: RevenueByPaymentMethod[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function RevenuePaymentMethods({ data }: RevenuePaymentMethodsProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-8">Payment Methods</h3>
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No payment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-8 rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black tracking-tight mb-8">Payment Methods</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="amount"
                nameKey="method"
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="font-bold capitalize">{item.method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${item.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {item.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-muted-foreground">
                    {item.percentage.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
