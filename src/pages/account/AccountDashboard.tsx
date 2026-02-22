import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { User, Package, MapPin, Heart, LogIn } from 'lucide-react';

const AccountDashboard = () => {
  const isLoggedIn = false; // placeholder

  if (!isLoggedIn) {
    return (
      <>
        <SEOHead title="Account" description="Sign in to your Infinity account." canonical="/account" />
        <div className="container mx-auto px-6 py-20 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-3">Sign In</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to access your orders, addresses, and wishlist.</p>
          <button className="w-full rounded-full py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity mb-4">
            Sign In with Email
          </button>
          <p className="text-xs text-muted-foreground">Authentication coming soon. This is a placeholder.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="My Account" description="Manage your Infinity account." canonical="/account" />
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-10">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: User, label: 'Profile', desc: 'Manage your details', href: '/account' },
            { icon: Package, label: 'Orders', desc: '0 orders', href: '/account/orders' },
            { icon: MapPin, label: 'Addresses', desc: '0 saved', href: '/account/addresses' },
            { icon: Heart, label: 'Wishlist', desc: '0 items', href: '/account/wishlist' },
          ].map(card => (
            <Link key={card.label} to={card.href} className="p-6 rounded-xl border border-border/30 bg-card/50 hover:bg-muted/30 transition-colors">
              <card.icon className="w-6 h-6 text-muted-foreground mb-3" />
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
