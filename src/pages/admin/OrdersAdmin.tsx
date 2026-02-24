import { useState } from 'react';
import { useOrders, useUpdateOrder } from '@/services/api/hooks';
import ErrorState from '@/components/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Search, Package, Eye, ChevronDown } from 'lucide-react';
import type { Order } from '@/types';
import { format } from 'date-fns';

const STATUS_OPTIONS: Order['status'][] = ['processing', 'shipped', 'delivered', 'cancelled'];

const statusColor = (s: Order['status']) => {
  switch (s) {
    case 'processing': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'shipped': return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
    case 'delivered': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'cancelled': return 'bg-destructive/15 text-destructive border-destructive/30';
  }
};

const paymentColor = (s: Order['paymentStatus']) => {
  switch (s) {
    case 'paid': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'pending': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'refunded': return 'bg-muted text-muted-foreground border-border';
  }
};

const OrdersAdmin = () => {
  const { data: orders = [], isLoading, isError, refetch } = useOrders();
  const updateMutation = useUpdateOrder();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateMutation.mutate(
      { id: orderId, data: { status: newStatus, updatedAt: new Date().toISOString() } },
      {
        onSuccess: () => {
          toast.success(`Order ${orderId} updated to ${newStatus}`);
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
          }
        },
      }
    );
  };

  if (isLoading) return <div className="text-muted-foreground py-12 text-center">Loading orders…</div>;
  if (isError) return <ErrorState title="Couldn't load orders" onRetry={() => refetch()} />;

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track customer purchases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: '📦' },
          { label: 'Processing', value: stats.processing, icon: '⏳' },
          { label: 'Shipped', value: stats.shipped, icon: '🚚' },
          { label: 'Delivered', value: stats.delivered, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{s.icon}</span> {s.label}
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, name, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left font-medium px-4 py-3">Order ID</th>
                <th className="text-left font-medium px-4 py-3">Customer</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Total</th>
                <th className="text-left font-medium px-4 py-3">Payment</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">No orders found</td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3 font-medium">৳{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={paymentColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v as Order['status'])}
                      >
                        <SelectTrigger className={`h-7 text-xs w-32 border ${statusColor(order.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <Package className="w-5 h-5" /> {selectedOrder.id}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Status + Payment */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={statusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  <Badge variant="outline" className={paymentColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge>
                  {selectedOrder.promoCode && <Badge variant="outline">🏷 {selectedOrder.promoCode}</Badge>}
                </div>

                {/* Customer */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Customer</h4>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Items ({selectedOrder.items.length})</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                          <img src={item.image || '/placeholder.svg'} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')} · Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{selectedOrder.subtotal.toLocaleString()}</span></div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-500"><span>Discount</span><span>-৳{selectedOrder.discount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{selectedOrder.shippingCost === 0 ? 'Free' : `৳${selectedOrder.shippingCost.toLocaleString()}`}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span>৳{selectedOrder.total.toLocaleString()}</span></div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Shipping Address</h4>
                  <p className="text-sm">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.line1}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.district} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                </div>

                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </div>
                  </>
                )}

                {/* Timestamps */}
                <div className="text-xs text-muted-foreground pt-2">
                  <p>Created: {format(new Date(selectedOrder.createdAt), 'PPpp')}</p>
                  <p>Updated: {format(new Date(selectedOrder.updatedAt), 'PPpp')}</p>
                </div>

                {/* Status update in detail */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm font-medium">Update status:</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(v) => handleStatusChange(selectedOrder.id, v as Order['status'])}
                  >
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersAdmin;
