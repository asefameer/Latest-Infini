import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductCarousel from '@/components/blocks/ProductCarousel';
import EmptyState from '@/components/EmptyState';
import ScrollReveal from '@/components/ScrollReveal';
import { useCart } from '@/components/CartContext';
import { getProductBySlug, products } from '@/data/products';
import { Heart, Minus, Plus, ChevronDown, ChevronUp, Truck, RefreshCw } from 'lucide-react';

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const product = getProductBySlug(productSlug || '');
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [added, setAdded] = useState(false);

  if (!product) {
    return <EmptyState title="Product Not Found" description="The product you're looking for doesn't exist." actionLabel="Browse Editions" actionLink="/editions" />;
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', product, quantity, selectedVariants });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SEOHead
        title={product.name}
        description={product.description}
        canonical={`/editions/p/${product.slug}`}
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-6">
        <Breadcrumbs items={[
          { label: 'Editions', href: '/editions' },
          { label: product.category.replace('-', ' '), href: `/editions/c/${product.category}` },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{product.brand.replace('-', ' ')}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold">৳{product.price.toLocaleString()}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">৳{product.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants.map(v => (
              <div key={v.id}>
                <h4 className="font-display font-semibold text-sm mb-3">{v.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {v.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                        selectedVariants[v.name] === opt
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border/40 text-muted-foreground hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Quantity</h4>
              <div className="flex items-center gap-3 border border-border/40 rounded-full w-fit">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted/50 rounded-l-full transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted/50 rounded-r-full transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {added ? '✓ Added!' : 'Add to Cart'}
              </button>
              <button className="w-12 h-12 rounded-full border border-border/40 flex items-center justify-center hover:bg-muted/50 transition-colors" aria-label="Add to wishlist">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Accordion */}
            {[
              { id: 'description', title: 'Description', content: product.description },
              { id: 'specs', title: 'Specifications', content: product.specs.map(s => `${s.label}: ${s.value}`).join('\n') },
            ].map(section => (
              <div key={section.id} className="border-t border-border/30">
                <button
                  onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between py-4 text-sm font-medium"
                >
                  {section.title}
                  {openAccordion === section.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === section.id && (
                  <p className="text-sm text-muted-foreground pb-4 whitespace-pre-line">{section.content}</p>
                )}
              </div>
            ))}

            {/* Delivery/Returns */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-muted/30 border border-border/20">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Free delivery across Bangladesh on orders over ৳5,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Easy returns within 14 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ScrollReveal>
          <ProductCarousel title="You May Also Like" products={related} />
        </ScrollReveal>
      )}
    </>
  );
};

export default ProductDetail;
