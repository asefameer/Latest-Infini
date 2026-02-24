import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { events } from '@/data/events';
import type { Event, TicketTier } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyEvent: Omit<Event, 'id'> = {
  slug: '', title: '', brand: 'nova', date: '', time: '', venue: '', city: '',
  bannerImage: '/placeholder.svg', description: '', ticketTiers: [], faq: [],
};

const emptyTier: TicketTier = {
  id: '', name: '', price: 0, currency: 'BDT', description: '', remaining: 0, maxPerOrder: 4,
};

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!eventId && eventId !== 'new';
  const existing = isEdit ? events.find(e => e.id === eventId) : null;

  const [form, setForm] = useState<Omit<Event, 'id'>>(existing ? { ...existing } : { ...emptyEvent });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && existing) setForm({ ...existing });
  }, [eventId]);

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const addTier = () => {
    set('ticketTiers', [...form.ticketTiers, { ...emptyTier, id: `t-new-${Date.now()}` }]);
  };

  const updateTier = (idx: number, field: string, value: any) => {
    const tiers = [...form.ticketTiers];
    tiers[idx] = { ...tiers[idx], [field]: value };
    set('ticketTiers', tiers);
  };

  const removeTier = (idx: number) => {
    set('ticketTiers', form.ticketTiers.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(isEdit ? 'Event updated' : 'Event created');
      navigate('/admin/events');
    }, 500);
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/events')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">
        {isEdit ? `Edit: ${form.title}` : 'New Event'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Event Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => set('slug', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
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
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input value={form.time} onChange={e => set('time', e.target.value)} placeholder="8:00 PM" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input value={form.venue} onChange={e => set('venue', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Banner Image URL</Label>
            <Input value={form.bannerImage} onChange={e => set('bannerImage', e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isFeatured || false} onCheckedChange={v => set('isFeatured', v)} />
            <Label>Featured Event</Label>
          </div>
        </div>

        {/* Ticket Tiers */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Ticket Tiers</h2>
            <Button type="button" variant="outline" size="sm" onClick={addTier} className="gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Tier
            </Button>
          </div>
          {form.ticketTiers.map((tier, idx) => (
            <div key={tier.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Tier {idx + 1}</span>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeTier(idx)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input value={tier.name} onChange={e => updateTier(idx, 'name', e.target.value)} placeholder="VIP" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price (BDT)</Label>
                  <Input type="number" value={tier.price} onChange={e => updateTier(idx, 'price', +e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Input value={tier.description} onChange={e => updateTier(idx, 'description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Remaining</Label>
                  <Input type="number" value={tier.remaining} onChange={e => updateTier(idx, 'remaining', +e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max per Order</Label>
                  <Input type="number" value={tier.maxPerOrder} onChange={e => updateTier(idx, 'maxPerOrder', +e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          {form.ticketTiers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No ticket tiers yet</p>
          )}
        </div>

        {/* Lineup */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Lineup</h2>
          <Input
            placeholder="Comma-separated artists"
            value={(form.lineup || []).join(', ')}
            onChange={e => set('lineup', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/events')}>Cancel</Button>
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Event'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
