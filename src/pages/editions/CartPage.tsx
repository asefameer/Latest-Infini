import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useCart } from '@/components/CartContext';
import EmptyState from '@/components/EmptyState';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { state, dispatch, subtotal, total, itemCount } = useCart();
  const [promoInput, setPromoInput] = useState('');

  if (state.items.length === 0) {
    return (
      <>
        <SEOHead title="Cart" description="Your shopping cart is empty." canonical="/cart" />
        <EmptyState
          icon={<ShoppingBag className="w-7 h-7" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore our editions to find something you love."
          actionLabel="Shop Editions"
          actionLink="/editions"
        />
      </>
    );
  }

  const discountAmount = Math.round(subtotal * (state.discount / 100));

  return (
    <>
      <SEOHead title="Cart" description="Review your cart and proceed to checkout." canonical="/cart" />

      <div className="container mx-auto px-6 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-10">Your Cart ({itemCount})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/30 bg-card/50">
                <div className="w-24 h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-sm truncate">{item.product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                  </p>
                  <p className="text-sm font-medium mb-3">৳{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-border/40 rounded-full">
                      <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.productId, selectedVariants: item.selectedVariants, quantity: item.quantity - 1 })} className="w-8 h-8 flex items-center justify-center hover:bg-muted/50 rounded-l-full"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.productId, selectedVariants: item.selectedVariants, quantity: item.quantity + 1 })} className="w-8 h-8 flex items-center justify-center hover:bg-muted/50 rounded-r-full"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: item.productId, selectedVariants: item.selectedVariants })} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-6 rounded-xl border border-border/30 bg-card/50 h-fit space-y-4">
            <h3 className="font-display font-semibold text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
              {state.discount > 0 && <div className="flex justify-between text-primary"><span>Discount ({state.discount}%)</span><span>-৳{discountAmount.toLocaleString()}</span></div>}
              <div className="border-t border-border/30 pt-2 flex justify-between font-semibold text-base"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                className="flex-1 rounded-full border border-border/40 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => dispatch({ type: 'APPLY_PROMO', code: promoInput })}
                className="rounded-full px-4 py-2 text-sm border border-border/40 hover:bg-muted/50 transition-colors"
              >
                Apply
              </button>
            </div>
            {state.promoCode && state.discount === 0 && <p className="text-xs text-destructive">Invalid promo code</p>}
            {state.discount > 0 && <p className="text-xs text-primary">Code "{state.promoCode}" applied!</p>}

            <Link
              to="/checkout"
              className="block w-full text-center rounded-full py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
