import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import HeroBlock from '@/components/blocks/HeroBlock';
import SplitFeature from '@/components/blocks/SplitFeature';
import EditorialText from '@/components/blocks/EditorialText';
import ProductCarousel from '@/components/blocks/ProductCarousel';
import EventCarousel from '@/components/blocks/EventCarousel';
import NewsletterModule from '@/components/blocks/NewsletterModule';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight } from 'lucide-react';
import { brands } from '@/data/brands';
import { getProductsByBrand } from '@/data/products';
import { getEventsByBrand } from '@/data/events';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';

/** Maps brand id → Tailwind font classes for headings, subtitles & body */
const brandFontMap: Record<string, { heading: string; subtitle: string; body: string }> = {
  nova:              { heading: 'font-nova font-semibold',   subtitle: 'font-nova font-normal',    body: 'font-nova' },
  'live-the-moment': { heading: 'font-ltm',                 subtitle: 'font-ltm-script',           body: 'font-ltm-body' },
  'x-force':         { heading: 'font-xforce',              subtitle: 'font-xforce',               body: 'font-xforce' },
};

const BrandPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brand = brands.find(b => b.id === brandSlug);

  if (!brand) {
    return <EmptyState title="Brand Not Found" description="The brand you're looking for doesn't exist." actionLabel="Back to Trinity" actionLink="/the-trinity" />;
  }

  const brandProducts = getProductsByBrand(brand.id);
  const brandEvents = getEventsByBrand(brand.id);
  const relatedBrands = brands.filter(b => b.id !== brand.id);
  const fonts = brandFontMap[brand.id] ?? { heading: 'font-display', subtitle: 'font-body', body: 'font-body' };

  return (
    <div className={fonts.body}>
      <SEOHead
        title={brand.name}
        description={brand.description}
        canonical={`/the-trinity/${brand.id}`}
      />

      <HeroBlock title={brand.name} subtitle={brand.tagline} image={brand.heroImage} titleClassName={fonts.heading} subtitleClassName={fonts.subtitle} />

      <ScrollReveal>
        <EditorialText heading="The Story" body={brand.description} size="large" headingClassName={fonts.heading} />
      </ScrollReveal>

      {brand.story.map((block, i) => (
        <ScrollReveal key={i}>
          {block.image ? (
            <SplitFeature
              heading={block.heading}
              body={block.body}
              image={block.image}
              imagePosition={i % 2 === 0 ? 'right' : 'left'}
              headingClassName={fonts.heading}
            />
          ) : (
            <EditorialText heading={block.heading} body={block.body} headingClassName={fonts.heading} />
          )}
        </ScrollReveal>
      ))}

      {brandProducts.length > 0 && (
        <ScrollReveal>
          <ProductCarousel title={`${brand.name} Editions`} products={brandProducts} headingClassName={fonts.heading} />
        </ScrollReveal>
      )}

      {brandEvents.length > 0 && (
        <ScrollReveal>
          <EventCarousel title={`${brand.name} Events`} events={brandEvents} headingClassName={fonts.heading} />
        </ScrollReveal>
      )}

      <ScrollReveal>
        <NewsletterModule />
      </ScrollReveal>

      {/* Related Brands */}
      <section className="py-16 px-6 border-t border-border/30">
        <div className="container mx-auto">
          <h3 className="font-display text-xl font-semibold mb-8 text-center">Explore Other Brands</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {relatedBrands.map(rb => (
              <Link
                key={rb.id}
                to={`/the-trinity/${rb.id}`}
                className="inline-flex items-center gap-2 btn-infinity rounded-full px-6 py-3 text-sm font-medium bg-background/80 text-foreground transition-all"
              >
                {rb.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandPage;
