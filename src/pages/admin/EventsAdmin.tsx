import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { events as initialEvents } from '@/data/events';
import type { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, Ticket } from 'lucide-react';
import { toast } from 'sonner';

const BRAND_LABELS: Record<string, string> = { nova: 'Nova', 'live-the-moment': 'Live the Moment', 'x-force': 'X-Force' };

const EventsAdmin = () => {
  const [items, setItems] = useState<Event[]>(initialEvents);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    items.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    setItems(prev => prev.filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  const totalTickets = (e: Event) => e.ticketTiers.reduce((s, t) => s + t.remaining, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Events & Tickets</h1>
        <Link to="/admin/events/new">
          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Event</Button>
        </Link>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4">
        {filtered.map(ev => (
          <div key={ev.id} className="bg-card border border-border rounded-xl p-5 flex items-start gap-5 hover:border-primary/20 transition-colors">
            <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
              <img src={ev.bannerImage} alt={ev.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{ev.title}</h3>
                  <p className="text-sm text-muted-foreground">{ev.venue}, {ev.city} · {ev.date} at {ev.time}</p>
                </div>
                <Badge variant="outline">{BRAND_LABELS[ev.brand]}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Ticket className="w-3.5 h-3.5" />
                  {ev.ticketTiers.length} tiers · {totalTickets(ev)} remaining
                </div>
                {ev.isFeatured && <Badge className="text-xs bg-secondary/20 text-secondary border-0">Featured</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link to={`/admin/events/${ev.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(ev.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-12">No events found</div>
        )}
      </div>
    </div>
  );
};

export default EventsAdmin;
