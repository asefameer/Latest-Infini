import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import trinityNova from '@/assets/trinity-nova.jpg';
import trinityLtm from '@/assets/trinity-live-the-moment.jpg';
import trinityXforce from '@/assets/trinity-xforce.jpg';

interface TrinitySlide {
  id: string;
  name: string;
  tagline: string;
  image: string;
  link: string;
  accent: string;
}

const slides: TrinitySlide[] = [
  {
    id: 'nova',
    name: 'NOVA',
    tagline: 'Light Beyond Limits',
    image: trinityNova,
    link: '/the-trinity/nova',
    accent: 'var(--infinity-cyan)',
  },
  {
    id: 'live-the-moment',
    name: 'Live The Moment',
    tagline: 'Every Second Counts',
    image: trinityLtm,
    link: '/the-trinity/live-the-moment',
    accent: 'var(--infinity-purple)',
  },
  {
    id: 'x-force',
    name: 'X-Force',
    tagline: 'Defy. Disrupt. Dominate.',
    image: trinityXforce,
    link: '/the-trinity/x-force',
    accent: 'var(--infinity-pink)',
  },
];

const INTERVAL = 4000;

const HomepageBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden py-2 px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto">
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[3/1]">
          {/* Background slides — vertical transition */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, hsl(var(--background) / 0.82) 0%, hsl(var(--background) / 0.5) 45%, hsl(var(--background) / 0.15) 100%)',
                }}
              />
              {/* Accent glow bottom-left */}
              <div
                className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at bottom left, hsl(${slide.accent} / 0.12), transparent 70%)`,
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Content overlay */}
          <Link
            to={slide.link}
            className="absolute inset-0 z-10 group"
          >
            <div className="h-full flex flex-col justify-center px-8 md:px-14 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <p
                    className="text-xs md:text-sm uppercase tracking-[0.3em] mb-2 font-medium"
                    style={{ color: `hsl(${slide.accent})` }}
                  >
                    The Trinity
                  </p>
                  <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
                    {slide.name}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    {slide.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                boxShadow: `inset 0 0 0 1px hsl(${slide.accent} / 0.2)`,
              }}
            />
          </Link>

          {/* Progress indicators — vertical dots right side */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className="relative w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background:
                    i === current
                      ? `hsl(${s.accent})`
                      : 'hsl(var(--foreground) / 0.25)',
                  boxShadow:
                    i === current
                      ? `0 0 8px hsl(${s.accent} / 0.5)`
                      : 'none',
                  transform: i === current ? 'scale(1.3)' : 'scale(1)',
                }}
                aria-label={`Go to ${s.name}`}
              >
                {/* Auto-progress ring */}
                {i === current && !isPaused && (
                  <svg
                    className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)]"
                    viewBox="0 0 20 20"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke={`hsl(${s.accent} / 0.4)`}
                      strokeWidth="1.5"
                      strokeDasharray={`${2 * Math.PI * 8}`}
                      strokeDashoffset={`${2 * Math.PI * 8}`}
                      strokeLinecap="round"
                      style={{
                        animation: `progress-ring ${INTERVAL}ms linear forwards`,
                      }}
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageBanner;
