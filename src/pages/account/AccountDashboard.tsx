import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { User, Package, MapPin, Heart, LogIn } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

const AccountDashboard = () => {
  const isLoggedIn = false; // placeholder

  if (!isLoggedIn) {
    return (
      <>
        <SEOHead title="Account" description="Sign in to your Infinity account." canonical="/account" />
        <div className="container mx-auto px-6 py-20 text-center max-w-md">
          {/* Glow behind icon */}
          <div className="relative inline-block mb-6">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30"
              style={{ background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)))' }}
            />
            <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <LogIn className="w-7 h-7 text-muted-foreground" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-3">Sign In</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to access your orders, addresses, and wishlist.</p>
          <MagneticButton strength={0.25}>
            <button
              className="group relative w-full rounded-full py-3 text-sm font-medium transition-all"
            >
              <div
                className="absolute -inset-[1px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)), hsl(var(--infinity-pink)))',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 3s ease infinite',
                }}
              />
              <span className="relative block w-full rounded-full py-3 bg-background/90 group-hover:bg-background/80 transition-colors">
                Sign In with Email
              </span>
            </button>
          </MagneticButton>
          <p className="text-xs text-muted-foreground mt-4">Authentication coming soon. This is a placeholder.</p>
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
