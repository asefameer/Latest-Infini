import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  subtitle?: string;
}

const ProductCarousel = ({ title, products, subtitle }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  if (!products.length) return null;

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:bg-muted/50 transition-colors" aria-label="Scroll left">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:bg-muted/50 transition-colors" aria-label="Scroll right">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6 snap-x snap-mandatory">
          {products.map(p => (
            <div key={p.id} className="min-w-[260px] max-w-[260px] snap-start flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
