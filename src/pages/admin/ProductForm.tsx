import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts, useCreateProduct, useUpdateProduct } from '@/services/api/hooks';
import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { MultiImageDropZone } from '@/components/admin/MultiImageDropZone';

const emptyProduct: Omit<Product, 'id'> = {
  slug: '', name: '', brand: 'nova', category: 'apparel', price: 0,
  currency: 'BDT', images: ['/placeholder.svg'], description: '',
  specs: [], variants: [], tags: [], inStock: true,
};

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productId && productId !== 'new';
  const { data: products = [] } = useProducts();
  const existing = isEdit ? products.find(p => p.id === productId) : null;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [form, setForm] = useState<Omit<Product, 'id'>>(existing ? { ...existing } : { ...emptyProduct });

  useEffect(() => {
    if (isEdit && existing) setForm({ ...existing });
  }, [productId, existing]);

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && productId) {
      updateMutation.mutate({ id: productId, data: form }, {
        onSuccess: () => { toast.success('Product updated'); navigate('/admin/products'); },
      });
    } else {
      const newProduct = { ...form, id: `p-${Date.now()}` } as Product;
      createMutation.mutate(newProduct, {
        onSuccess: () => { toast.success('Product created'); navigate('/admin/products'); },
      });
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

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
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => set('slug', e.target.value)} required /></div>
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
          <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} /></div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Pricing & Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Price (BDT)</Label><Input type="number" value={form.price} onChange={e => set('price', +e.target.value)} /></div>
            <div className="space-y-2"><Label>Compare At Price</Label><Input type="number" value={form.compareAtPrice || ''} onChange={e => set('compareAtPrice', +e.target.value || undefined)} /></div>
            <div className="space-y-2"><Label>Currency</Label><Input value={form.currency} onChange={e => set('currency', e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><Switch checked={form.inStock} onCheckedChange={v => set('inStock', v)} /><Label>In Stock</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.isNew || false} onCheckedChange={v => set('isNew', v)} /><Label>New Arrival</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.isTrending || false} onCheckedChange={v => set('isTrending', v)} /><Label>Trending</Label></div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Discount</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select value={(form as any).discountType || 'none'} onValueChange={v => set('discountType', v === 'none' ? undefined : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Discount</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(form as any).discountType && (form as any).discountType !== 'none' && (
              <>
                <div className="space-y-2"><Label>Value</Label><Input type="number" value={(form as any).discountValue || ''} onChange={e => set('discountValue', +e.target.value)} /></div>
                <div className="space-y-2"><Label>Promo Code</Label><Input value={(form as any).discountCode || ''} onChange={e => set('discountCode', e.target.value.toUpperCase())} placeholder="Optional" /></div>
              </>
            )}
          </div>
          {(form as any).discountType && (form as any).discountType !== 'none' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={(form as any).discountStart || ''} onChange={e => set('discountStart', e.target.value)} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={(form as any).discountEnd || ''} onChange={e => set('discountEnd', e.target.value)} /></div>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Images</h2>
          <p className="text-xs text-muted-foreground">Upload images or enter URLs. The first image is the primary.</p>
          <MultiImageDropZone
            onImagesUploaded={urls => {
              const existing = form.images.filter(img => img && img !== '/placeholder.svg' && img !== '');
              set('images', [...existing, ...urls]);
            }}
          />
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <div className="flex-1">
                <ImageUploadField
                  value={img}
                  onChange={url => {
                    const imgs = [...form.images];
                    imgs[idx] = url;
                    set('images', imgs);
                  }}
                  label={idx === 0 ? 'Primary Image' : `Image ${idx + 1}`}
                />
              </div>
              {form.images.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="mt-6 text-destructive" onClick={() => set('images', form.images.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => set('images', [...form.images, ''])} className="gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Image
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Tags</h2>
          <Input placeholder="Comma-separated tags" value={form.tags.join(', ')} onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">SEO Settings</h2>
          <p className="text-xs text-muted-foreground">Override auto-generated SEO metadata. Leave blank to use defaults.</p>
          <div className="space-y-2"><Label>Meta Title <span className="text-xs text-muted-foreground">(max 60 chars)</span></Label><Input value={form.seoTitle || ''} onChange={e => set('seoTitle', e.target.value || undefined)} placeholder={form.name} maxLength={60} /></div>
          <div className="space-y-2"><Label>Meta Description <span className="text-xs text-muted-foreground">(max 160 chars)</span></Label><Textarea rows={2} value={form.seoDescription || ''} onChange={e => set('seoDescription', e.target.value || undefined)} placeholder={form.description?.slice(0, 160)} maxLength={160} /></div>
          <ImageUploadField value={form.ogImage || ''} onChange={url => set('ogImage', url || undefined)} label="OG Image" />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
          <Button type="submit" disabled={saving} className="gap-2"><Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Product'}</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
