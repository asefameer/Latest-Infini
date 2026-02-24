import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import ScrollReveal from '@/components/ScrollReveal';

interface CTABandProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

const CTABand = ({ title, subtitle, buttonText, buttonLink }: CTABandProps) => (
  <ScrollReveal>
    <section
      className="relative py-20 md:py-28 px-6 overflow-hidden"
      style={{ background: 'hsl(var(--section-mid))' }}
    >
      {/* Gradient glow orbs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: 'hsl(var(--infinity-cyan))' }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: 'hsl(var(--infinity-purple))' }}
      />

      <div className="container mx-auto text-center relative z-10">
        <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">{title}</h3>
        {subtitle && <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{subtitle}</p>}
        <MagneticButton strength={0.3}>
          <Link
            to={buttonLink}
            className="group relative inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all"
          >
            {/* Gradient border glow */}
            <div
              className="absolute -inset-[1px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)), hsl(var(--infinity-pink)))',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease infinite',
              }}
            />
            <span className="relative px-8 py-3 rounded-full bg-background/90 group-hover:bg-background/80 transition-colors flex items-center gap-2">
              {buttonText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </MagneticButton>
      </div>
    </section>
  </ScrollReveal>
);

export default CTABand;
