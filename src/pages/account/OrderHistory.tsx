import SEOHead from '@/components/SEOHead';
import EmptyState from '@/components/EmptyState';
import { Package } from 'lucide-react';

const OrderHistory = () => (
  <>
    <SEOHead title="Order History" description="View your past orders." canonical="/account/orders" />
    <div className="container mx-auto px-6 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight mb-10">Order History</h1>
      <EmptyState
        icon={<Package className="w-7 h-7" />}
        title="No orders yet"
        description="When you place an order, it will appear here."
        actionLabel="Start Shopping"
        actionLink="/editions"
      />
    </div>
  </>
);

export default OrderHistory;
