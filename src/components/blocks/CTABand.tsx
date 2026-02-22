import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTABandProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

const CTABand = ({ title, subtitle, buttonText, buttonLink }: CTABandProps) => (
  <section
    className="py-16 md:py-20 px-6"
    style={{ background: 'linear-gradient(135deg, hsl(var(--infinity-cyan) / 0.1), hsl(var(--infinity-purple) / 0.1))' }}
  >
    <div className="container mx-auto text-center">
      <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">{title}</h3>
      {subtitle && <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{subtitle}</p>}
      <Link
        to={buttonLink}
        className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

export default CTABand;
