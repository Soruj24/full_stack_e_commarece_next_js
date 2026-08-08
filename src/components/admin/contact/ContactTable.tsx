"use client";

import { ContactMessage } from "@/shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Eye, Mail, Trash2 } from "lucide-react";

interface ContactTableProps {
  messages: ContactMessage[];
  loading: boolean;
  onView: (msg: ContactMessage) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "read": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "replied": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default: return "bg-muted text-muted-foreground border-border/60";
  }
}

export function ContactTable({
  messages,
  loading,
  onView,
  onDelete,
  onUpdateStatus,
}: ContactTableProps) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
        <p className="text-sm text-muted-foreground mt-4">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-muted-foreground">No messages found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[60px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg._id}>
            <TableCell className="text-sm font-medium">{msg.name}</TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">{msg.email}</span>
            </TableCell>
            <TableCell className="text-sm max-w-[200px] truncate">{msg.subject}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`text-[11px] font-medium ${getStatusBadge(msg.status)}`}>
                {msg.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-lg border-border/60">
                    <DropdownMenuItem onClick={() => onView(msg)} className="text-sm gap-2">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </DropdownMenuItem>
                    {msg.status !== "replied" && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(msg._id, "replied")} className="text-sm gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Mark as Replied
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-sm gap-2 text-destructive focus:text-destructive"
                      onClick={() => onDelete(msg._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
