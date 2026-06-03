"use client";

import { Search, Filter, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, getStatusConfig, formatReturnDate } from "@/types/return-item";
import type { ReturnRequest } from "@/types/return-item";

interface ReturnTableProps {
  returns: ReturnRequest[];
  loading: boolean;
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onStatusFilterChange: (v: string) => void;
  onViewDetail: (ret: ReturnRequest) => void;
}

export function ReturnTable({ returns, loading, searchQuery, statusFilter, onSearchChange, onStatusFilterChange, onViewDetail }: ReturnTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Returns</CardTitle>
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <SelectItem key={status} value={status}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead>
                <TableHead>Reason</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No returns found</TableCell></TableRow>
              ) : (
                returns.map((ret) => {
                  const config = getStatusConfig(ret.status);
                  return (
                    <TableRow key={ret._id}>
                      <TableCell className="font-medium">#{ret.orderId?.orderNumber || ret.orderId?._id?.slice(-6)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ret.userId?.name}</p>
                          <p className="text-xs text-muted-foreground">{ret.userId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{ret.items.length} item(s)</TableCell>
                      <TableCell className="max-w-[150px] truncate">{ret.reason}</TableCell>
                      <TableCell className="font-bold text-green-600">${ret.refundAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(config.bgColor, config.color)}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatReturnDate(ret.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => onViewDetail(ret)}><Eye className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
