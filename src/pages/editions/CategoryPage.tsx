import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import SkeletonGrid from '@/components/SkeletonGrid';
import { categories } from '@/data/categories';
import { getProductsByCategory, products as allProducts } from '@/data/products';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categories.find(c => c.slug === categorySlug);
  const [sort, setSort] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading] = useState(false);

  const rawProducts = categorySlug ? getProductsByCategory(categorySlug) : allProducts;

  const filtered = useMemo(() => {
    let result = [...rawProducts];
    if (inStockOnly) result = result.filter(p => p.inStock);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [rawProducts, sort, priceRange, inStockOnly]);

  return (
    <>
      <SEOHead
        title={category?.name || 'All Products'}
        description={category?.description || 'Browse the complete Infinity collection.'}
        canonical={`/editions/c/${categorySlug}`}
      />

      <div className="container mx-auto px-6">
        <Breadcrumbs items={[{ label: 'Editions', href: '/editions' }, { label: category?.name || 'All' }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{category?.name || 'All Products'}</h1>
            {category?.description && <p className="text-muted-foreground text-sm mt-1">{category.description}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="appearance-none rounded-full border border-border/40 bg-transparent px-5 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className={`w-56 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Price Range</h4>
              <div className="flex items-center gap-2 text-sm">
                <span>৳{priceRange[0]}</span>
                <input
                  type="range" min={0} max={15000} step={500}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="flex-1 accent-primary"
                />
                <span>৳{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-primary" />
                In stock only
              </label>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <SkeletonGrid count={8} type="product" />
            ) : filtered.length === 0 ? (
              <EmptyState title="No products found" description="Try adjusting your filters or browse another category." actionLabel="View All" actionLink="/editions" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-16" />
      </div>
    </>
  );
};

export default CategoryPage;
