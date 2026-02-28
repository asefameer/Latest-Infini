import ScrollReveal from '@/components/ScrollReveal';

interface SplitFeatureProps {
  heading: string;
  body: string;
  image: string;
  imagePosition?: 'left' | 'right';
  headingClassName?: string;
  children?: React.ReactNode;
}

const SplitFeature = ({ heading, body, image, imagePosition = 'right', headingClassName, children }: SplitFeatureProps) => (
  <ScrollReveal>
    <section className="py-16 md:py-24 px-6" style={{ background: 'hsl(var(--section-mid))' }}>
      <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'md:direction-rtl' : ''}`}>
        <div className={imagePosition === 'left' ? 'md:direction-ltr order-2 md:order-2' : ''}>
          <h2 className={`${headingClassName || 'font-display'} text-2xl md:text-4xl font-bold tracking-tight mb-6`}>{heading}</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{body}</p>
          {children}
        </div>
        <div className={`relative rounded-xl overflow-hidden aspect-[4/3] bg-muted ${imagePosition === 'left' ? 'md:direction-ltr order-1 md:order-1' : ''}`}>
          <img src={image} alt={heading} className="w-full h-full object-cover" loading="lazy" />
          {/* Subtle glow border */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 0 1px hsl(var(--infinity-cyan) / 0.1)',
            }}
          />
        </div>
      </div>
    </section>
  </ScrollReveal>
);

export default SplitFeature;
