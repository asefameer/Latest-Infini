import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="ground-zero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20">
        <motion.h1
          className="font-display text-[7rem] md:text-[10rem] font-bold tracking-[0.15em] leading-none text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            textShadow: "0 0 80px hsl(174 72% 56% / 0.15), 0 0 120px hsl(280 60% 60% / 0.1)",
          }}
        >
          INFINITY
        </motion.h1>

        <motion.p
          className="font-body text-lg md:text-xl tracking-[0.4em] text-muted-foreground mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Towards infinite possibilities
        </motion.p>

        {/* Scrolled state content */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              className="mt-8 flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Infinity is a space that unifies everything. Whether you want to step into new
                experiences with NOVA, savor the now with Live the Moment, or strive for more with
                X Force, everything is here for you.
              </p>

              <div className="flex items-center gap-4 text-sm font-semibold tracking-widest text-foreground">
                <span className="hover:text-primary cursor-pointer transition-colors">NOVA</span>
                <span className="text-muted-foreground">|</span>
                <span className="hover:text-primary cursor-pointer transition-colors">LIVE THE MOMENT</span>
                <span className="text-muted-foreground">|</span>
                <span className="hover:text-primary cursor-pointer transition-colors">XFORCE</span>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => onNavigate("editions")}
                  className="px-8 py-3 rounded-full text-sm font-semibold tracking-wider bg-gradient-to-r from-infinity-cyan/20 to-infinity-purple/20 border border-infinity-cyan/30 text-foreground hover:border-infinity-cyan/60 transition-all"
                >
                  EDITIONS
                </button>
                <button
                  onClick={() => onNavigate("encounter")}
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wider bg-gradient-to-r from-infinity-purple/30 to-infinity-pink/30 border border-infinity-purple/40 text-foreground hover:border-infinity-purple/70 transition-all"
                >
                  ENCOUNTER
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs tracking-[0.3em] text-muted-foreground font-medium">SCROLL</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
