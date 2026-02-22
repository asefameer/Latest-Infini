import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { CheckCircle, Download, Package } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <>
      <SEOHead title="Order Confirmed" description="Your order has been placed successfully." canonical={`/order/confirmed/${orderId}`} />

      <div className="container mx-auto px-6 py-20 text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-muted-foreground mb-8">Order ID: <span className="text-foreground font-medium">{orderId}</span></p>

        <div className="space-y-3 p-6 rounded-xl border border-border/30 bg-card/50 text-left text-sm mb-8">
          <p>Your order is being processed and you'll receive a confirmation email shortly.</p>
          <p className="text-muted-foreground">Estimated delivery: 3-5 business days within Dhaka, 5-7 days outside.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors">
            <Download className="w-4 h-4" /> Download Invoice
          </button>
          <Link to="/account/orders" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors">
            <Package className="w-4 h-4" /> Track Order
          </Link>
        </div>

        <Link to="/editions" className="inline-block mt-8 text-sm text-primary hover:underline">Continue Shopping</Link>
      </div>
    </>
  );
};

export default OrderConfirmation;
