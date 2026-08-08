"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaqTableRow } from "./FaqTableRow";
import type { FaqItem } from "@/modules/support/types/faq";

interface FaqTableProps {
  faqs: FaqItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onEdit: (faq: FaqItem) => void;
  onTogglePublish: (faq: FaqItem) => void;
  onDelete: (id: string) => void;
}

export function FaqTable({
  faqs,
  loading,
  searchQuery,
  onSearchChange,
  onEdit,
  onTogglePublish,
  onDelete,
}: FaqTableProps) {
  return (
    <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
      <div className="p-4 border-b border-border/60">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">All FAQs</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-[60px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                    No FAQs found
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <FaqTableRow
                    key={faq._id}
                    faq={faq}
                    onEdit={onEdit}
                    onTogglePublish={onTogglePublish}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
