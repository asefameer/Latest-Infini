import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScroll, useTransform, useSpring } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useSiteContent, contentToMap } from "@/hooks/use-cms";
import nova01 from "@/assets/nova-01.png";
import nova02 from "@/assets/nova-02.png";
import ltm01 from "@/assets/ltm-01.png";
import ltm02 from "@/assets/ltm-02.png";
import xforce01 from "@/assets/xforce-01.png";
import xforce02 from "@/assets/xforce-02.png";

const springConfig = { stiffness: 60, damping: 18, mass: 0.6 };

const defaultCards = [
  {
    key: "nova",
    title: "NOVA",
    image1: nova01,
    image2: nova02,
    description: "NOVA is a lifestyle platform that goes beyond the ordinary to create Bangladesh's most exceptional experiences.",
    route: "/the-trinity/nova",
  },
  {
    key: "ltm",
    title: "LIVE THE MOMENT",
    image1: ltm01,
    image2: ltm02,
    description: "Live the Moment is a lifestyle platform where you truly live every bit of the moment.",
    route: "/the-trinity/live-the-moment",
  },
  {
    key: "xforce",
    title: "X FORCE",
    image1: xforce01,
    image2: xforce02,
    description: "X Force is not just a platform, but a tribe for those who refuse to settle. For the ones who push limits, chase adrenaline, and live their passion loud.",
    route: "/the-trinity/x-force",
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
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Image 1: visible initially, scales down & fades out
  const opacity1 = useTransform(smoothProgress, [0.2, 0.45], [1, 0]);
  const scale1 = useTransform(smoothProgress, [0.2, 0.45], [1, 0.92]);

  // Image 2: hidden initially, scales up & fades in
  const opacity2 = useTransform(smoothProgress, [0.35, 0.55], [0, 1]);
  const scale2 = useTransform(smoothProgress, [0.35, 0.55], [1.08, 1]);

  return (
    <div ref={ref} className="relative aspect-[3/4] rounded-lg overflow-hidden mb-5">
      {/* Image 1 — scales down & fades out */}
      <motion.img
        src={image1}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: opacity1, scale: scale1, willChange: "transform, opacity" }}
      />

      {/* Image 2 — scales up & fades in */}
      <motion.img
        src={image2}
        alt={`${alt} branded`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: opacity2, scale: scale2, willChange: "transform, opacity" }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

const TrinitySection = () => {
  const { data: contentRows } = useSiteContent('trinity');
  const cm = contentRows ? contentToMap(contentRows) : {};
  const t = cm['trinity'] ?? {};

  const cards = defaultCards.map(c => ({
    ...c,
    title: t[`${c.key}_name`] ?? c.title,
    description: t[`${c.key}_description`] ?? c.description,
  }));

  return (
    <section
      id="the-trinity"
      className="relative min-h-screen flex flex-col items-center py-16 md:py-24 px-4 md:px-8 bg-background"
    >
      {/* Heading */}
      <ScrollReveal className="text-center mb-10 md:mb-16" offsetY={60} blur={8}>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          {t['heading'] ?? 'The Trinity Collective'}
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg">
          {t['subheading'] ?? 'A singular destination for your multifaceted life.'}
        </p>
      </ScrollReveal>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {cards.map((card) => (
          <ScrollReveal
            key={card.key}
            className="group"
            offsetY={80}
            blur={10}
          >
            <Link to={card.route} className="block cursor-pointer">
              <OverlayCard image1={card.image1} image2={card.image2} alt={card.title} />

              <h3 className="font-display text-xl font-bold text-foreground mb-2 tracking-wide group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default TrinitySection;
