interface SplitFeatureProps {
  heading: string;
  body: string;
  image: string;
  imagePosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const SplitFeature = ({ heading, body, image, imagePosition = 'right', children }: SplitFeatureProps) => (
  <section className="py-16 md:py-24 px-6">
    <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'md:direction-rtl' : ''}`}>
      <div className={imagePosition === 'left' ? 'md:direction-ltr order-2 md:order-2' : ''}>
        <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-6">{heading}</h2>
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{body}</p>
        {children}
      </div>
      <div className={`rounded-xl overflow-hidden aspect-[4/3] bg-muted ${imagePosition === 'left' ? 'md:direction-ltr order-1 md:order-1' : ''}`}>
        <img src={image} alt={heading} className="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>
  </section>
);

export default SplitFeature;
