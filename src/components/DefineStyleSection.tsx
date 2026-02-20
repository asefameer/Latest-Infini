import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import ltmCardVideo from "@/assets/ltm-card.mp4";
import xforceCardVideo from "@/assets/xforce-card.mp4";

const springConfig = { stiffness: 60, damping: 18, mass: 0.6 };

const cards = [
  {
    title: "LIVE THE MOMENT",
    subtitle: "Experience life as it happens",
    video: ltmCardVideo,
    tilt: -6, // tilted left
  },
  {
    title: "X FORCE",
    subtitle: "Push beyond limits",
    video: xforceCardVideo,
    tilt: 6, // tilted right
  },
];

const VideoCard = ({ video, title, tilt }: { video: string; title: string; tilt: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.92, 1, 0.96]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], [40, 0, -20]);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        scale,
        y,
        rotate: tilt,
        willChange: "transform",
      }}
    >
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none" />
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl font-bold text-foreground tracking-wider">
          {title}
        </h3>
      </div>
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px hsl(var(--infinity-cyan) / 0.4), 0 0 30px hsl(var(--infinity-purple) / 0.15)",
        }}
      />
    </motion.div>
  );
};

const DefineStyleSection = () => {
  return (
    <section
      id="define-style"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-8"
      style={{ background: "hsl(var(--section-dark))" }}
    >
      {/* Heading */}
      <ScrollReveal className="text-center mb-16" offsetY={60} blur={8}>
        <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
          Define Your Style
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose your world. Live your way.
        </p>
      </ScrollReveal>

      {/* Two video cards */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl w-full">
        {cards.map((card) => (
          <ScrollReveal key={card.title} offsetY={80} blur={10} className="w-full max-w-[360px]">
            <VideoCard video={card.video} title={card.title} tilt={card.tilt} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default DefineStyleSection;
