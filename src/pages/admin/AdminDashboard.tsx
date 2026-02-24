import { ShoppingBag, CalendarDays, Image, TrendingUp } from 'lucide-react';
import { products } from '@/data/products';
import { events } from '@/data/events';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Products', value: products.length, icon: ShoppingBag, href: '/admin/products', color: 'from-primary to-primary/60' },
  { label: 'Events', value: events.length, icon: CalendarDays, href: '/admin/events', color: 'from-secondary to-secondary/60' },
  { label: 'Banners', value: 3, icon: Image, href: '/admin/banners', color: 'from-[hsl(var(--infinity-pink))] to-[hsl(var(--infinity-pink))]/60' },
  { label: 'Trending', value: products.filter(p => p.isTrending).length, icon: TrendingUp, href: '/admin/products', color: 'from-primary to-secondary' },
];

const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl font-display font-bold text-foreground mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="font-display font-semibold text-foreground mb-3">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/products/new" className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors">
          + Add Product
        </Link>
        <Link to="/admin/events/new" className="px-4 py-2 bg-secondary/10 text-secondary text-sm rounded-lg hover:bg-secondary/20 transition-colors">
          + Add Event
        </Link>
        <Link to="/admin/banners" className="px-4 py-2 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors">
          Manage Banners
        </Link>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
