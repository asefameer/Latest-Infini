import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import EmptyState from '@/components/EmptyState';
import PromoCodeInput from '@/components/PromoCodeInput';
import { useEvents } from '@/services/api/hooks';

const TicketCheckout = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: events = [] } = useEvents();
  const [form, setForm] = useState({ name: '', email: '', phone: '', paymentMethod: 'bkash' });
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number } | null>(null);

  const event = events.find(e => e.id === eventId);

  if (!event) return <EmptyState title="Event Not Found" description="This event doesn't exist." actionLabel="Browse Events" actionLink="/encounter" />;

  let tierQty: Record<string, number> = {};
  try { tierQty = JSON.parse(searchParams.get('tiers') || '{}'); } catch {}

  const selections = event.ticketTiers.filter(t => tierQty[t.id] > 0).map(t => ({ ...t, qty: tierQty[t.id] }));
  const subtotal = selections.reduce((s, t) => s + t.price * t.qty, 0);

  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'percentage'
      ? Math.round(subtotal * (appliedPromo.value / 100))
      : Math.min(appliedPromo.value, subtotal)
    : 0;
  const total = subtotal - promoDiscount;

  const handleConfirm = () => { navigate(`/encounter/confirmed/TKT-${Date.now()}`); };

  return (
    <>
      <SEOHead title={`Checkout — ${event.title}`} description="Complete your ticket purchase." />
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Ticket Checkout</h1>
        <p className="text-muted-foreground text-sm mb-8">{event.title}</p>
        <div className="p-4 rounded-xl border border-border/30 bg-card/50 mb-8 space-y-2">
          {selections.map(s => <div key={s.id} className="flex justify-between text-sm"><span>{s.name} × {s.qty}</span><span>৳{(s.price * s.qty).toLocaleString()}</span></div>)}
          <div className="border-t border-border/30 pt-2 space-y-1">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span>Discount ({appliedPromo!.type === 'percentage' ? `${appliedPromo!.value}%` : `৳${appliedPromo!.value}`})</span>
                <span>-৳{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
          </div>
          <PromoCodeInput
            appliesTo="tickets"
            subtotal={subtotal}
            onApply={setAppliedPromo}
            onRemove={() => setAppliedPromo(null)}
            appliedCode={appliedPromo?.code}
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-lg">Buyer Information</h2>
          <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full rounded-lg border border-border/40 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <h2 className="font-display font-semibold text-lg pt-4">Payment</h2>
          {['bkash', 'nagad', 'card'].map(m => (
            <label key={m} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${form.paymentMethod === m ? 'border-primary bg-primary/5' : 'border-border/40'}`}>
              <input type="radio" name="pay" value={m} checked={form.paymentMethod === m} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))} className="accent-primary" />
              <span className="text-sm font-medium capitalize">{m === 'card' ? 'Credit/Debit Card' : m}</span>
            </label>
          ))}
          <button onClick={handleConfirm} className="w-full rounded-full py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity mt-4">Confirm Purchase</button>
        </div>
      </div>
    </>
  );
};

export default TicketCheckout;
