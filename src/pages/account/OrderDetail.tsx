import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <>
      <SEOHead title={`Order ${orderId}`} description="Order details." />
      <div className="container mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Orders', href: '/account/orders' }, { label: orderId || '' }]} />
        <h1 className="font-display text-3xl font-bold tracking-tight mb-8">Order {orderId}</h1>

        {/* Placeholder order detail */}
        <div className="p-6 rounded-xl border border-border/30 bg-card/50 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Processing</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="border-t border-border/30 pt-4 text-sm text-muted-foreground text-center">
            Order details will be available when connected to backend.
          </div>
        </div>

        <Link to="/account/orders" className="inline-block mt-6 text-sm text-primary hover:underline">← Back to Orders</Link>
      </div>
    </>
  );
};

export default OrderDetail;
