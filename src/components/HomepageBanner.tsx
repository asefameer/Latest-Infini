import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
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
const SWIPE_THRESHOLD = 40;

const HomepageBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = down/next, -1 = up/prev
  const isSwiping = useRef(false);

  const goTo = useCallback((index: number, dir?: number) => {
    setDirection(dir ?? (index > current ? 1 : -1));
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  // Swipe handler
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      // Vertical swipe: negative offset.y = swipe up = next
      if (Math.abs(offset.y) > SWIPE_THRESHOLD || Math.abs(velocity.y) > 300) {
        if (offset.y < 0) {
          next();
        } else {
          prev();
        }
      }
      // Horizontal swipe fallback for accessibility
      if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 300) {
        if (offset.x < 0) {
          next();
        } else {
          prev();
        }
      }
      // Allow link click again
      setTimeout(() => { isSwiping.current = false; }, 50);
    },
    [next, prev]
  );

  const handleDragStart = useCallback(() => {
    isSwiping.current = true;
    setIsPaused(true);
  }, []);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ y: dir > 0 ? '100%' : '-100%', opacity: 0.5 }),
    center: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0.5 }),
  };

  const contentVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section
      className="relative overflow-hidden py-2 px-4 md:px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto">
        <motion.div
          className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[21/9] md:aspect-[3/1] touch-none"
          onPanEnd={handleDragEnd}
          onPanStart={handleDragStart}
        >
          {/* Background slides — vertical transition */}
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.5) 45%, hsl(var(--background) / 0.15) 100%)',
                }}
              />
              {/* Mobile: stronger bottom overlay for text readability */}
              <div
                className="absolute inset-0 sm:hidden"
                style={{
                  background:
                    'linear-gradient(to top, hsl(var(--background) / 0.7) 0%, transparent 60%)',
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
            onClick={(e) => { if (isSwiping.current) e.preventDefault(); }}
          >
            <div className="h-full flex flex-col justify-end sm:justify-center px-6 pb-10 sm:pb-0 md:px-14 max-w-2xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <p
                    className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] mb-1.5 sm:mb-2 font-medium"
                    style={{ color: `hsl(${slide.accent})` }}
                  >
                    The Trinity
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-1 sm:mb-2">
                    {slide.name}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">
                    {slide.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          {/* Swipe hint on mobile */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 sm:hidden flex items-center gap-1.5 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            <span>Swipe</span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="opacity-60">
              <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Progress indicators — vertical dots right side */}
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 sm:gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={(e) => { e.preventDefault(); goTo(i); }}
                className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300"
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
        </motion.div>
      </div>
    </section>
  );
};

export default HomepageBanner;
