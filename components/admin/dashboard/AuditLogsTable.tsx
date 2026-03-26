"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, Download, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLog {
  _id: string;
  createdAt: string;
  userEmail: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
}

interface AuditLogsTableProps {
  logs: AuditLog[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "ALL" || log.action === filter;
    
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const headers = ["Timestamp", "Admin Email", "Action", "Entity Type", "Entity ID", "IP Address"];
    const rows = filteredLogs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.userEmail,
      log.action,
      log.entityType,
      log.entityId,
      log.ipAddress
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionTypes = ["ALL", ...Array.from(new Set(logs.map(l => l.action)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-[24px] border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-background border-none shadow-sm font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-11 w-full md:w-48 rounded-xl bg-background border-none shadow-sm font-bold">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Action Type" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card">
              {actionTypes.map(type => (
                <SelectItem key={type} value={type} className="font-bold focus:bg-primary/10">
                  {type === "ALL" ? "All Actions" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="h-11 rounded-xl font-black gap-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="font-black text-muted-foreground py-5 pl-8 uppercase tracking-widest text-[10px]">Timestamp</TableHead>
              <TableHead className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">Admin</TableHead>
              <TableHead className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">Action</TableHead>
              <TableHead className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">Target</TableHead>
              <TableHead className="text-right font-black text-muted-foreground pr-8 uppercase tracking-widest text-[10px]">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                    <Calendar className="h-12 w-12" />
                    <p className="font-black uppercase tracking-widest text-sm">No audit logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log._id} className="hover:bg-muted/30 transition-colors border-border group">
                  <TableCell className="text-sm font-bold text-muted-foreground pl-8">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-foreground text-sm group-hover:text-primary transition-colors">{log.userEmail}</span>
                      <span className="text-[10px] font-bold text-muted-foreground/50">
                        ID: {log.userId.slice(-6)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border-none shadow-sm",
                        log.action === "DELETE"
                          ? "bg-destructive/10 text-destructive"
                          : log.action === "ROLE_CHANGE"
                          ? "bg-primary/10 text-primary"
                          : log.action === "STATUS_CHANGE"
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{log.entityType}</span>
                      <span className="text-[10px] font-bold text-muted-foreground/50">
                        ({log.entityId.toString().slice(-6)})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <code className="text-[10px] font-bold bg-muted group-hover:bg-background px-2 py-1 rounded text-muted-foreground/60 border border-border transition-colors">
                      {log.ipAddress}
                    </code>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center px-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Showing {filteredLogs.length} of {logs.length} entries
        </p>
      </div>
    </div>
  );
}
