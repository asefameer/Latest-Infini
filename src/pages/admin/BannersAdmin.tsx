import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: 'hero' | 'editions' | 'encounter' | 'trinity';
  isActive: boolean;
  order: number;
}

const initialBanners: Banner[] = [
  { id: 'b-1', title: 'Hero Slide 1', imageUrl: '/placeholder.svg', linkUrl: '/', placement: 'hero', isActive: true, order: 0 },
  { id: 'b-2', title: 'Editions Banner', imageUrl: '/placeholder.svg', linkUrl: '/editions', placement: 'editions', isActive: true, order: 1 },
  { id: 'b-3', title: 'Encounter Promo', imageUrl: '/placeholder.svg', linkUrl: '/encounter', placement: 'encounter', isActive: true, order: 2 },
];

const PLACEMENT_LABELS: Record<string, string> = {
  hero: 'Homepage Hero',
  editions: 'Editions Page',
  encounter: 'Encounter Page',
  trinity: 'Trinity Hub',
};

const BannersAdmin = () => {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [editing, setEditing] = useState<string | null>(null);

  const addBanner = () => {
    const newBanner: Banner = {
      id: `b-new-${Date.now()}`,
      title: '',
      imageUrl: '',
      linkUrl: '',
      placement: 'hero',
      isActive: true,
      order: banners.length,
    };
    setBanners(prev => [...prev, newBanner]);
    setEditing(newBanner.id);
  };

  const update = (id: string, field: string, value: any) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const remove = (id: string) => {
    if (!window.confirm('Delete this banner?')) return;
    setBanners(prev => prev.filter(b => b.id !== id));
    toast.success('Banner deleted');
  };

  const saveAll = () => {
    toast.success('Banners saved');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Banners & Media</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addBanner} className="gap-2">
            <Plus className="w-4 h-4" /> Add Banner
          </Button>
          <Button size="sm" onClick={saveAll} className="gap-2">
            <Save className="w-4 h-4" /> Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {banners.map(banner => (
          <div
            key={banner.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors"
          >
            <div
              className="flex items-center gap-4 p-4 cursor-pointer"
              onClick={() => setEditing(editing === banner.id ? null : banner.id)}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 cursor-grab" />
              <div className="w-16 h-10 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{banner.title || 'Untitled Banner'}</p>
                <p className="text-xs text-muted-foreground">{PLACEMENT_LABELS[banner.placement]}</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={banner.isActive}
                  onCheckedChange={v => update(banner.id, 'isActive', v)}
                  onClick={e => e.stopPropagation()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={e => { e.stopPropagation(); remove(banner.id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {editing === banner.id && (
              <div className="border-t border-border p-4 space-y-4 bg-muted/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input value={banner.title} onChange={e => update(banner.id, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Placement</Label>
                    <Select value={banner.placement} onValueChange={v => update(banner.id, 'placement', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Homepage Hero</SelectItem>
                        <SelectItem value="editions">Editions Page</SelectItem>
                        <SelectItem value="encounter">Encounter Page</SelectItem>
                        <SelectItem value="trinity">Trinity Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Image URL</Label>
                  <Input value={banner.imageUrl} onChange={e => update(banner.id, 'imageUrl', e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Link URL</Label>
                  <Input value={banner.linkUrl} onChange={e => update(banner.id, 'linkUrl', e.target.value)} placeholder="/editions" />
                </div>
                {banner.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-border max-h-40">
                    <img src={banner.imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center text-muted-foreground py-12 bg-card border border-border rounded-xl">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p>No banners yet</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={addBanner}>Add your first banner</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannersAdmin;
