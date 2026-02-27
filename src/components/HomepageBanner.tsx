import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import MagneticButton from '@/components/MagneticButton';
import { useBannersByPlacement } from '@/services/api/hooks';

const HomepageBanner = () => {
  const { data: banners = [], isLoading } = useBannersByPlacement('hero');

  if (isLoading || banners.length === 0) return null;

  const banner = banners[0];

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden py-2 px-6">
        <div className="container mx-auto">
          <Link
            to={banner.link}
            className="group relative block rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[3/1]"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              {banner.imageUrl && banner.imageUrl !== '/placeholder.svg' ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--infinity-purple) / 0.3), hsl(var(--infinity-cyan) / 0.2), hsl(var(--infinity-pink) / 0.2))',
                  }}
                />
              )}
            </div>

            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.4) 50%, transparent 100%)',
              }}
            />

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--infinity-cyan) / 0.06), transparent 60%)',
              }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-14 max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-display text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
              >
                {banner.title}
              </motion.h2>
              {banner.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-sm md:text-base text-muted-foreground mb-6 max-w-md"
                >
                  {banner.subtitle}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MagneticButton strength={0.2}>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </MagneticButton>
              </motion.div>
            </div>

            {/* Subtle border glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                boxShadow: 'inset 0 0 0 1px hsl(var(--infinity-cyan) / 0.15)',
              }}
            />
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default HomepageBanner;
