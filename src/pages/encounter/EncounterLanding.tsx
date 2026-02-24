import { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import HeroBlock from '@/components/blocks/HeroBlock';
import EventCard from '@/components/EventCard';
import SkeletonGrid from '@/components/SkeletonGrid';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import ScrollReveal from '@/components/ScrollReveal';
import { useEvents, useFeaturedEvents } from '@/services/api/hooks';
import { ChevronDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticButton from '@/components/MagneticButton';

const EncounterLanding = () => {
  const { data: allEvents = [], isLoading, isError, refetch } = useEvents();
  const { data: featuredEvents = [] } = useFeaturedEvents();
  const featured = featuredEvents[0];
  const [sort, setSort] = useState<'upcoming' | 'newest'>('upcoming');
  const [cityFilter, setCityFilter] = useState('');

  const cities = [...new Set(allEvents.map(e => e.city))];

  const filtered = useMemo(() => {
    let result = [...allEvents];
    if (cityFilter) result = result.filter(e => e.city === cityFilter);
    if (sort === 'upcoming') result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return result;
  }, [allEvents, sort, cityFilter]);

  return (
    <>
      <SEOHead title="Encounter" description="Discover and attend curated events by Infinity. Music, art, fitness, and more across Bangladesh." canonical="/encounter" />
      {featured && (
        <HeroBlock title={featured.title} subtitle={`${new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · ${featured.venue}, ${featured.city}`} image={featured.bannerImage} height="medium">
          <MagneticButton strength={0.3}>
            <Link to={`/encounter/e/${featured.slug}`} className="group relative inline-flex items-center gap-2 mt-8 rounded-full text-sm font-medium">
              <div className="absolute -inset-[1px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)), hsl(var(--infinity-pink)))', backgroundSize: '200% 200%', animation: 'gradient-shift 3s ease infinite' }} />
              <span className="relative px-8 py-3 rounded-full bg-background/90 group-hover:bg-background/80 transition-colors flex items-center gap-2"><Calendar className="w-4 h-4" /> Get Tickets</span>
            </Link>
          </MagneticButton>
        </HeroBlock>
      )}
      <section className="py-16 px-6" style={{ background: 'hsl(var(--section-mid))' }}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">All Events</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="appearance-none rounded-full border border-border/40 bg-background/50 backdrop-blur-sm px-5 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
              <div className="relative">
                <select value={sort} onChange={e => setSort(e.target.value as 'upcoming' | 'newest')} className="appearance-none rounded-full border border-border/40 bg-background/50 backdrop-blur-sm px-5 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="upcoming">Upcoming</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
          <ScrollReveal>
            {isLoading ? <SkeletonGrid count={6} type="event" /> : isError ? <ErrorState title="Couldn't load events" onRetry={() => refetch()} /> : filtered.length === 0 ? <EmptyState title="No events found" description="Try changing your filters or check back soon for new events." /> : (
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
