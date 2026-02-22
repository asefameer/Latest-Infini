import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';

const EventCard = ({ event }: { event: Event }) => {
  const fromPrice = Math.min(...event.ticketTiers.map(t => t.price));

  return (
    <div className="group">
      <Link to={`/encounter/e/${event.slug}`} className="block">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-3">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {event.isFeatured && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Featured</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
          </div>
          <h3 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
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
