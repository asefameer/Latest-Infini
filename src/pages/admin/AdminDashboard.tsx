import { ShoppingBag, CalendarDays, Image, TrendingUp, UserPlus, MessageCircle, CreditCard, ArrowRight, Activity, Eye, Users, UserCheck } from 'lucide-react';
import { products } from '@/data/products';
import { events } from '@/data/events';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Products', value: products.length, icon: ShoppingBag, href: '/admin/products', color: 'from-primary to-primary/60' },
  { label: 'Events', value: events.length, icon: CalendarDays, href: '/admin/events', color: 'from-secondary to-secondary/60' },
  { label: 'Banners', value: 3, icon: Image, href: '/admin/banners', color: 'from-[hsl(var(--infinity-pink))] to-[hsl(var(--infinity-pink))]/60' },
  { label: 'Trending', value: products.filter(p => p.isTrending).length, icon: TrendingUp, href: '/admin/products', color: 'from-primary to-secondary' },
];

const trafficMetrics = [
  { label: 'DAU', description: 'Daily Active Users', value: '1,247', delta: '+8.3%', icon: Activity, color: 'bg-primary/10 text-primary' },
  { label: 'MAU', description: 'Monthly Active Users', value: '18,420', delta: '+12.1%', icon: Users, color: 'bg-secondary/10 text-secondary' },
  { label: 'Page Views', description: 'Today', value: '9,832', delta: '+5.6%', icon: Eye, color: 'bg-accent text-accent-foreground' },
  { label: 'Unique Visitors', description: 'Today', value: '3,614', delta: '+3.9%', icon: UserCheck, color: 'bg-primary/10 text-primary' },
];

type ActivityType = 'order' | 'signup' | 'chat';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

const activityConfig: Record<ActivityType, { icon: typeof ShoppingBag; color: string }> = {
  order: { icon: CreditCard, color: 'bg-primary/10 text-primary' },
  signup: { icon: UserPlus, color: 'bg-secondary/10 text-secondary' },
  chat: { icon: MessageCircle, color: 'bg-accent text-accent-foreground' },
};

const seedActivities: Activity[] = [
  { id: '1', type: 'order', title: 'New order #ORD-2026-0091', description: 'Sofia Reyes — €245.00 (2 items)', time: '2 min ago' },
  { id: '2', type: 'signup', title: 'New customer signed up', description: 'lucas.martin@email.com', time: '5 min ago' },
  { id: '3', type: 'chat', title: 'Chatbot escalated', description: 'Léa Dupont — ticket not showing in account', time: '8 min ago' },
  { id: '4', type: 'order', title: 'New order #ORD-2026-0090', description: 'Aya Nakamura — €189.00 (1 item)', time: '12 min ago' },
  { id: '5', type: 'signup', title: 'New customer signed up', description: 'kenji.t@email.com', time: '18 min ago' },
  { id: '6', type: 'chat', title: 'Chatbot resolved', description: 'Marcus Chen — size exchange processed', time: '22 min ago' },
  { id: '7', type: 'order', title: 'New order #ORD-2026-0089', description: 'James Okafor — €320.00 (3 items)', time: '30 min ago' },
  { id: '8', type: 'signup', title: 'New customer signed up', description: 'maria.garcia@email.com', time: '45 min ago' },
];

const liveEvents: Omit<Activity, 'id' | 'isNew'>[] = [
  { type: 'order', title: 'New order #ORD-2026-0092', description: 'Yuki Tanaka — €175.00 (1 item)', time: 'Just now' },
  { type: 'signup', title: 'New customer signed up', description: 'alex.novak@email.com', time: 'Just now' },
  { type: 'chat', title: 'Chatbot conversation started', description: 'Anonymous visitor — shipping query', time: 'Just now' },
  { type: 'order', title: 'New order #ORD-2026-0093', description: 'Amara Obi — €410.00 (2 items)', time: 'Just now' },
];

const AdminDashboard = () => {
  const [activities, setActivities] = useState<Activity[]>(seedActivities);
  const [liveIdx, setLiveIdx] = useState(0);

  // simulate real-time activity every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIdx(prev => {
        const idx = prev % liveEvents.length;
        const event = liveEvents[idx];
        const newActivity: Activity = {
          ...event,
          id: `live-${Date.now()}`,
          isNew: true,
        };
        setActivities(curr => [newActivity, ...curr].slice(0, 12));
        return prev + 1;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Link
            key={s.label}
            to={s.href}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Traffic & Engagement Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {trafficMetrics.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', m.color)}>
                <m.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-primary">{m.delta}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Activity Feed</h2>
            <span className="flex items-center gap-1.5 text-xs text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {activities.map(a => {
              const config = activityConfig[a.type];
              const Icon = config.icon;
              return (
                <div
                  key={a.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-all duration-500',
                    a.isNew ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/30'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <h2 className="font-display font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2 flex-1">
            <Link to="/admin/products/new" className="flex items-center justify-between px-4 py-3 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors group">
              <span>+ Add Product</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/admin/events/new" className="flex items-center justify-between px-4 py-3 bg-secondary/10 text-secondary text-sm rounded-lg hover:bg-secondary/20 transition-colors group">
              <span>+ Add Event</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/admin/banners" className="flex items-center justify-between px-4 py-3 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors group">
              <span>Manage Banners</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/admin/crm/customers" className="flex items-center justify-between px-4 py-3 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors group">
              <span>View Customers</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/admin/crm/analytics" className="flex items-center justify-between px-4 py-3 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors group">
              <span>Analytics</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
