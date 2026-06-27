"use client";

import { Eye, EyeOff, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { FaqItem } from "@/features/support/types/faq";

interface FaqTableRowProps {
  faq: FaqItem;
  onEdit: (faq: FaqItem) => void;
  onTogglePublish: (faq: FaqItem) => void;
  onDelete: (id: string) => void;
}

export function FaqTableRow({ faq, onEdit, onTogglePublish, onDelete }: FaqTableRowProps) {
  return (
    <TableRow>
      <TableCell className="max-w-[300px]">
        <p className="font-medium line-clamp-1">{faq.question}</p>
      </TableCell>
      <TableCell><Badge variant="secondary">{faq.category}</Badge></TableCell>
      <TableCell>
        <Badge variant={faq.isPublished ? "default" : "outline"}>{faq.isPublished ? "Published" : "Hidden"}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{faq.views}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(faq)}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePublish(faq)}>
              {faq.isPublished ? <><EyeOff className="w-4 h-4 mr-2" />Hide</> : <><Eye className="w-4 h-4 mr-2" />Publish</>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(faq._id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
