import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (id: string) => void;
  headingClassName?: string;
}

const ProductCard = ({ product, onAddToWishlist, headingClassName }: ProductCardProps) => (
  <div className="group">
    <Link to={`/editions/p/${product.slug}`} className="block">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, hsl(var(--infinity-cyan) / 0.08), transparent 50%)',
          }}
        />
        {product.isNew && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            New
          </span>
        )}
        {product.compareAtPrice && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">Sale</span>
        )}
        {onAddToWishlist && (
          <button
            onClick={(e) => { e.preventDefault(); onAddToWishlist(product.id); }}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.brand.replace('-', ' ')}</p>
        <h3 className={`${headingClassName || 'font-display'} font-semibold text-sm mb-1 group-hover:text-primary transition-colors`}>{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">৳{product.price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">৳{product.compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  </div>
);

export default ProductCard;
