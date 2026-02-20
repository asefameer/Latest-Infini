import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

// ─── Unified sparkle system: path + free particles ───
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  mode: "path" | "free"; // path = on infinity, free = floating
  pathAngle: number; // used when mode === "path"
  throwTimer: number; // cooldown before it can be thrown again
}

const TOTAL_PARTICLES = 100;
const PATH_PARTICLES = 40;
const FREE_PARTICLES = TOTAL_PARTICLES - PATH_PARTICLES;

const UnifiedHeroCanvas = ({
  mouseX,
  mouseY,
}: {
  mouseX: number;
  mouseY: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  // Keep mouse ref updated without re-creating effect
  mouseRef.current = { x: mouseX, y: mouseY };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    if (particlesRef.current.length === 0) {
      const particles: Particle[] = [];
      // Path particles
      for (let i = 0; i < PATH_PARTICLES; i++) {
        particles.push({
          x: 0, y: 0,
          vx: 0, vy: 0,
          size: Math.random() * 2 + 1.5,
          hue: Math.random() * 360,
          life: Math.random(),
          mode: "path",
          pathAngle: (i / PATH_PARTICLES) * Math.PI * 2,
          throwTimer: 0,
        });
      }
      // Free particles
      for (let i = 0; i < FREE_PARTICLES; i++) {
        particles.push({
          x: Math.random() * 2000,
          y: Math.random() * 1200,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 0.5,
          hue: Math.random() * 360,
          life: Math.random(),
          mode: "free",
          pathAngle: 0,
          throwTimer: 0,
        });
      }
      particlesRef.current = particles;
    }

    // Helper: get position on infinity path
    const getInfinityPos = (angle: number, t: number, cx: number, cy: number, scaleX: number, scaleY: number) => {
      const denom = 1 + Math.sin(angle) * Math.sin(angle);
      let x = (Math.cos(angle) / denom) * scaleX;
      let y = (Math.sin(angle) * Math.cos(angle) / denom) * scaleY;
      x += Math.sin(angle * 3 + t * 2) * 6;
      y += Math.cos(angle * 2 + t * 1.5) * 4;
      return { x: cx + x, y: cy + y };
    };

    const draw = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scaleX = Math.min(w * 0.42, 500);
      const scaleY = Math.min(h * 0.45, 420);
      const mx = (mouse.x - 0.5) * 30;
      const my = (mouse.y - 0.5) * 20;

      // ── Draw infinity path layers ──
      const layers = [
        { offset: 0, alpha: 0.08, width: 120, blur: 60 },
        { offset: 0.1, alpha: 0.12, width: 80, blur: 40 },
        { offset: 0.2, alpha: 0.2, width: 50, blur: 25 },
        { offset: 0.3, alpha: 0.35, width: 20, blur: 12 },
        { offset: 0.35, alpha: 0.6, width: 8, blur: 4 },
        { offset: 0.4, alpha: 1, width: 3, blur: 0 },
      ];

      for (const layer of layers) {
        ctx.save();
        ctx.globalAlpha = layer.alpha;
        if (layer.blur > 0) ctx.filter = `blur(${layer.blur}px)`;

        const grad = ctx.createLinearGradient(cx - scaleX, cy, cx + scaleX, cy);
        const hue1 = (t * 40 + layer.offset * 360) % 360;
        const hue2 = (hue1 + 60) % 360;
        const hue3 = (hue1 + 180) % 360;
        const hue4 = (hue1 + 270) % 360;
        grad.addColorStop(0, `hsl(${hue1}, 85%, 65%)`);
        grad.addColorStop(0.3, `hsl(${hue2}, 90%, 60%)`);
        grad.addColorStop(0.6, `hsl(${hue3}, 85%, 65%)`);
        grad.addColorStop(1, `hsl(${hue4}, 90%, 60%)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = layer.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        const steps = 200;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const phase = t * 0.5 + layer.offset;
          const denom = 1 + Math.sin(angle) * Math.sin(angle);
          let x = (Math.cos(angle) / denom) * scaleX;
          let y = (Math.sin(angle) * Math.cos(angle) / denom) * scaleY;
          x += Math.sin(angle * 3 + phase * 4) * 8 * Math.sin(t + layer.offset);
          y += Math.cos(angle * 2 + phase * 3) * 6 * Math.cos(t * 1.3 + layer.offset);

          const distFromMouse = Math.hypot((cx + x) / w - mouse.x, (cy + y) / h - mouse.y);
          const push = Math.max(0, 1 - distFromMouse * 3) * 25;
          x += mx * push * 0.3;
          y += my * push * 0.3;

          if (i === 0) ctx.moveTo(cx + x, cy + y);
          else ctx.lineTo(cx + x, cy + y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // ── Check if mouse is near infinity path ──
      const mousePixelX = mouse.x * w;
      const mousePixelY = mouse.y * h;
      let mouseNearInfinity = false;
      // Sample a few points on the path to check proximity
      for (let i = 0; i < 16; i++) {
        const sampleAngle = (i / 16) * Math.PI * 2;
        const pos = getInfinityPos(sampleAngle, t, cx, cy, scaleX, scaleY);
        if (Math.hypot(pos.x - mousePixelX, pos.y - mousePixelY) < 120) {
          mouseNearInfinity = true;
          break;
        }
      }

      // ── Occasionally throw a path particle to free when hovering ──
      if (mouseNearInfinity && Math.random() < 0.08) {
        // Find a path particle near mouse to throw
        const pathParticles = particlesRef.current.filter(p => p.mode === "path" && p.throwTimer <= 0);
        if (pathParticles.length > 20) { // keep at least 20 on path
          // Pick the one closest to mouse
          let closest: Particle | null = null;
          let closestDist = Infinity;
          for (const p of pathParticles) {
            const pos = getInfinityPos(p.pathAngle + t * 1.5, t, cx, cy, scaleX, scaleY);
            const d = Math.hypot(pos.x - mousePixelX, pos.y - mousePixelY);
            if (d < closestDist && d < 150) {
              closestDist = d;
              closest = p;
            }
          }
          if (closest) {
            const pos = getInfinityPos(closest.pathAngle + t * 1.5, t, cx, cy, scaleX, scaleY);
            // Throw direction: away from mouse
            const throwDx = pos.x - mousePixelX;
            const throwDy = pos.y - mousePixelY;
            const throwDist = Math.hypot(throwDx, throwDy) || 1;
            const speed = 3 + Math.random() * 4;
            closest.mode = "free";
            closest.x = pos.x;
            closest.y = pos.y;
            closest.vx = (throwDx / throwDist) * speed + (Math.random() - 0.5) * 2;
            closest.vy = (throwDy / throwDist) * speed + (Math.random() - 0.5) * 2;
            closest.throwTimer = 300; // frames before it can return
          }
        }
      }

      // ── Reclaim: free particles slowly return to path when far and timer expired ──
      const freeParticles = particlesRef.current.filter(p => p.mode === "free");
      const pathCount = TOTAL_PARTICLES - freeParticles.length;
      if (pathCount < PATH_PARTICLES) {
        for (const p of freeParticles) {
          if (p.throwTimer > 0) { p.throwTimer--; continue; }
          // If far from mouse and slow, reclaim it
          const dToMouse = Math.hypot(p.x / w - mouse.x, p.y / h - mouse.y);
          const speed = Math.hypot(p.vx, p.vy);
          if (dToMouse > 0.3 && speed < 1) {
            p.mode = "path";
            p.pathAngle = Math.random() * Math.PI * 2;
            p.throwTimer = 0;
            if (particlesRef.current.filter(pp => pp.mode === "free").length <= FREE_PARTICLES) break;
          }
        }
      }

      // ── Draw all particles ──
      for (const p of particlesRef.current) {
        p.hue = (p.hue + 0.3) % 360;

        if (p.mode === "path") {
          // Move along infinity path
          p.pathAngle += 0.02;
          const pos = getInfinityPos(p.pathAngle + t * 1.5, t, cx, cy, scaleX, scaleY);
          p.x = pos.x;
          p.y = pos.y;

          const alpha = 0.4 + Math.sin(t * 2 + p.pathAngle * 3) * 0.3;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsl(${p.hue}, 90%, 70%)`;
          ctx.shadowColor = `hsl(${p.hue}, 90%, 70%)`;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Free floating particle
          // Mouse repulsion
          const dx = p.x / w - mouse.x;
          const dy = p.y / h - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.15 && dist > 0) {
            const force = (0.15 - dist) * 2;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.life = (Math.sin(t * 10 + p.hue * 0.01) + 1) / 2;
          if (p.throwTimer > 0) p.throwTimer--;

          // Wrap around
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.save();
          ctx.globalAlpha = 0.3 + p.life * 0.4;
          ctx.fillStyle = `hsl(${p.hue}, 80%, 65%)`;
          ctx.shadowColor = `hsl(${p.hue}, 80%, 65%)`;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

// ─── Main Hero Section ───
const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [pixelMouse, setPixelMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth springs for parallax
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { damping: 30, stiffness: 100 });
  const smoothY = useSpring(my, { damping: 30, stiffness: 100 });

  // Parallax transforms
  const layer1X = useTransform(smoothX, [0, 1], [20, -20]);
  const layer1Y = useTransform(smoothY, [0, 1], [15, -15]);
  const layer2X = useTransform(smoothX, [0, 1], [-10, 10]);
  const layer2Y = useTransform(smoothY, [0, 1], [-8, 8]);
  const layer3X = useTransform(smoothX, [0, 1], [8, -8]);
  const layer3Y = useTransform(smoothY, [0, 1], [6, -6]);

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mx.set(x);
      my.set(y);
      setMousePos({ x, y });
      setPixelMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsHovering(true);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Mask size based on hover
  const maskSize = isHovering ? 220 : 0;

  return (
    <section
      ref={sectionRef}
      id="ground-zero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-background cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Layer 0: Deep background gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />

      {/* ── Unified sparkle + infinity canvas ── */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer2X, y: layer2Y, scale: scrollScale, opacity: scrollOpacity }}
      >
        <UnifiedHeroCanvas mouseX={mousePos.x} mouseY={mousePos.y} />
      </motion.div>

      {/* ── Layer 3: INFINITY text revealed by cursor mask ── */}
      <motion.div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ x: layer3X, y: layer3Y, opacity: scrollOpacity }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            WebkitMaskImage: `radial-gradient(circle ${maskSize}px at ${pixelMouse.x}px ${pixelMouse.y}px, black 30%, transparent 100%)`,
            maskImage: `radial-gradient(circle ${maskSize}px at ${pixelMouse.x}px ${pixelMouse.y}px, black 30%, transparent 100%)`,
            transition: isHovering ? "none" : "mask-size 0.5s ease-out, -webkit-mask-size 0.5s ease-out",
          }}
        >
          {/* Glowing frosted glass background behind text */}
          <div className="absolute inset-0 backdrop-blur-xl bg-background/30" />
          <h1
            className="relative font-display font-black text-[clamp(5rem,18vw,16rem)] leading-[0.85] tracking-[-0.04em] select-none"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--infinity-pink)), hsl(var(--primary)))",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-shift 4s ease infinite",
            }}
          >
            INFINITY
          </h1>
        </div>
      </motion.div>

      {/* ── Layer 4: Central content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ opacity: scrollOpacity, y: scrollY }}
      >
        {/* Small infinity icon */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <svg width="60" height="30" viewBox="0 0 60 30" className="opacity-40">
            <path
              d="M15 15c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="font-body text-sm md:text-base tracking-[0.5em] text-muted-foreground uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Towards infinite possibilities
        </motion.p>

        {/* Hover prompt */}
        <motion.p
          className="font-body text-xs tracking-[0.3em] text-muted-foreground/50 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          move cursor to reveal
        </motion.p>

        {/* Sub-brands */}
        <motion.div
          className="flex items-center gap-6 mt-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {["NOVA", "LIVE THE MOMENT", "XFORCE"].map((name, i) => (
            <span key={name} className="flex items-center gap-6">
              {i > 0 && <span className="w-px h-4 bg-muted-foreground/30" />}
              <span
                className="text-xs font-display font-bold tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors cursor-pointer"
                data-magnetic
              >
                {name}
              </span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Custom cursor dot ── */}
      {isHovering && (
        <motion.div
          className="fixed z-50 pointer-events-none mix-blend-difference"
          style={{
            left: pixelMouse.x,
            top: pixelMouse.y,
            x: "-50%",
            y: "-50%",
          }}
        >
          <div className="w-4 h-4 rounded-full bg-foreground" />
        </motion.div>
      )}

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-[0.4em] text-muted-foreground font-display font-bold uppercase">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1 h-1 rounded-full bg-foreground animate-scroll-bounce" />
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3] pointer-events-none" />
    </section>
  );
};

export default HeroSection;
