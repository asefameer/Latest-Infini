import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useMyOrders } from '@/services/api/hooks';
import { Badge } from '@/components/ui/badge';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
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

const STEPS: Order['status'][] = ['processing', 'shipped', 'delivered'];

const StatusTracker = ({ status }: { status: Order['status'] }) => {
  const activeIdx = status === 'cancelled' ? -1 : STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${i <= activeIdx ? 'bg-primary' : 'bg-border'}`} />
          {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < activeIdx ? 'bg-primary' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
};

const OrderHistory = () => {
  const { user } = useCustomerAuth();
  const { data: orders = [], isLoading, isError, refetch } = useMyOrders(!!user);

  return (
    <>
      <SEOHead title="Order History" description="View your past orders." canonical="/account/orders" />
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Order History</h1>
        <p className="text-sm text-muted-foreground mb-8">Showing orders for {user?.email}.</p>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading orders…
          </div>
        ) : isError ? (
          <ErrorState title="Couldn't load orders" onRetry={() => refetch()} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package className="w-7 h-7" />}
            title="No orders yet"
            description="When you place an order, it will appear here."
            actionLabel="Start Shopping"
            actionLink="/editions"
          />
        ) : (
          <div className="space-y-4">
            {orders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(order => (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="block rounded-xl border border-border/30 bg-card/50 p-5 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColor(order.status)}>{order.status}</Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mb-3">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={item.image || '/placeholder.svg'} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusTracker status={order.status} />
                    <p className="font-semibold text-sm">৳{order.total.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
