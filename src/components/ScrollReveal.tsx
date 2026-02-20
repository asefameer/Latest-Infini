import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  offsetY?: number;
  offsetX?: number;
  rotateY?: number;
  scale?: number;
  blur?: number;
  /** Where in the viewport the animation starts/ends. Default: element bottom crosses viewport bottom → element top crosses viewport center */
  startOffset?: string;
  endOffset?: string;
}

/**
 * Scroll-synced reveal: continuously scrubs opacity, translateY, etc.
 * based on scroll position. Fully reversible on scroll up.
 */
const ScrollReveal = ({
  children,
  className = "",
  offsetY = 60,
  offsetX = 0,
  rotateY = 0,
  scale = 1,
  blur = 0,
  startOffset = "0 1",    // element top at viewport bottom
  endOffset = "0 0.6",    // element top at 60% of viewport
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [startOffset as any, endOffset as any],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [offsetY, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [offsetX, 0]);
  const rY = useTransform(scrollYProgress, [0, 1], [rotateY, 0]);
  const s = useTransform(scrollYProgress, [0, 1], [scale, 1]);
  const blurVal = useTransform(scrollYProgress, [0, 1], [blur, 0]);
  const filterStr = useTransform(blurVal, (v) => `blur(${v}px)`);

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
        filter: filterStr,
        perspective: rotateY ? 800 : undefined,
        transformStyle: rotateY ? "preserve-3d" : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
