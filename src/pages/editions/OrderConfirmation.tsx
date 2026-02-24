import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useOrder } from '@/services/api/hooks';
import { CheckCircle, Download, Package, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useOrder(orderId || '');

  return (
    <>
      <SEOHead title="Order Confirmed" description="Your order has been placed successfully." canonical={`/order/confirmed/${orderId}`} />

      <div className="container mx-auto px-6 py-20 max-w-lg">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-1">Thank you for your purchase.</p>
          <p className="text-sm text-muted-foreground">Order ID: <span className="text-foreground font-medium font-mono">{orderId}</span></p>
        </div>

        {/* Order details */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading order details…
          </div>
        ) : order ? (
          <div className="rounded-xl border border-border/30 bg-card/50 p-5 space-y-4 mb-8">
            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
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

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{order.subtotal.toLocaleString()}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount {order.promoCode && `(${order.promoCode})`}</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `৳${order.shippingCost.toLocaleString()}`}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>৳{order.total.toLocaleString()}</span></div>
            </div>

            <Separator />

            {/* Status + shipping */}
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">{order.status}</Badge>
              <Badge variant="outline" className="capitalize">{order.paymentStatus}</Badge>
            </div>

            <div className="text-sm">
              <p className="font-medium mb-0.5">Shipping to</p>
              <p className="text-muted-foreground">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.line1}{order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}</p>
              <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.district} {order.shippingAddress.postalCode}</p>
            </div>

            <p className="text-xs text-muted-foreground">
              Placed on {format(new Date(order.createdAt), 'PPp')}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/30 bg-card/50 p-6 text-left text-sm mb-8">
            <p>Your order is being processed and you'll receive a confirmation email shortly.</p>
            <p className="text-muted-foreground mt-2">Estimated delivery: 3-5 business days within Dhaka, 5-7 days outside.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors">
            <Download className="w-4 h-4" /> Download Invoice
          </button>
          <Link to="/account/orders" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors">
            <Package className="w-4 h-4" /> Track Order
          </Link>
        </div>

        <Link to="/editions" className="block text-center mt-8 text-sm text-primary hover:underline">Continue Shopping</Link>
      </div>
    </>
  );
};

export default OrderConfirmation;
