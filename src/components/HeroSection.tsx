import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import heroVideo from "@/assets/infinity-logo-video.mp4";
import WebGLDistortion from "@/components/WebGLDistortion";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

// Infinite marquee ticker component
const MarqueeTicker = ({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) => (
  <div className="overflow-hidden whitespace-nowrap">
    <motion.div
      className="inline-flex"
      animate={{ x: [0, "-50%"] }}
      transition={{ duration: speed, ease: "linear", repeat: Infinity }}
    >
      <span className="inline-flex">{children}</span>
      <span className="inline-flex">{children}</span>
    </motion.div>
  </div>
);

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 150 });

  // Parallax layers
  const layer1X = useTransform(smoothMouseX, [-0.5, 0.5], [15, -15]);
  const layer1Y = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const layer2X = useTransform(smoothMouseX, [-0.5, 0.5], [6, -6]);
  const layer2Y = useTransform(smoothMouseY, [-0.5, 0.5], [4, -4]);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.25]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -100]);

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

  const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  // Character stagger for INFINITY
  const letterVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, delay: 0.4 + i * 0.06, ease },
    }),
  };

  const tickerText = (
    <>
      {["NOVA", "LIVE THE MOMENT", "XFORCE", "EDITIONS", "ENCOUNTER"].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-4 mx-8">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-display font-bold tracking-[0.3em] text-muted-foreground uppercase">
            {item}
          </span>
        </span>
      ))}
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="ground-zero"
      className="relative h-screen flex flex-col overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* WebGL Video Background */}
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

      {/* Dark overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/90 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 z-[1]" />

      {/* ── Top marquee ticker ── */}
      <motion.div
        className="relative z-10 mt-20 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: videoReady ? 0.4 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <MarqueeTicker speed={40}>
          {tickerText}
        </MarqueeTicker>
      </motion.div>

      {/* ── Main hero content ── */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center"
        style={{ opacity: scrollOpacity, y: scrollY, x: layer2X }}
      >
        {/* Giant INFINITY text */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-display font-black text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-[-0.04em] text-foreground select-none"
            style={{ perspective: 600 }}
          >
            {"INFINITY".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={letterVariants}
                initial="hidden"
                animate={videoReady ? "visible" : "hidden"}
                custom={i}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="font-body text-sm md:text-base tracking-[0.5em] text-muted-foreground uppercase mt-6"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={videoReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease }}
        >
          Towards infinite possibilities
        </motion.p>

        {/* Sub-brands row */}
        <motion.div
          className="flex items-center gap-6 mt-10"
          initial={{ opacity: 0, y: 15 }}
          animate={videoReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.6, ease }}
        >
          {["NOVA", "LIVE THE MOMENT", "XFORCE"].map((name, i) => (
            <span key={name} className="flex items-center gap-6">
              {i > 0 && <span className="w-px h-4 bg-muted-foreground/30" />}
              <span
                className="text-xs font-display font-bold tracking-[0.3em] text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                data-magnetic
              >
                {name}
              </span>
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              className="flex items-center gap-4 mt-10"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease }}
            >
              <button
                onClick={() => onNavigate("editions")}
                data-magnetic
                data-cursor="cta"
                data-cursor-label="Shop"
                className="px-10 py-4 rounded-full text-xs font-display font-bold tracking-[0.3em] uppercase bg-foreground text-background hover:scale-105 transition-transform"
              >
                Editions
              </button>
              <button
                onClick={() => onNavigate("encounter")}
                data-magnetic
                data-cursor="cta"
                data-cursor-label="Events"
                className="px-10 py-4 rounded-full text-xs font-display font-bold tracking-[0.3em] uppercase border border-foreground/30 text-foreground hover:border-foreground/60 hover:scale-105 transition-all"
              >
                Encounter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Bottom marquee ticker (reverse) ── */}
      <motion.div
        className="relative z-10 mb-20 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: videoReady ? 0.3 : 0 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <div className="overflow-hidden whitespace-nowrap">
          <motion.div
            className="inline-flex"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
          >
            <span className="inline-flex">{tickerText}</span>
            <span className="inline-flex">{tickerText}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-[0.4em] text-muted-foreground font-display font-bold uppercase">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1 h-1 rounded-full bg-foreground animate-scroll-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
