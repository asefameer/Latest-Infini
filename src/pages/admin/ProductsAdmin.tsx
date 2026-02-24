import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/services/api/hooks';
import ErrorState from '@/components/ErrorState';

const BRAND_LABELS: Record<string, string> = { nova: 'Nova', 'live-the-moment': 'Live the Moment', 'x-force': 'X-Force' };

const ProductsAdmin = () => {
  const { data: items = [], isLoading, isError, refetch } = useProducts();
  const deleteMutation = useDeleteProduct();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');

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

  if (isLoading) return <div className="text-muted-foreground py-12 text-center">Loading products…</div>;
  if (isError) return <ErrorState title="Couldn't load products" onRetry={() => refetch()} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
        <Link to="/admin/products/new">
          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
        </Link>
      </div>

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
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
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
                  <td className="px-4 py-3 text-right font-mono text-foreground">৳{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={p.inStock ? 'default' : 'destructive'} className="text-xs">{p.inStock ? 'In Stock' : 'Out'}</Badge>
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
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;
