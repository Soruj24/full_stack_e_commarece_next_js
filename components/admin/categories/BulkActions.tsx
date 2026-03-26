"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Trash2, Eye, EyeOff } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkFeature: () => void;
  onBulkUnfeature: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}

export function BulkActions({
  selectedCount,
  onBulkDelete,
  onBulkFeature,
  onBulkUnfeature,
  onBulkActivate,
  onBulkDeactivate,
}: BulkActionsProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-4 py-2">
      <span className="text-sm font-bold text-primary">
        {selectedCount} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 rounded-xl">
            <MoreHorizontal className="w-4 h-4 mr-1" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onBulkFeature}>
            <Star className="w-4 h-4 mr-2" />
            Feature All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBulkUnfeature}>
            <Star className="w-4 h-4 mr-2" />
            Unfeature All
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onBulkActivate}>
            <Eye className="w-4 h-4 mr-2" />
            Activate All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBulkDeactivate}>
            <EyeOff className="w-4 h-4 mr-2" />
            Deactivate All
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onBulkDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
