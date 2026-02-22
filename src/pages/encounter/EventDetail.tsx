import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import EmptyState from '@/components/EmptyState';
import { getEventBySlug } from '@/data/events';
import { Calendar, Clock, MapPin, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const EventDetail = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const event = getEventBySlug(eventSlug || '');
  const [tierQty, setTierQty] = useState<Record<string, number>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!event) {
    return <EmptyState title="Event Not Found" description="This event doesn't exist." actionLabel="Browse Events" actionLink="/encounter" />;
  }

  const totalTickets = Object.values(tierQty).reduce((s, q) => s + q, 0);
  const totalPrice = event.ticketTiers.reduce((s, t) => s + (tierQty[t.id] || 0) * t.price, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: { '@type': 'Place', name: event.venue, address: { '@type': 'PostalAddress', addressLocality: event.city } },
    offers: event.ticketTiers.map(t => ({ '@type': 'Offer', name: t.name, price: t.price, priceCurrency: t.currency, availability: t.remaining > 0 ? 'InStock' : 'SoldOut' })),
  };

  return (
    <>
      <SEOHead title={event.title} description={event.description} canonical={`/encounter/e/${event.slug}`} jsonLd={jsonLd} />

      {/* Banner */}
      <div className="relative aspect-[21/9] md:aspect-[3/1] bg-muted">
        <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        <Breadcrumbs items={[{ label: 'Encounter', href: '/encounter' }, { label: event.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{event.time}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{event.description}</p>

            {/* Map placeholder */}
            <div className="aspect-[16/9] rounded-xl bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Map coming soon</span>
            </div>

            {/* Lineup */}
            {event.lineup && (
              <div>
                <h2 className="font-display font-semibold text-xl mb-4">Lineup</h2>
                <div className="flex flex-wrap gap-3">
                  {event.lineup.map(artist => (
                    <span key={artist} className="px-4 py-2 rounded-full border border-border/40 text-sm">{artist}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {event.schedule && (
              <div>
                <h2 className="font-display font-semibold text-xl mb-4">Schedule</h2>
                <div className="space-y-3">
                  {event.schedule.map((s, i) => (
                    <div key={i} className="flex gap-4 text-sm">
                      <span className="text-muted-foreground w-20 flex-shrink-0">{s.time}</span>
                      <span>{s.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {event.faq.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xl mb-4">FAQ</h2>
                <div className="space-y-2">
                  {event.faq.map((f, i) => (
                    <div key={i} className="border border-border/30 rounded-xl">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-sm font-medium text-left">
                        {f.question}
                        {openFaq === i ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                      </button>
                      {openFaq === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.answer}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticket sidebar */}
          <div className="h-fit lg:sticky lg:top-24 p-6 rounded-xl border border-border/30 bg-card/50 space-y-4">
            <h3 className="font-display font-semibold text-lg">Tickets</h3>
            {event.ticketTiers.map(tier => (
              <div key={tier.id} className="p-4 rounded-lg border border-border/20 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{tier.name}</h4>
                    <p className="text-xs text-muted-foreground">{tier.description}</p>
                  </div>
                  <span className="font-semibold text-sm">৳{tier.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{tier.remaining} remaining</span>
                  <div className="flex items-center gap-2 border border-border/40 rounded-full">
                    <button onClick={() => setTierQty(prev => ({ ...prev, [tier.id]: Math.max(0, (prev[tier.id] || 0) - 1) }))} className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 rounded-l-full"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm w-5 text-center">{tierQty[tier.id] || 0}</span>
                    <button onClick={() => setTierQty(prev => ({ ...prev, [tier.id]: Math.min(tier.maxPerOrder, (prev[tier.id] || 0) + 1) }))} className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 rounded-r-full"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}

            {totalTickets > 0 && (
              <div className="pt-2 border-t border-border/30 space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
                  <span>৳{totalPrice.toLocaleString()}</span>
                </div>
                <Link
                  to={`/encounter/checkout/${event.id}?tiers=${encodeURIComponent(JSON.stringify(tierQty))}`}
                  className="block w-full text-center rounded-full py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Buy Tickets
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="h-16" />
      </div>
    </>
  );
};

export default EventDetail;
