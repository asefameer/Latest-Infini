import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  offsetY?: number;
  offsetX?: number;
  rotateY?: number;
  scale?: number;
  blur?: number;
  startOffset?: string;
  endOffset?: string;
}

const springConfig = { stiffness: 80, damping: 20, mass: 0.8 };

const ScrollReveal = ({
  children,
  className = "",
  offsetY = 60,
  offsetX = 0,
  rotateY = 0,
  scale = 1,
  blur: _blur = 0, // kept for API compat but no longer applied
  startOffset = "0 1",
  endOffset = "0 0.65",
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [startOffset as any, endOffset as any],
  });

  const smoothProgress = useSpring(scrollYProgress, springConfig);

  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const y = useTransform(smoothProgress, [0, 1], [offsetY, 0]);
  const x = useTransform(smoothProgress, [0, 1], [offsetX, 0]);
  const rY = useTransform(smoothProgress, [0, 1], [rotateY, 0]);
  const s = useTransform(smoothProgress, [0, 1], [scale, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
        x,
        rotateY: rY,
        scale: s,
        perspective: rotateY ? 800 : undefined,
        transformStyle: rotateY ? "preserve-3d" : undefined,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
