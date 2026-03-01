import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ErrorState from '@/components/ErrorState';
import { useMyOrder } from '@/services/api/hooks';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const statusColor = (s: Order['status']) => {
  switch (s) {
    case 'processing': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'shipped': return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
    case 'delivered': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'cancelled': return 'bg-destructive/15 text-destructive border-destructive/30';
  }
};

const STEPS: { key: Order['status']; label: string }[] = [
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useCustomerAuth();
  const { data: order, isLoading, isError, refetch } = useMyOrder(orderId || '', !!user);

  return (
    <>
      <SEOHead title={`Order ${orderId}`} description="Order details." />
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Orders', href: '/account/orders' }, { label: orderId || '' }]} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading order…
          </div>
        ) : isError ? (
          <ErrorState title="Couldn't load order" onRetry={() => refetch()} />
        ) : !order ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Order not found.</p>
            <Link to="/account/orders" className="text-sm text-primary hover:underline">← Back to Orders</Link>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">{order.id}</h1>
                <p className="text-sm text-muted-foreground">Placed on {format(new Date(order.createdAt), 'PPp')}</p>
              </div>
              <Badge variant="outline" className={statusColor(order.status)}>{order.status}</Badge>
            </div>

            {/* Status tracker */}
            {order.status !== 'cancelled' && (
              <div className="flex items-center mb-8">
                {STEPS.map((step, i) => {
                  const activeIdx = STEPS.findIndex(s => s.key === order.status);
                  const done = i <= activeIdx;
                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${done ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>
                          {i + 1}
                        </div>
                        <span className={`text-xs mt-1 ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-2 ${i < activeIdx ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive mb-6">
                This order has been cancelled.
              </div>
            )}

            {/* Items */}
            <div className="rounded-xl border border-border/30 bg-card/50 p-5 space-y-4 mb-6">
              <h2 className="font-display font-semibold">Items ({order.items.length})</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img src={item.image || '/placeholder.svg'} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/editions/p/${item.productSlug}`} className="font-medium text-sm hover:text-primary transition-colors truncate block">
                        {item.productName}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{order.subtotal.toLocaleString()}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-primary"><span>Discount {order.promoCode && `(${order.promoCode})`}</span><span>-৳{order.discount.toLocaleString()}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `৳${order.shippingCost.toLocaleString()}`}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>৳{order.total.toLocaleString()}</span></div>
              </div>
            </div>

            {/* Shipping + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-border/30 bg-card/50 p-5">
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Shipping Address</h3>
                <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p className="text-sm text-muted-foreground">{order.shippingAddress.line2}</p>}
                <p className="text-sm text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.district} {order.shippingAddress.postalCode}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
              <div className="rounded-xl border border-border/30 bg-card/50 p-5">
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Payment</h3>
                <p className="text-sm font-medium capitalize">{order.paymentMethod}</p>
                <Badge variant="outline" className="mt-1 capitalize">{order.paymentStatus}</Badge>
              </div>
            </div>

            {order.notes && (
              <div className="rounded-xl border border-border/30 bg-card/50 p-5 mb-6">
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}

            <Link to="/account/orders" className="inline-block text-sm text-primary hover:underline">← Back to Orders</Link>
          </>
        )}
      </div>
    </>
  );
};

export default OrderDetail;
