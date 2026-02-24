import { useState } from 'react';
import { discountsApi } from '@/services/api';
import { Tag, Check, X, Loader2 } from 'lucide-react';

interface PromoCodeInputProps {
  appliesTo: 'products' | 'events' | 'tickets' | 'all';
  subtotal: number;
  onApply: (discount: { code: string; type: 'percentage' | 'fixed'; value: number }) => void;
  onRemove: () => void;
  appliedCode?: string;
}

const PromoCodeInput = ({ appliesTo, subtotal, onApply, onRemove, appliedCode }: PromoCodeInputProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    const code = input.trim().toUpperCase();
    if (!code) return;
    setError('');
    setLoading(true);

    try {
      const discount = await discountsApi.getByCode(code);

      if (!discount) {
        setError('Invalid promo code');
        setLoading(false);
        return;
      }

      if (discount.appliesTo !== 'all' && discount.appliesTo !== appliesTo) {
        setError(`This code applies to ${discount.appliesTo} only`);
        setLoading(false);
        return;
      }

      const now = new Date();
      if (new Date(discount.endDate) < now) {
        setError('This code has expired');
        setLoading(false);
        return;
      }
      if (new Date(discount.startDate) > now) {
        setError('This code is not yet active');
        setLoading(false);
        return;
      }

      if (discount.maxUses !== undefined && discount.usedCount >= discount.maxUses) {
        setError('This code has reached its usage limit');
        setLoading(false);
        return;
      }

      if (discount.minPurchase && subtotal < discount.minPurchase) {
        setError(`Minimum purchase of ৳${discount.minPurchase.toLocaleString()} required`);
        setLoading(false);
        return;
      }

      onApply({ code: discount.code, type: discount.type as 'percentage' | 'fixed', value: discount.value });
      setInput('');
    } catch {
      setError('Failed to validate code');
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{appliedCode}</span>
          <span className="text-xs text-muted-foreground">applied</span>
        </div>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove code">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Promo code"
            value={input}
            onChange={e => { setInput(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            className="w-full rounded-full border border-border/40 bg-transparent pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="rounded-full px-5 py-2 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs text-destructive pl-1">{error}</p>}
    </div>
  );
};

export default PromoCodeInput;
