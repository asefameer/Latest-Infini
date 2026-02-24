import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2, Percent, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface Discount {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency: string;
  appliesTo: 'products' | 'events' | 'tickets' | 'all';
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const seedDiscounts: Discount[] = [
  { id: 'd1', code: 'NOVA20', description: '20% off all Nova products', type: 'percentage', value: 20, currency: 'BDT', appliesTo: 'products', minPurchase: 500, maxUses: 200, usedCount: 87, startDate: '2026-02-01', endDate: '2026-03-31', isActive: true },
  { id: 'd2', code: 'ENCOUNTER500', description: '৳500 off event tickets', type: 'fixed', value: 500, currency: 'BDT', appliesTo: 'tickets', minPurchase: 2000, maxUses: 100, usedCount: 34, startDate: '2026-02-15', endDate: '2026-04-15', isActive: true },
  { id: 'd3', code: 'WELCOME10', description: '10% off first order', type: 'percentage', value: 10, currency: 'BDT', appliesTo: 'all', maxUses: 1000, usedCount: 412, startDate: '2026-01-01', endDate: '2026-12-31', isActive: true },
  { id: 'd4', code: 'XFORCE15', description: '15% off X-Force events', type: 'percentage', value: 15, currency: 'BDT', appliesTo: 'events', maxUses: 50, usedCount: 50, startDate: '2026-01-10', endDate: '2026-02-10', isActive: false },
  { id: 'd5', code: 'FLASH1000', description: '৳1000 off sitewide', type: 'fixed', value: 1000, currency: 'BDT', appliesTo: 'all', minPurchase: 5000, maxUses: 30, usedCount: 12, startDate: '2026-02-20', endDate: '2026-02-28', isActive: true },
];

const emptyDiscount: Omit<Discount, 'id'> = {
  code: '', description: '', type: 'percentage', value: 0, currency: 'BDT',
  appliesTo: 'all', usedCount: 0, startDate: '', endDate: '', isActive: true,
};

const APPLIES_LABELS: Record<string, string> = {
  all: 'All', products: 'Products', events: 'Events', tickets: 'Tickets',
};

const APPLIES_COLORS: Record<string, string> = {
  all: 'bg-primary/10 text-primary border-primary/30',
  products: 'bg-secondary/10 text-secondary border-secondary/30',
  events: 'bg-accent text-accent-foreground border-accent',
  tickets: 'bg-muted text-muted-foreground border-border',
};

const DiscountsAdmin = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(seedDiscounts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState<Omit<Discount, 'id'>>({ ...emptyDiscount });

  const filtered = useMemo(() =>
    discounts.filter(d => {
      const matchSearch = d.code.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || d.appliesTo === categoryFilter;
      return matchSearch && matchCat;
    }),
    [discounts, search, categoryFilter]
  );

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyDiscount });
    setDialogOpen(true);
  };

  const openEdit = (d: Discount) => {
    setEditing(d);
    const { id, ...rest } = d;
    setForm({ ...rest });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.code || !form.startDate || !form.endDate || form.value <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (editing) {
      setDiscounts(prev => prev.map(d => d.id === editing.id ? { ...d, ...form } : d));
      toast.success('Discount updated');
    } else {
      setDiscounts(prev => [{ ...form, id: `d-${Date.now()}` }, ...prev]);
      toast.success('Discount created');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this discount?')) return;
    setDiscounts(prev => prev.filter(d => d.id !== id));
    toast.success('Discount deleted');
  };

  const toggleActive = (id: string) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const isExpired = (d: Discount) => new Date(d.endDate) < new Date();
  const isFullyUsed = (d: Discount) => d.maxUses !== undefined && d.usedCount >= d.maxUses;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Discounts</h1>
        <Button size="sm" className="gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> Create Discount
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search codes…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'products', 'events', 'tickets'].map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full border transition-colors',
                categoryFilter === c
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {APPLIES_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Code</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Description</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Type</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Applies To</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Usage</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Validity</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-mono font-semibold text-foreground">{d.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{d.description}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-foreground">
                      {d.type === 'percentage' ? <Percent className="w-3.5 h-3.5" /> : '৳'}
                      {d.value}{d.type === 'percentage' ? '%' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn('text-xs', APPLIES_COLORS[d.appliesTo])}>
                      {APPLIES_LABELS[d.appliesTo]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground text-xs">
                    {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {d.startDate} → {d.endDate}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isExpired(d) ? (
                      <Badge variant="outline" className="text-xs text-muted-foreground">Expired</Badge>
                    ) : isFullyUsed(d) ? (
                      <Badge variant="outline" className="text-xs text-muted-foreground">Maxed</Badge>
                    ) : (
                      <Switch checked={d.isActive} onCheckedChange={() => toggleActive(d.id)} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(d)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No discounts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Promo Code</Label>
                <Input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="SUMMER20" />
              </div>
              <div className="space-y-2">
                <Label>Applies To</Label>
                <Select value={form.appliesTo} onValueChange={v => set('appliesTo', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All (Sitewide)</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="tickets">Tickets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="20% off summer collection" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => set('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" value={form.value || ''} onChange={e => set('value', +e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Min Purchase</Label>
                <Input type="number" value={form.minPurchase || ''} onChange={e => set('minPurchase', +e.target.value || undefined)} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Max Uses</Label>
                <Input type="number" value={form.maxUses || ''} onChange={e => set('maxUses', +e.target.value || undefined)} placeholder="Unlimited" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editing ? 'Update Discount' : 'Create Discount'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountsAdmin;
