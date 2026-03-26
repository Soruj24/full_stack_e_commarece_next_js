"use client";

import { ContactMessage } from "@/types";
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

export function ContactTable({
  messages,
  loading,
  onView,
  onDelete,
  onUpdateStatus,
}: ContactTableProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "read":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "replied":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No messages found</p>
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
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg._id}>
            <TableCell className="font-medium">{msg.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{msg.email}</span>
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{msg.subject}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusBadgeColor(msg.status)}>
                {msg.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(msg.createdAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(msg)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Message
                  </DropdownMenuItem>
                  {msg.status !== "replied" && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(msg._id, "replied")}>
                      <Mail className="mr-2 h-4 w-4" />
                      Mark as Replied
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(msg._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
