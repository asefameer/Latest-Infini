import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import {
  useAllSiteContent,
  useUpdateSiteContent,
  useUpsertSiteContent,
  useDeleteSiteContent,
  useAllNavigationItems,
  useUpsertNavigationItem,
  useDeleteNavigationItem,
  useAllHomepageBanners,
  useUpsertBanner,
  useDeleteBanner,
  type SiteContentRow,
  type NavigationItemRow,
  type HomepageBannerRow,
} from '@/hooks/use-cms';

// ── Site Content Tab ──
const SiteContentEditor = () => {
  const { data: rows = [], isLoading } = useAllSiteContent();
  const updateMut = useUpdateSiteContent();
  const upsertMut = useUpsertSiteContent();
  const deleteMut = useDeleteSiteContent();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [newRow, setNewRow] = useState({ section: '', content_key: '', content_value: '', content_type: 'text', sort_order: 0 });

  // Group by section
  const sections = rows.reduce<Record<string, SiteContentRow[]>>((acc, r) => {
    (acc[r.section] ??= []).push(r);
    return acc;
  }, {});

  const handleSave = (row: SiteContentRow) => {
    const val = edits[row.id] ?? row.content_value;
    updateMut.mutate({ id: row.id, content_value: val }, {
      onSuccess: () => { toast.success(`Updated ${row.section}.${row.content_key}`); setEdits(prev => { const n = { ...prev }; delete n[row.id]; return n; }); },
      onError: (e) => toast.error(e.message),
    });
  };

  const handleAdd = () => {
    if (!newRow.section || !newRow.content_key) return toast.error('Section and Key are required');
    upsertMut.mutate(newRow, {
      onSuccess: () => { toast.success('Content added'); setNewRow({ section: '', content_key: '', content_value: '', content_type: 'text', sort_order: 0 }); },
      onError: (e) => toast.error(e.message),
    });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      {/* Add new row */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Add Content</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Input placeholder="Section" value={newRow.section} onChange={e => setNewRow(r => ({ ...r, section: e.target.value }))} />
          <Input placeholder="Key" value={newRow.content_key} onChange={e => setNewRow(r => ({ ...r, content_key: e.target.value }))} />
          <Input placeholder="Value" value={newRow.content_value} onChange={e => setNewRow(r => ({ ...r, content_value: e.target.value }))} />
          <Input placeholder="Type" value={newRow.content_type} onChange={e => setNewRow(r => ({ ...r, content_type: e.target.value }))} />
          <Button onClick={handleAdd} size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </CardContent>
      </Card>

      {/* Sections */}
      {Object.entries(sections).sort().map(([section, items]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <Badge variant="secondary">{section}</Badge>
              <span className="text-muted-foreground text-xs">({items.length} items)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 mt-2.5 text-muted-foreground/40 shrink-0" />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">{item.content_key} <span className="text-muted-foreground/50">({item.content_type})</span></Label>
                  {(edits[item.id] ?? item.content_value).length > 80 ? (
                    <Textarea
                      value={edits[item.id] ?? item.content_value}
                      onChange={e => setEdits(prev => ({ ...prev, [item.id]: e.target.value }))}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <Input
                      value={edits[item.id] ?? item.content_value}
                      onChange={e => setEdits(prev => ({ ...prev, [item.id]: e.target.value }))}
                    />
                  )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleSave(item)} disabled={updateMut.isPending}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMut.mutate(item.id, { onSuccess: () => toast.success('Deleted') })}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ── Navigation Tab ──
const NavigationEditor = () => {
  const { data: items = [], isLoading } = useAllNavigationItems();
  const upsertMut = useUpsertNavigationItem();
  const deleteMut = useDeleteNavigationItem();
  const [newItem, setNewItem] = useState({ location: 'header', label: '', href: '', sort_order: 0, is_visible: true });

  const grouped = items.reduce<Record<string, NavigationItemRow[]>>((acc, r) => {
    (acc[r.location] ??= []).push(r);
    return acc;
  }, {});

  const handleAdd = () => {
    if (!newItem.label || !newItem.href) return toast.error('Label and href are required');
    upsertMut.mutate(newItem as any, {
      onSuccess: () => { toast.success('Nav item added'); setNewItem({ location: 'header', label: '', href: '', sort_order: 0, is_visible: true }); },
      onError: (e) => toast.error(e.message),
    });
  };

  const handleUpdate = (item: NavigationItemRow, updates: Partial<NavigationItemRow>) => {
    upsertMut.mutate({ ...item, ...updates }, {
      onSuccess: () => toast.success('Updated'),
      onError: (e) => toast.error(e.message),
    });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm">Add Navigation Item</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select className="border rounded-md px-3 py-2 text-sm bg-background" value={newItem.location} onChange={e => setNewItem(r => ({ ...r, location: e.target.value }))}>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
            <option value="footer_social">Footer Social</option>
          </select>
          <Input placeholder="Label" value={newItem.label} onChange={e => setNewItem(r => ({ ...r, label: e.target.value }))} />
          <Input placeholder="URL / href" value={newItem.href} onChange={e => setNewItem(r => ({ ...r, href: e.target.value }))} />
          <Input type="number" placeholder="Order" value={newItem.sort_order} onChange={e => setNewItem(r => ({ ...r, sort_order: +e.target.value }))} />
          <Button onClick={handleAdd} size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </CardContent>
      </Card>

      {Object.entries(grouped).sort().map(([loc, navItems]) => (
        <Card key={loc}>
          <CardHeader><CardTitle className="text-sm"><Badge variant="secondary">{loc}</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {navItems.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                <Input className="max-w-[180px]" defaultValue={item.label} onBlur={e => e.target.value !== item.label && handleUpdate(item, { label: e.target.value })} />
                <Input className="flex-1" defaultValue={item.href} onBlur={e => e.target.value !== item.href && handleUpdate(item, { href: e.target.value })} />
                <div className="flex items-center gap-1.5">
                  <Switch checked={item.is_visible} onCheckedChange={v => handleUpdate(item, { is_visible: v })} />
                  <span className="text-xs text-muted-foreground">Visible</span>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMut.mutate(item.id, { onSuccess: () => toast.success('Deleted') })}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ── Banners Tab ──
const BannersEditor = () => {
  const { data: banners = [], isLoading } = useAllHomepageBanners();
  const upsertMut = useUpsertBanner();
  const deleteMut = useDeleteBanner();
  const [newBanner, setNewBanner] = useState({ name: '', tagline: '', image_url: '', link: '/', accent_color: '180 100% 50%', sort_order: 0, is_active: true });

  const handleAdd = () => {
    if (!newBanner.name || !newBanner.image_url) return toast.error('Name and image URL are required');
    upsertMut.mutate(newBanner as any, {
      onSuccess: () => { toast.success('Banner added'); setNewBanner({ name: '', tagline: '', image_url: '', link: '/', accent_color: '180 100% 50%', sort_order: 0, is_active: true }); },
      onError: (e) => toast.error(e.message),
    });
  };

  const handleUpdate = (banner: HomepageBannerRow, updates: Partial<HomepageBannerRow>) => {
    upsertMut.mutate({ ...banner, ...updates }, {
      onSuccess: () => toast.success('Updated'),
      onError: (e) => toast.error(e.message),
    });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm">Add Banner</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Input placeholder="Name" value={newBanner.name} onChange={e => setNewBanner(r => ({ ...r, name: e.target.value }))} />
          <Input placeholder="Tagline" value={newBanner.tagline} onChange={e => setNewBanner(r => ({ ...r, tagline: e.target.value }))} />
          <Input placeholder="Image URL" value={newBanner.image_url} onChange={e => setNewBanner(r => ({ ...r, image_url: e.target.value }))} />
          <Input placeholder="Link" value={newBanner.link} onChange={e => setNewBanner(r => ({ ...r, link: e.target.value }))} />
          <Input placeholder="Accent HSL (e.g. 180 100% 50%)" value={newBanner.accent_color} onChange={e => setNewBanner(r => ({ ...r, accent_color: e.target.value }))} />
          <Input type="number" placeholder="Order" value={newBanner.sort_order} onChange={e => setNewBanner(r => ({ ...r, sort_order: +e.target.value }))} />
          <div className="flex items-center gap-2">
            <Switch checked={newBanner.is_active} onCheckedChange={v => setNewBanner(r => ({ ...r, is_active: v }))} />
            <span className="text-sm">Active</span>
          </div>
          <Button onClick={handleAdd} size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </CardContent>
      </Card>

      {banners.map(banner => (
        <Card key={banner.id}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              {banner.image_url && (
                <img src={banner.image_url} alt={banner.name} className="w-24 h-14 object-cover rounded" />
              )}
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input defaultValue={banner.name} onBlur={e => e.target.value !== banner.name && handleUpdate(banner, { name: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tagline</Label>
                  <Input defaultValue={banner.tagline} onBlur={e => e.target.value !== banner.tagline && handleUpdate(banner, { tagline: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Image URL</Label>
                  <Input defaultValue={banner.image_url} onBlur={e => e.target.value !== banner.image_url && handleUpdate(banner, { image_url: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Link</Label>
                  <Input defaultValue={banner.link} onBlur={e => e.target.value !== banner.link && handleUpdate(banner, { link: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Accent Color (HSL)</Label>
                  <Input defaultValue={banner.accent_color} onBlur={e => e.target.value !== banner.accent_color && handleUpdate(banner, { accent_color: e.target.value })} />
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={banner.is_active} onCheckedChange={v => handleUpdate(banner, { is_active: v })} />
                    <span className="text-sm">Active</span>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMut.mutate(banner.id, { onSuccess: () => toast.success('Deleted') })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ── Main Page ──
const ContentAdmin = () => {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Content Management</h1>
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Site Content</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="banners">Homepage Banners</TabsTrigger>
        </TabsList>
        <TabsContent value="content"><SiteContentEditor /></TabsContent>
        <TabsContent value="navigation"><NavigationEditor /></TabsContent>
        <TabsContent value="banners"><BannersEditor /></TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentAdmin;
