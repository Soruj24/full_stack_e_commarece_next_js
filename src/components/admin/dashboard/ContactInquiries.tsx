"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ContactInquiriesProps {
  messages: ContactMessage[];
  onDelete: (id: string) => void;
  onViewFull: (msg: ContactMessage) => void;
}

export function ContactInquiries({
  messages,
  onDelete,
  onViewFull,
}: ContactInquiriesProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="font-bold text-muted-foreground py-4">Sender</TableHead>
            <TableHead className="font-bold text-muted-foreground">Subject</TableHead>
            <TableHead className="font-bold text-muted-foreground">Message</TableHead>
            <TableHead className="font-bold text-muted-foreground">Date</TableHead>
            <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-20 text-muted-foreground/40 font-bold">
                <p>No contact inquiries yet.</p>
              </TableCell>
            </TableRow>
          ) : (
            messages.map((msg) => (
              <TableRow
                key={msg._id}
                className="hover:bg-primary/5 border-border transition-all group"
              >
                <TableCell className="py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{msg.name}</span>
                    <span className="text-xs text-muted-foreground">{msg.email}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{msg.subject}</TableCell>
                <TableCell className="max-w-md">
                  <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground font-medium">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl hover:bg-primary/10 text-primary font-bold"
                      onClick={() => onViewFull(msg)}
                    >
                      View Full
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(msg._id)}
                      className="rounded-xl hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
