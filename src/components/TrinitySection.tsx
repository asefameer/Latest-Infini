import { motion } from "framer-motion";
import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

import nova01 from "@/assets/nova-01.png";
import nova02 from "@/assets/nova-02.png";
import ltm01 from "@/assets/ltm-01.png";
import ltm02 from "@/assets/ltm-02.png";
import xforce01 from "@/assets/xforce-01.png";
import xforce02 from "@/assets/xforce-02.png";

const springConfig = { stiffness: 60, damping: 18, mass: 0.6 };

const cards = [
  {
    title: "NOVA",
    image1: nova01,
    image2: nova02,
    description:
      "NOVA is a lifestyle platform that goes beyond the ordinary to create Bangladesh's most exceptional experiences.",
  },
  {
    title: "LIVE THE MOMENT",
    image1: ltm01,
    image2: ltm02,
    description:
      "Live the Moment is a lifestyle platform where you truly live every bit of the moment.",
  },
  {
    title: "X FORCE",
    image1: xforce01,
    image2: xforce02,
    description:
      "X Force is not just a platform, but a tribe for those who refuse to settle. For the ones who push limits, chase adrenaline, and live their passion loud.",
  },
];

/** Card with two images — image2 overlays image1 on scroll */
const OverlayCard = ({
  image1,
  image2,
  alt,
}: {
  image1: string;
  image2: string;
  alt: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.7 0.5"],
  });
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Image2 opacity: fades in as you scroll
  const overlayOpacity = useTransform(smoothProgress, [0.3, 1], [0, 1]);

  // Subtle parallax on base image
  const y1 = useTransform(smoothProgress, [0, 1], ["-8%", "8%"]);
  const scale1 = useTransform(smoothProgress, [0, 0.5, 1], [1.08, 1.04, 1.08]);

  // Image2 slides up slightly as it appears
  const y2 = useTransform(smoothProgress, [0.3, 1], ["6%", "0%"]);

  return (
    <div ref={ref} className="relative aspect-[3/4] rounded-lg overflow-hidden mb-5">
      {/* Base image (image1) */}
      <motion.img
        src={image1}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ y: y1, scale: scale1, willChange: "transform" }}
      />

      {/* Overlay image (image2) — fades in on scroll */}
      <motion.img
        src={image2}
        alt={`${alt} overlay`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: overlayOpacity, y: y2, willChange: "transform, opacity" }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

const TrinitySection = () => {
  return (
    <section
      id="the-trinity"
      className="relative min-h-screen flex flex-col items-center py-24 px-8 bg-background"
    >
      {/* Heading */}
      <ScrollReveal className="text-center mb-16" offsetY={60} blur={8}>
        <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
          The Trinity Collective
        </h2>
        <p className="text-muted-foreground text-lg">
          A singular destination for your multifaceted life.
        </p>
      </ScrollReveal>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {cards.map((card) => (
          <ScrollReveal
            key={card.title}
            className="group cursor-pointer"
            offsetY={80}
            blur={10}
          >
            <OverlayCard image1={card.image1} image2={card.image2} alt={card.title} />

            <h3 className="font-display text-xl font-bold text-foreground mb-2 tracking-wide">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default TrinitySection;
