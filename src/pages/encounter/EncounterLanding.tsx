import { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import HeroBlock from '@/components/blocks/HeroBlock';
import EventCard from '@/components/EventCard';
import SkeletonGrid from '@/components/SkeletonGrid';
import EmptyState from '@/components/EmptyState';
import ScrollReveal from '@/components/ScrollReveal';
import { events, getFeaturedEvents } from '@/data/events';
import { ChevronDown, Calendar } from 'lucide-react';

const EncounterLanding = () => {
  const featured = getFeaturedEvents()[0];
  const [sort, setSort] = useState<'upcoming' | 'newest'>('upcoming');
  const [cityFilter, setCityFilter] = useState('');
  const [loading] = useState(false);

  const cities = [...new Set(events.map(e => e.city))];

  const filtered = useMemo(() => {
    let result = [...events];
    if (cityFilter) result = result.filter(e => e.city === cityFilter);
    if (sort === 'upcoming') result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return result;
  }, [sort, cityFilter]);

  return (
    <>
      <SEOHead
        title="Encounter"
        description="Discover and attend curated events by Infinity. Music, art, fitness, and more across Bangladesh."
        canonical="/encounter"
      />

      {featured && (
        <HeroBlock
          title={featured.title}
          subtitle={`${new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · ${featured.venue}, ${featured.city}`}
          image={featured.bannerImage}
          height="medium"
        >
          <a
            href={`/encounter/e/${featured.slug}`}
            className="inline-flex items-center gap-2 mt-8 rounded-full px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Calendar className="w-4 h-4" /> Get Tickets
          </a>
        </HeroBlock>
      )}

      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">All Events</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="appearance-none rounded-full border border-border/40 bg-transparent px-5 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
              <div className="relative">
                <select value={sort} onChange={e => setSort(e.target.value as 'upcoming' | 'newest')} className="appearance-none rounded-full border border-border/40 bg-transparent px-5 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="upcoming">Upcoming</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          <ScrollReveal>
            {loading ? (
              <SkeletonGrid count={6} type="event" />
            ) : filtered.length === 0 ? (
              <EmptyState title="No events found" description="Try changing your filters or check back soon for new events." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default EncounterLanding;
