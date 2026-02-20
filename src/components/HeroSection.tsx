import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import heroVideo from "@/assets/infinity-logo-video.mp4";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

let particleId = 0;

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastSpawn = useRef(0);

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

  // Remove particles after animation
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [particles]);

  const sampleVideoColor = useCallback((clientX: number, clientY: number): string => {
    const video = videoRef.current;
    if (!video || !sectionRef.current) return "rgb(100, 220, 220)";
    let canvas = canvasRef.current;
    if (!canvas) return "rgb(100, 220, 220)";
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "rgb(100, 220, 220)";

    // Draw current video frame
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Map cursor position to video coordinates
    const rect = sectionRef.current.getBoundingClientRect();
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;
    const sx = Math.floor(ratioX * canvas.width);
    const sy = Math.floor(ratioY * canvas.height);
    const pixel = ctx.getImageData(Math.max(0, sx), Math.max(0, sy), 1, 1).data;

    // Boost saturation for more vivid particles
    const r = Math.min(255, pixel[0] + 30);
    const g = Math.min(255, pixel[1] + 30);
    const b = Math.min(255, pixel[2] + 30);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastSpawn.current < 60) return;
    lastSpawn.current = now;
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const color = sampleVideoColor(e.clientX, e.clientY);
    setParticles((prev) => [
      ...prev.slice(-20),
      { id: particleId++, x: e.clientX - rect.left, y: e.clientY - rect.top, color },
    ]);
  }, [sampleVideoColor]);

  return (
    <section
      ref={sectionRef}
      id="ground-zero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Video Background — no movement, just scroll zoom */}
      <motion.div className="absolute inset-0" style={{ scale: scrollScale }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>

      {/* Subtle bottom fade for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      {/* Particle trail */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: p.x,
              top: p.y,
              background: `radial-gradient(circle, ${p.color}, transparent)`,
              boxShadow: `0 0 8px ${p.color}, 0 0 20px ${p.color}`,
            }}
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ opacity: 0, scale: 0, y: -30 + Math.random() * -20, x: (Math.random() - 0.5) * 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Content with scroll fade */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 pt-20"
        style={{ opacity: scrollOpacity }}
      >
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
      </motion.div>

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
