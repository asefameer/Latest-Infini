import { useState } from 'react';
import { Search, Filter, Users, Eye, Mail, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockCustomers, Customer } from '@/data/crm-mock';
import { cn } from '@/lib/utils';

const segmentColors: Record<string, string> = {
  vip: 'bg-primary/15 text-primary border-primary/30',
  regular: 'bg-secondary/15 text-secondary border-secondary/30',
  new: 'bg-green-500/15 text-green-400 border-green-500/30',
  inactive: 'bg-muted text-muted-foreground border-border',
};

const CRMCustomers = () => {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = mockCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesSegment = segmentFilter === 'all' || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">{mockCustomers.length} customers total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-2">
          {['all', 'vip', 'regular', 'new', 'inactive'].map(seg => (
            <Button key={seg} size="sm" variant={segmentFilter === seg ? 'default' : 'outline'} onClick={() => setSegmentFilter(seg)} className="capitalize text-xs">
              {seg}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Segment</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Spent</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Last Active</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn('capitalize text-xs', segmentColors[c.segment])}>{c.segment}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-foreground">€{c.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-foreground">{c.orderCount}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{c.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(c)}><Eye className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span><p className="text-foreground">{selected.email}</p></div>
                <div><span className="text-muted-foreground">Phone:</span><p className="text-foreground">{selected.phone}</p></div>
                <div><span className="text-muted-foreground">Segment:</span><p><Badge variant="outline" className={cn('capitalize text-xs', segmentColors[selected.segment])}>{selected.segment}</Badge></p></div>
                <div><span className="text-muted-foreground">Joined:</span><p className="text-foreground">{selected.joinedAt}</p></div>
                <div><span className="text-muted-foreground">Total Spent:</span><p className="text-foreground font-semibold">€{selected.totalSpent.toLocaleString()}</p></div>
                <div><span className="text-muted-foreground">Orders:</span><p className="text-foreground">{selected.orderCount}</p></div>
              </div>
              {selected.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
              )}
              {selected.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3">{selected.notes}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="gap-1"><Mail className="w-3 h-3" /> Send Email</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMCustomers;
