"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaqTableRow } from "./FaqTableRow";
import type { FaqItem } from "@/types/faq";

interface FaqTableProps {
  faqs: FaqItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onEdit: (faq: FaqItem) => void;
  onTogglePublish: (faq: FaqItem) => void;
  onDelete: (id: string) => void;
}

export function FaqTable({ faqs, loading, searchQuery, onSearchChange, onEdit, onTogglePublish, onDelete }: FaqTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All FAQs</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search FAQs..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
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
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No FAQs found</TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <FaqTableRow key={faq._id} faq={faq} onEdit={onEdit} onTogglePublish={onTogglePublish} onDelete={onDelete} />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
