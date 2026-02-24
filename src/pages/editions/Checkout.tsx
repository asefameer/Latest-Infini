import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useCart } from '@/components/CartContext';
import PromoCodeInput from '@/components/PromoCodeInput';
import { Check } from 'lucide-react';

const steps = ['Info', 'Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { state, subtotal, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', line2: '', city: '', district: '', postalCode: '', paymentMethod: 'bkash' });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handlePlaceOrder = () => {
    const orderId = `ORD-${Date.now()}`;
    dispatch({ type: 'CLEAR_CART' });
    navigate(`/order/confirmed/${orderId}`);
  };

  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number } | null>(
    state.discount > 0 && state.promoCode ? { code: state.promoCode, type: 'percentage', value: state.discount } : null
  );

  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'percentage'
      ? Math.round(subtotal * (appliedPromo.value / 100))
      : Math.min(appliedPromo.value, subtotal)
    : 0;
  const finalTotal = subtotal - promoDiscount;

  const handleApplyPromo = (promo: { code: string; type: 'percentage' | 'fixed'; value: number }) => {
    setAppliedPromo(promo);
    dispatch({ type: 'APPLY_PROMO', code: promo.code });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    dispatch({ type: 'APPLY_PROMO', code: '' });
  };

  return (
    <>
      <SEOHead title="Checkout" description="Complete your purchase." canonical="/checkout" />

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i < step ? 'bg-primary text-primary-foreground' : i === step ? 'border-2 border-primary text-primary' : 'border border-border/40 text-muted-foreground'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </button>
              <span className={`text-sm hidden sm:inline ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border/40" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Customer Information</h2>
              <p className="text-sm text-muted-foreground">Guest checkout — or <a href="/account" className="text-primary hover:underline">sign in</a></p>
              <input placeholder="Full Name" value={form.name} onChange={e => update('name', e.target.value)} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={() => setStep(1)} className="rounded-full px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">Continue to Shipping</button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Shipping Address</h2>
              <input placeholder="Address Line 1" value={form.line1} onChange={e => update('line1', e.target.value)} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="Address Line 2 (optional)" value={form.line2} onChange={e => update('line2', e.target.value)} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" value={form.city} onChange={e => update('city', e.target.value)} className="rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input placeholder="District" value={form.district} onChange={e => update('district', e.target.value)} className="rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <input placeholder="Postal Code" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={() => setStep(2)} className="rounded-full px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Payment Method</h2>
              {['bkash', 'nagad', 'card', 'cod'].map(method => (
                <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${form.paymentMethod === method ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-foreground/20'}`}>
                  <input type="radio" name="payment" value={method} checked={form.paymentMethod === method} onChange={e => update('paymentMethod', e.target.value)} className="accent-primary" />
                  <span className="text-sm font-medium capitalize">{method === 'cod' ? 'Cash on Delivery' : method === 'card' ? 'Credit/Debit Card' : method}</span>
                </label>
              ))}
              <button onClick={() => setStep(3)} className="rounded-full px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">Review Order</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-lg">Review Order</h2>
              <div className="space-y-3 p-4 rounded-xl border border-border/30 bg-card/50">
                {state.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>৳{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-border/30 pt-2 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({appliedPromo!.type === 'percentage' ? `${appliedPromo!.value}%` : `৳${appliedPromo!.value}`})</span>
                      <span>-৳{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>৳{finalTotal.toLocaleString()}</span></div>
                </div>
                <PromoCodeInput
                  appliesTo="products"
                  subtotal={subtotal}
                  onApply={handleApplyPromo}
                  onRemove={handleRemovePromo}
                  appliedCode={appliedPromo?.code}
                />
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong className="text-foreground">Ship to:</strong> {form.line1}, {form.city}</p>
                <p><strong className="text-foreground">Payment:</strong> {form.paymentMethod}</p>
              </div>
              <button onClick={handlePlaceOrder} className="w-full rounded-full py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">Place Order</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
