import { motion } from "framer-motion";
import trinityNova from "@/assets/trinity-nova.jpg";
import trinityLtm from "@/assets/trinity-live-the-moment.jpg";
import trinityXforce from "@/assets/trinity-xforce.jpg";

const cards = [
  {
    title: "NOVA",
    image: trinityNova,
    description:
      "NOVA is a lifestyle platform that goes beyond the ordinary to create Bangladesh's most exceptional experiences.",
  },
  {
    title: "LIVE THE MOMENT",
    image: trinityLtm,
    description:
      "Live the Moment is a lifestyle platform where you truly live every bit of the moment.",
  },
  {
    title: "X FORCE",
    image: trinityXforce,
    description:
      "X Force is not just a platform, but a tribe for those who refuse to settle. For the ones who push limits, chase adrenaline, and live their passion loud.",
  },
];

const TrinitySection = () => {
  return (
    <section
      id="the-trinity"
      className="relative min-h-screen flex flex-col items-center py-24 px-8 bg-background"
    >
      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
          The Trinity Collective
        </h2>
        <p className="text-muted-foreground text-lg">
          A singular destination for your multifaceted life.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-5">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Text */}
            <h3 className="font-display text-xl font-bold text-foreground mb-2 tracking-wide">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrinitySection;
