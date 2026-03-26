'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Eye, Trash2, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface AbandonedCart {
  _id: string;
  email?: string;
  items: {
    productId: { name: string; images?: string[] };
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'active' | 'recovered' | 'expired' | 'notified';
  recoveryAttempts: number;
  createdAt: string;
  expiresAt: string;
}

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    fetchCarts();
  }, [statusFilter]);

  const fetchCarts = async () => {
    try {
      const url = statusFilter !== 'all' 
        ? `/api/abandoned-carts?status=${statusFilter}` 
        : '/api/abandoned-carts';
      const res = await fetch(url);
      const data = await res.json();
      setCarts(data);
    } catch (error) {
      console.error('Failed to fetch carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRecoveryEmail = async (cartId: string) => {
    try {
      await fetch(`/api/abandoned-carts/${cartId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'notified',
          lastNotifiedAt: new Date(),
          recoveryAttempts: 1,
        }),
      });
      fetchCarts();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleDeleteCart = async (cartId: string) => {
    if (!confirm('Are you sure you want to delete this abandoned cart?')) return;
    try {
      await fetch(`/api/abandoned-carts/${cartId}`, { method: 'DELETE' });
      fetchCarts();
    } catch (error) {
      console.error('Failed to delete cart:', error);
    }
  };

  const handleMarkRecovered = async (cartId: string) => {
    try {
      await fetch(`/api/abandoned-carts/${cartId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'recovered', recoveredAt: new Date() }),
      });
      fetchCarts();
    } catch (error) {
      console.error('Failed to mark recovered:', error);
    }
  };

  const filteredCarts = carts.filter((cart) =>
    cart.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const stats = {
    total: carts.length,
    active: carts.filter((c) => c.status === 'active').length,
    recovered: carts.filter((c) => c.status === 'recovered').length,
    potential: carts.reduce((sum, c) => sum + c.totalAmount, 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-yellow-500',
      recovered: 'bg-green-500',
      expired: 'bg-gray-500',
      notified: 'bg-blue-500',
    };
    return (
      <Badge className={variants[status] || 'bg-gray-500'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Abandoned Carts</h1>
        <Button onClick={fetchCarts} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Carts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recovered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.recovered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.potential.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="recovered">Recovered</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="notified">Notified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recovery Attempts</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarts.map((cart) => (
              <TableRow key={cart._id}>
                <TableCell className="font-medium">{cart.email || 'Guest'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cart.items.slice(0, 2).map((item, i) => (
                      <Badge key={i} variant="outline">
                        {item.quantity}x {item.name.substring(0, 15)}...
                      </Badge>
                    ))}
                    {cart.items.length > 2 && (
                      <Badge variant="outline">+{cart.items.length - 2} more</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>${cart.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(cart.status)}</TableCell>
                <TableCell>{cart.recoveryAttempts}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(cart.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {cart.status === 'active' && cart.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendRecoveryEmail(cart._id)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                    {cart.status === 'notified' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkRecovered(cart._id)}
                      >
                        Mark Recovered
                      </Button>
                    )}
                    <Link href={`/admin/abandoned-carts/${cart._id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCart(cart._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCarts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No abandoned carts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
