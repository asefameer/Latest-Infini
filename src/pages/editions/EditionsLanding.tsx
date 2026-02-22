import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import HeroBlock from '@/components/blocks/HeroBlock';
import ProductCarousel from '@/components/blocks/ProductCarousel';
import CTABand from '@/components/blocks/CTABand';
import ScrollReveal from '@/components/ScrollReveal';
import { categories } from '@/data/categories';
import { getTrendingProducts, getNewProducts } from '@/data/products';

const EditionsLanding = () => {
  const trending = getTrendingProducts();
  const newDrops = getNewProducts();

  return (
    <>
      <SEOHead
        title="Editions"
        description="Shop the complete Infinity collection. Premium streetwear, accessories, and footwear crafted in Bangladesh."
        canonical="/editions"
      />

      <HeroBlock
        title="Editions"
        subtitle="Premium pieces crafted at the intersection of art and utility. Every edition tells a story."
        height="medium"
      />

      {/* Category Tiles */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/editions/c/${cat.slug}`}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-muted"
                >
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal>
        <ProductCarousel title="Trending Now" products={trending} subtitle="What the community is loving" />
      </ScrollReveal>

      <ScrollReveal>
        <ProductCarousel title="New Drops" products={newDrops} subtitle="Fresh from the studio" />
      </ScrollReveal>

      <CTABand
        title="See Everything"
        subtitle="Browse the full collection across all categories."
        buttonText="Browse All"
        buttonLink="/editions/c/apparel"
      />
    </>
  );
};

export default EditionsLanding;
