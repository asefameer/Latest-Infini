import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ChevronRight } from "lucide-react";
import heroVideo from "@/assets/infinity-logo-video.mp4";
import heroCrystal from "@/assets/hero-crystal.jpg";
import WebGLDistortion from "@/components/WebGLDistortion";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 150 });

  // Parallax layers driven by mouse
  const layer1X = useTransform(smoothMouseX, [-0.5, 0.5], [15, -15]);
  const layer1Y = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const layer2X = useTransform(smoothMouseX, [-0.5, 0.5], [8, -8]);
  const layer2Y = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const layer3X = useTransform(smoothMouseX, [-0.5, 0.5], [4, -4]);
  const layer3Y = useTransform(smoothMouseY, [-0.5, 0.5], [3, -3]);

  // Scroll-based parallax zoom
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.25]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Staggered text reveal variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

  const wordVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: easeOut as unknown as [number, number, number, number] },
    },
  };

  const fadeBlurVariants = {
    hidden: { opacity: 0, filter: "blur(20px)", scale: 0.95 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.2, ease: easeOut as unknown as [number, number, number, number] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="ground-zero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* WebGL Distortion Video Background — deepest parallax layer */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: scrollScale, x: layer1X, y: layer1Y }}
      >
        <WebGLDistortion
          videoSrc={heroVideo}
          className="w-full h-full"
          onReady={() => setVideoReady(true)}
        />
      </motion.div>

      {/* SVG Masked crystal image overlay — middle parallax layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: layer2X, y: layer2Y }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="hero-mask">
              <rect width="100%" height="100%" fill="black" />
              {/* Organic blob shape mask */}
              <ellipse cx="960" cy="540" rx="420" ry="350" fill="white" opacity="0.6">
                <animate attributeName="rx" values="420;440;420" dur="6s" repeatCount="indefinite" />
                <animate attributeName="ry" values="350;370;350" dur="8s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="1050" cy="480" rx="280" ry="220" fill="white" opacity="0.3">
                <animate attributeName="cx" values="1050;1070;1050" dur="7s" repeatCount="indefinite" />
              </ellipse>
            </mask>
          </defs>
          <image
            href={heroCrystal}
            width="1920"
            height="1080"
            mask="url(#hero-mask)"
            opacity="0.2"
          />
        </svg>
      </motion.div>

      {/* Subtle bottom + top fade for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />

      {/* Content with scroll fade + shallowest parallax */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 pt-20"
        style={{ opacity: scrollOpacity, x: layer3X, y: layer3Y }}
      >
        {/* Blur + fade entrance for the tagline */}
        <motion.div
          variants={fadeBlurVariants}
          initial="hidden"
          animate={videoReady ? "visible" : "hidden"}
        >
          {/* Staggered text reveal */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-3"
            variants={containerVariants}
            initial="hidden"
            animate={videoReady ? "visible" : "hidden"}
          >
            {["Towards", "infinite", "possibilities"].map((word, i) => (
              <motion.span
                key={i}
                className="font-body text-lg md:text-xl tracking-[0.4em] text-muted-foreground"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scrolled state content */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              className="mt-8 flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Infinity is a space that unifies everything. Whether you want to step into new
                experiences with NOVA, savor the now with Live the Moment, or strive for more with
                X Force, everything is here for you.
              </p>

              <div className="flex items-center gap-4 text-sm font-semibold tracking-widest text-foreground">
                {["NOVA", "LIVE THE MOMENT", "XFORCE"].map((name, i) => (
                  <span key={name}>
                    {i > 0 && <span className="text-muted-foreground mr-4">|</span>}
                    <span
                      className="hover:text-primary cursor-pointer transition-colors"
                      data-magnetic
                    >
                      {name}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => onNavigate("editions")}
                  data-magnetic
                  data-cursor="cta"
                  data-cursor-label="Shop"
                  className="px-8 py-3 rounded-full text-sm font-semibold tracking-wider bg-gradient-to-r from-infinity-cyan/20 to-infinity-purple/20 border border-infinity-cyan/30 text-foreground hover:border-infinity-cyan/60 transition-all"
                >
                  EDITIONS
                </button>
                <button
                  onClick={() => onNavigate("encounter")}
                  data-magnetic
                  data-cursor="cta"
                  data-cursor-label="Events"
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wider bg-gradient-to-r from-infinity-purple/30 to-infinity-pink/30 border border-infinity-purple/40 text-foreground hover:border-infinity-purple/70 transition-all"
                >
                  ENCOUNTER
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-xs tracking-[0.3em] text-muted-foreground font-medium">SCROLL</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-scroll-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
