import SEOHead from '@/components/SEOHead';
import EmptyState from '@/components/EmptyState';
import { Heart } from 'lucide-react';

const Wishlist = () => (
  <>
    <SEOHead title="Wishlist" description="View your saved items." canonical="/account/wishlist" />
    <div className="container mx-auto px-6 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight mb-10">Wishlist</h1>
      <EmptyState
        icon={<Heart className="w-7 h-7" />}
        title="Your wishlist is empty"
        description="Heart products you love to save them here for later."
        actionLabel="Browse Editions"
        actionLink="/editions"
      />
    </div>
  </>
);

export default Wishlist;
