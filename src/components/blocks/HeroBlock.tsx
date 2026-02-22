interface HeroBlockProps {
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
  overlay?: boolean;
  height?: 'full' | 'large' | 'medium';
  children?: React.ReactNode;
}

const heightMap = { full: 'min-h-screen', large: 'min-h-[70vh]', medium: 'min-h-[50vh]' };

const HeroBlock = ({ title, subtitle, image, video, overlay = true, height = 'large', children }: HeroBlockProps) => (
  <section className={`relative ${heightMap[height]} flex items-center justify-center overflow-hidden`}>
    {video ? (
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={video} type="video/mp4" />
      </video>
    ) : image ? (
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
    ) : (
      <div className="absolute inset-0 bg-muted" />
    )}
    {overlay && <div className="absolute inset-0 bg-background/60" />}
    <div className="relative z-10 container mx-auto px-6 text-center">
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">{title}</h1>
      {subtitle && <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default HeroBlock;
