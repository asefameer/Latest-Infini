import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products } from '@/data/products';
import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const emptyProduct: Omit<Product, 'id'> = {
  slug: '', name: '', brand: 'nova', category: 'apparel', price: 0,
  currency: 'BDT', images: ['/placeholder.svg'], description: '',
  specs: [], variants: [], tags: [], inStock: true,
};

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productId && productId !== 'new';
  const existing = isEdit ? products.find(p => p.id === productId) : null;

  const [form, setForm] = useState<Omit<Product, 'id'>>(existing ? { ...existing } : { ...emptyProduct });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && existing) setForm({ ...existing });
  }, [productId]);

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock save — in production this would persist
    setTimeout(() => {
      setSaving(false);
      toast.success(isEdit ? 'Product updated' : 'Product created');
      navigate('/admin/products');
    }, 500);
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">
        {isEdit ? `Edit: ${form.name}` : 'New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => set('slug', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={form.brand} onValueChange={v => set('brand', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="live-the-moment">Live the Moment</SelectItem>
                  <SelectItem value="x-force">X-Force</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="limited-drops">Limited Drops</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Pricing & Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (BDT)</Label>
              <Input type="number" value={form.price} onChange={e => set('price', +e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Compare At Price</Label>
              <Input type="number" value={form.compareAtPrice || ''} onChange={e => set('compareAtPrice', +e.target.value || undefined)} />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input value={form.currency} onChange={e => set('currency', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.inStock} onCheckedChange={v => set('inStock', v)} />
              <Label>In Stock</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isNew || false} onCheckedChange={v => set('isNew', v)} />
              <Label>New Arrival</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isTrending || false} onCheckedChange={v => set('isTrending', v)} />
              <Label>Trending</Label>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Images</h2>
          <p className="text-xs text-muted-foreground">Enter image URLs, one per line</p>
          <Textarea
            rows={3}
            value={form.images.join('\n')}
            onChange={e => set('images', e.target.value.split('\n').filter(Boolean))}
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Tags</h2>
          <Input
            placeholder="Comma-separated tags"
            value={form.tags.join(', ')}
            onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
