"use client";

import { Search, Copy, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, isExpired } from "@/lib/services/gift-cards-service";
import type { GiftCard } from "@/lib/services/gift-cards-service";

interface Props {
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredCards: GiftCard[];
  onCopyCode: (code: string) => void;
  onToggleActive: (card: GiftCard) => void;
  onDelete: (code: string) => void;
}

export function GiftCardsTable({ loading, searchQuery, onSearchChange, filteredCards, onCopyCode, onToggleActive, onDelete }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Gift Cards</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search gift cards..." value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
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
                <TableHead>Code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No gift cards found</TableCell></TableRow>
              ) : (
                filteredCards.map((card) => (
                  <TableRow key={card._id} className={!card.isActive || isExpired(card.expiresAt) ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{card.code}</span>
                        <Button variant="ghost" size="sm" onClick={() => onCopyCode(card.code)}><Copy className="w-3 h-3" /></Button>
                      </div>
                    </TableCell>
                    <TableCell>${card.amount.toFixed(2)}</TableCell>
                    <TableCell><span className={card.remainingBalance < card.amount ? "text-orange-600" : ""}>${card.remainingBalance.toFixed(2)}</span></TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{card.senderName}</p>
                        <p className="text-xs text-muted-foreground">{card.senderEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {card.recipientName ? (
                        <div>
                          <p className="font-medium">{card.recipientName}</p>
                          <p className="text-xs text-muted-foreground">{card.recipientEmail}</p>
                        </div>
                      ) : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={card.isActive && !isExpired(card.expiresAt) ? "default" : "secondary"}>
                        {!card.isActive ? "Inactive" : isExpired(card.expiresAt) ? "Expired" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(card.expiresAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onCopyCode(card.code)}><Copy className="w-4 h-4 mr-2" />Copy Code</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleActive(card)}>
                            {card.isActive ? <><span className="w-4 h-4 mr-2 rounded-full bg-red-500" />Deactivate</>
                              : <><span className="w-4 h-4 mr-2 rounded-full bg-green-500" />Activate</>}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(card.code)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
