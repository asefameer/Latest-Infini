import SEOHead from '@/components/SEOHead';
import EmptyState from '@/components/EmptyState';
import { MapPin } from 'lucide-react';

const Addresses = () => (
  <>
    <SEOHead title="Addresses" description="Manage your saved addresses." canonical="/account/addresses" />
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight">Saved Addresses</h1>
        <button className="rounded-full px-6 py-2.5 text-sm font-medium border border-border/40 hover:bg-muted/50 transition-colors">
          + Add Address
        </button>
      </div>
      <EmptyState
        icon={<MapPin className="w-7 h-7" />}
        title="No addresses saved"
        description="Add an address to speed up your checkout experience."
      />
    </div>
  </>
);

export default Addresses;
