"use client";

import { IAuditLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, User, Package, ShoppingCart, FolderTree, Building2, Megaphone, Ticket } from "lucide-react";

interface AuditLogsTableProps {
  logs: IAuditLog[];
  loading: boolean;
}

const getActionColor = (action: string) => {
  switch (action) {
    case "CREATE":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "UPDATE":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "DELETE":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "LOGIN":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "LOGOUT":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
};

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "User":
      return User;
    case "Product":
      return Package;
    case "Order":
      return ShoppingCart;
    case "Category":
      return FolderTree;
    case "Brand":
      return Building2;
    case "Banner":
      return Megaphone;
    case "Coupon":
      return Ticket;
    default:
      return Shield;
  }
};

export function AuditLogsTable({ logs, loading }: AuditLogsTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading audit logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No audit logs found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Entity</TableHead>
          <TableHead>Entity ID</TableHead>
          <TableHead>IP Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => {
          const EntityIcon = getEntityIcon(log.entityType);
          return (
            <TableRow key={log._id}>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {formatDate(log.createdAt)}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{log.userEmail}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getActionColor(log.action)}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <EntityIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{log.entityType}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {log.entityId}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {log.ipAddress}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
