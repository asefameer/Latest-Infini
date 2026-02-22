import SEOHead from '@/components/SEOHead';
import HeroBlock from '@/components/blocks/HeroBlock';
import ProductCarousel from '@/components/blocks/ProductCarousel';
import EventCarousel from '@/components/blocks/EventCarousel';
import CTABand from '@/components/blocks/CTABand';
import ScrollReveal from '@/components/ScrollReveal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '@/data/brands';
import { getFeaturedProducts } from '@/data/products';
import { getFeaturedEvents } from '@/data/events';
import heroImg from '@/assets/hero-crystal.jpg';

const TrinityHub = () => {
  const featuredProducts = getFeaturedProducts();
  const featuredEvents = getFeaturedEvents();

  return (
    <>
      <SEOHead
        title="The Trinity"
        description="Explore the three pillars of Infinity — NOVA, Live The Moment, and X-Force."
        canonical="/the-trinity"
      />

      <HeroBlock
        title="The Trinity"
        subtitle="Three brands. One universe. Each with its own energy, identity, and purpose — united under the infinite."
        image={heroImg}
      />

      {/* Brand Cards */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/the-trinity/${brand.id}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
                >
                  <img
                    src={brand.heroImage}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">{brand.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{brand.tagline}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal>
        <ProductCarousel title="Featured Products" products={featuredProducts} subtitle="Curated picks from across the universe" />
      </ScrollReveal>

      <ScrollReveal>
        <EventCarousel title="Upcoming Events" events={featuredEvents} subtitle="Experiences you don't want to miss" />
      </ScrollReveal>

      <CTABand
        title="Find Your Brand"
        subtitle="Dive deeper into the stories, products, and experiences that define each brand."
        buttonText="Shop All Editions"
        buttonLink="/editions"
      />
    </>
  );
};

export default TrinityHub;
