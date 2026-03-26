"use client";

import { useState, useEffect } from "react";
import { Gift, Plus, Search, Copy, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface GiftCard {
  _id: string;
  code: string;
  amount: number;
  remainingBalance: number;
  currency: string;
  senderName: string;
  senderEmail: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  usedBy: string[];
}

export default function AdminGiftCardsPage() {
  useSession();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    senderName: "",
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
  });

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gift-cards");
      const data = await res.json();
      if (data.success) {
        setGiftCards(data.giftCards);
      }
    } catch {
      toast.error("Failed to fetch gift cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success(`Gift card created: ${data.giftCard.code}`);
      setIsCreateOpen(false);
      setFormData({ amount: "", senderName: "", senderEmail: "", recipientName: "", recipientEmail: "", message: "" });
      fetchGiftCards();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create gift card");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (card: GiftCard) => {
    try {
      const res = await fetch(`/api/gift-cards/${card.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !card.isActive }),
      });

      if (res.ok) {
        toast.success(`Gift card ${card.isActive ? "deactivated" : "activated"}`);
        fetchGiftCards();
      }
    } catch {
      toast.error("Failed to update gift card");
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this gift card?")) return;

    try {
      const res = await fetch(`/api/gift-cards/${code}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Gift card deleted");
        fetchGiftCards();
      }
    } catch {
      toast.error("Failed to delete gift card");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const filteredCards = giftCards.filter(
    (card) =>
      card.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  const totalValue = giftCards.reduce((acc, card) => acc + card.amount, 0);
  const totalRemaining = giftCards.reduce((acc, card) => acc + card.remainingBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gift Cards</h1>
          <p className="text-muted-foreground">Manage digital gift cards</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gift Card</DialogTitle>
              <DialogDescription>
                Create a new digital gift card. The code will be auto-generated.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    placeholder="50.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value="USD" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name *</Label>
                <Input
                  id="senderName"
                  placeholder="John Doe"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email *</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="Jane Smith"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  placeholder="Add a personal message..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold">{giftCards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">${totalRemaining.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">%</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-2xl font-bold">
                  {totalValue > 0 ? (((totalValue - totalRemaining) / totalValue) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Gift Cards</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No gift cards found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCards.map((card) => (
                    <TableRow key={card._id} className={!card.isActive || isExpired(card.expiresAt) ? "opacity-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{card.code}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyCode(card.code)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${card.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={card.remainingBalance < card.amount ? "text-orange-600" : ""}>
                          ${card.remainingBalance.toFixed(2)}
                        </span>
                      </TableCell>
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
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={card.isActive && !isExpired(card.expiresAt) ? "default" : "secondary"}>
                          {!card.isActive ? "Inactive" : isExpired(card.expiresAt) ? "Expired" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(card.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => copyCode(card.code)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(card)}>
                              {card.isActive ? (
                                <>
                                  <span className="w-4 h-4 mr-2 rounded-full bg-red-500" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <span className="w-4 h-4 mr-2 rounded-full bg-green-500" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(card.code)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
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
    </div>
  );
}
