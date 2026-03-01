import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const AccountDashboard = () => {
  const { user, logout } = useCustomerAuth();

  return (
    <>
      <SEOHead title="My Account" description="Manage your Infinity account." canonical="/account" />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">My Account</h1>
            {user && <p className="text-sm text-muted-foreground mt-1">Signed in as {user.email}</p>}
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: User, label: 'Profile', desc: 'Manage your details', href: '/account' },
            { icon: Package, label: 'Orders', desc: '0 orders', href: '/account/orders' },
            { icon: MapPin, label: 'Addresses', desc: '0 saved', href: '/account/addresses' },
            { icon: Heart, label: 'Wishlist', desc: '0 items', href: '/account/wishlist' },
          ].map(card => (
            <Link
              key={card.label}
              to={card.href}
              className="group p-6 rounded-xl border border-border/30 bg-card/50 hover:border-primary/30 transition-all duration-300"
              style={{ boxShadow: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 30px -10px hsl(var(--infinity-cyan) / 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <card.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
              <h3 className="font-display font-semibold mb-1">{card.label}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AccountDashboard;
