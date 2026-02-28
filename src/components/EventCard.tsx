import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';

const EventCard = ({ event, headingClassName, accentColor }: { event: Event; headingClassName?: string; accentColor?: string }) => {
  const fromPrice = Math.min(...event.ticketTiers.map(t => t.price));
  const accent = accentColor || '--infinity-purple';

  return (
    <div className="group">
      <Link to={`/encounter/e/${event.slug}`} className="block">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-3">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(to top, hsl(var(${accent}) / 0.12), transparent 50%)`,
            }}
          />
          {event.isFeatured && (
            <span
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: `hsl(var(${accent}))`,
                color: 'hsl(var(--secondary-foreground))',
              }}
            >
              Featured
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
          </div>
          <h3
            className={`${headingClassName || 'font-display'} font-semibold text-sm mb-1 transition-colors`}
            style={{ ['--card-accent' as string]: `var(${accent})` }}
          >
            <span className="group-hover:text-[hsl(var(--card-accent))] transition-colors">{event.title}</span>
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{event.venue}</p>
            <span className="text-sm font-medium">From ৳{fromPrice.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
