"use client";

import { Eye, EyeOff, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FaqItem } from "@/modules/support/types/faq";

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
        <p className="text-sm font-medium truncate">{faq.question}</p>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-[11px] font-medium">
          {faq.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`text-[11px] font-medium ${
            faq.isPublished
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-border/60"
          }`}
        >
          {faq.isPublished ? "Published" : "Hidden"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{faq.views}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-lg border-border/60">
              <DropdownMenuItem onClick={() => onEdit(faq)} className="text-sm gap-2">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePublish(faq)} className="text-sm gap-2">
                {faq.isPublished ? (
                  <><EyeOff className="h-3.5 w-3.5" /> Hide</>
                ) : (
                  <><Eye className="h-3.5 w-3.5" /> Publish</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(faq._id)}
                className="text-sm gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
