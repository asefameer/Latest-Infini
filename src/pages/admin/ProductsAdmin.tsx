import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus, Search, Pencil, Trash2, Filter, ChevronDown, ChevronUp, FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProducts, useDeleteProduct, useUpdateProduct } from '@/services/api/hooks';
import ErrorState from '@/components/ErrorState';
import { CSVProductUpload } from '@/components/admin/CSVProductUpload';

const BRAND_LABELS: Record<string, string> = { nova: 'Nova', 'live-the-moment': 'Live the Moment', 'x-force': 'X-Force' };

const ProductsAdmin = () => {
  const { data: items = [], isLoading, isError, refetch } = useProducts();
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [showCSV, setShowCSV] = useState(false);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
      const matchBrand = brandFilter === 'all' || p.brand === brandFilter;
      return matchSearch && matchBrand;
    });
  }, [items, search, brandFilter]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    deleteMutation.mutate(id, { onSuccess: () => toast.success('Product deleted') });
  };

  const handleToggleLive = (p: Product) => {
    updateMutation.mutate(
      { id: p.id, data: { isLive: !p.isLive } },
      { onSuccess: () => toast.success(p.isLive ? 'Product saved as draft' : 'Product is now live') }
    );
  };

  const handlePriceUpdate = (id: string, price: number, compareAt?: number) => {
    updateMutation.mutate(
      { id, data: { price, compareAtPrice: compareAt } },
      { onSuccess: () => { toast.success('Price updated'); setEditingPrice(null); } }
    );
  };

  const handleDiscountUpdate = (id: string, type: string, value: number) => {
    if (type === 'none') {
      updateMutation.mutate(
        { id, data: { compareAtPrice: undefined } },
        { onSuccess: () => { toast.success('Discount removed'); setEditingDiscount(null); } }
      );
    } else {
      const product = items.find(p => p.id === id);
      if (!product) return;
      const originalPrice = product.compareAtPrice || product.price;
      const newPrice = type === 'percentage'
        ? Math.round(originalPrice * (1 - value / 100))
        : Math.max(0, originalPrice - value);
      updateMutation.mutate(
        { id, data: { price: newPrice, compareAtPrice: originalPrice } },
        { onSuccess: () => { toast.success('Discount applied'); setEditingDiscount(null); } }
      );
    }
  };

  if (isLoading) return <div className="text-muted-foreground py-12 text-center">Loading products…</div>;
  if (isError) return <ErrorState title="Couldn't load products" onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCSV(!showCSV)}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV Upload
            {showCSV ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          <Link to="/admin/products/new">
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
          </Link>
        </div>
      </div>

      {/* CSV Upload Panel */}
      {showCSV && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-foreground">Bulk CSV Upload</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Upload one or more CSV files to bulk-add products. Download the sample to see the expected format.
              </p>
            </div>
          </div>
          <CSVProductUpload onComplete={() => { refetch(); setShowCSV(false); }} />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {['all', 'nova', 'live-the-moment', 'x-force'].map(b => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                brandFilter === b ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {b === 'all' ? 'All' : BRAND_LABELS[b]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Product</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Brand</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Price</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Stock</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Live</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Discount</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{BRAND_LABELS[p.brand]}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>

                  {/* Inline price editing */}
                  <td className="px-4 py-3 text-right">
                    {editingPrice === p.id ? (
                      <InlinePriceEditor
                        price={p.price}
                        compareAt={p.compareAtPrice}
                        onSave={(price, compareAt) => handlePriceUpdate(p.id, price, compareAt)}
                        onCancel={() => setEditingPrice(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingPrice(p.id)}
                        className="text-foreground font-mono hover:text-primary transition-colors cursor-pointer"
                        title="Click to edit price"
                      >
                        ৳{p.price.toLocaleString()}
                        {p.compareAtPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-1">৳{p.compareAtPrice.toLocaleString()}</span>
                        )}
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Badge variant={p.inStock ? 'default' : 'destructive'} className="text-xs">{p.inStock ? 'In Stock' : 'Out'}</Badge>
                  </td>

                  {/* Live/Draft toggle */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={p.isLive ?? false}
                        onCheckedChange={() => handleToggleLive(p)}
                        className="scale-90"
                      />
                      <span className={`text-xs ${p.isLive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {p.isLive ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </td>

                  {/* Inline discount */}
                  <td className="px-4 py-3 text-center">
                    {editingDiscount === p.id ? (
                      <InlineDiscountEditor
                        product={p}
                        onApply={(type, value) => handleDiscountUpdate(p.id, type, value)}
                        onCancel={() => setEditingDiscount(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingDiscount(p.id)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Click to adjust discount"
                      >
                        {p.compareAtPrice && p.compareAtPrice > p.price
                          ? <Badge variant="secondary" className="text-xs">-{Math.round((1 - p.price / p.compareAtPrice) * 100)}%</Badge>
                          : <span className="text-muted-foreground/50">—</span>
                        }
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/products/${p.id}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button></Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── Inline Price Editor ── */
const InlinePriceEditor = ({
  price, compareAt, onSave, onCancel,
}: {
  price: number; compareAt?: number;
  onSave: (price: number, compareAt?: number) => void;
  onCancel: () => void;
}) => {
  const [p, setP] = useState(price);
  const [c, setC] = useState(compareAt || 0);
  return (
    <div className="flex flex-col gap-1 items-end" onClick={e => e.stopPropagation()}>
      <Input type="number" value={p} onChange={e => setP(+e.target.value)} className="h-7 text-xs w-24 text-right" placeholder="Price" />
      <Input type="number" value={c || ''} onChange={e => setC(+e.target.value)} className="h-7 text-xs w-24 text-right" placeholder="Compare at" />
      <div className="flex gap-1">
        <Button type="button" size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={onCancel}>✕</Button>
        <Button type="button" size="sm" className="h-6 text-xs px-2" onClick={() => onSave(p, c || undefined)}>Save</Button>
      </div>
    </div>
  );
};

/* ── Inline Discount Editor ── */
const InlineDiscountEditor = ({
  product, onApply, onCancel,
}: {
  product: Product;
  onApply: (type: string, value: number) => void;
  onCancel: () => void;
}) => {
  const [type, setType] = useState<string>(product.compareAtPrice ? 'percentage' : 'none');
  const [value, setValue] = useState(
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0
  );
  return (
    <div className="flex flex-col gap-1 items-center" onClick={e => e.stopPropagation()}>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="h-7 text-xs w-[110px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Discount</SelectItem>
          <SelectItem value="percentage">% Off</SelectItem>
          <SelectItem value="fixed">৳ Off</SelectItem>
        </SelectContent>
      </Select>
      {type !== 'none' && (
        <Input type="number" value={value} onChange={e => setValue(+e.target.value)} className="h-7 text-xs w-20 text-center" placeholder="Value" />
      )}
      <div className="flex gap-1">
        <Button type="button" size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={onCancel}>✕</Button>
        <Button type="button" size="sm" className="h-6 text-xs px-2" onClick={() => onApply(type, value)}>Apply</Button>
      </div>
    </div>
  );
};

export default ProductsAdmin;
