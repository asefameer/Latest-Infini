import { motion } from 'framer-motion';

interface HeroBlockProps {
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
  overlay?: boolean;
  height?: 'full' | 'large' | 'medium';
  titleClassName?: string;
  subtitleClassName?: string;
  children?: React.ReactNode;
}

const heightMap = { full: 'min-h-screen', large: 'min-h-[70vh]', medium: 'min-h-[50vh]' };

const HeroBlock = ({ title, subtitle, image, video, overlay = true, height = 'large', titleClassName, subtitleClassName, children }: HeroBlockProps) => (
  <section className={`relative ${heightMap[height]} flex items-center justify-center overflow-hidden`}>
    {video ? (
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={video} type="video/mp4" />
      </video>
    ) : image ? (
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
    ) : (
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--section-dark)), hsl(var(--section-mid)), hsl(var(--infinity-purple) / 0.15))',
        }}
      />
    )}
    {overlay && (
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background) / 0.3), hsl(var(--background) / 0.7) 70%, hsl(var(--background)))',
        }}
      />
    )}
    <div className="relative z-10 container mx-auto px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`${titleClassName || 'font-display'} text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6`}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`${subtitleClassName || ''} text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto`}
        >
          {subtitle}
        </motion.p>
      )}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </div>
    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default HeroBlock;
