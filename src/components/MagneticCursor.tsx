import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorState = "default" | "hover" | "cta" | "hidden";

const MagneticCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [cursorLabel, setCursorLabel] = useState("");
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const followerX = useMotionValue(0);
  const followerY = useMotionValue(0);

  // Smooth spring for the follower ring
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(followerX, springConfig);
  const smoothY = useSpring(followerY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    followerX.set(e.clientX);
    followerY.set(e.clientY);

    // Magnetic pull for [data-magnetic] elements
    const target = (e.target as HTMLElement).closest("[data-magnetic]") as HTMLElement | null;
    if (target) {
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pullX = (e.clientX - centerX) * 0.3;
      const pullY = (e.clientY - centerY) * 0.3;
      target.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }
  }, [cursorX, cursorY, followerX, followerY]);

  useEffect(() => {
    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const magnetic = el.closest("[data-magnetic]");
      const interactive = el.closest("a, button, [data-cursor='cta']");
      const hoverEl = el.closest("[data-cursor='hover']");

      if (magnetic || el.closest("[data-cursor='cta']")) {
        setCursorState("cta");
        setCursorLabel(el.closest("[data-cursor-label]")?.getAttribute("data-cursor-label") || "");
      } else if (interactive) {
        setCursorState("hover");
        setCursorLabel("");
      } else if (hoverEl) {
        setCursorState("hover");
        setCursorLabel("");
      } else {
        setCursorState("default");
        setCursorLabel("");
      }
    };

    const handleOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const magnetic = el.closest("[data-magnetic]") as HTMLElement | null;
      if (magnetic) {
        magnetic.style.transform = "translate(0, 0)";
      }
      setCursorState("default");
      setCursorLabel("");
    };

    const handleLeave = () => setCursorState("hidden");
    const handleEnter = () => setCursorState("default");

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [handleMouseMove]);

  // Hide native cursor
  useEffect(() => {
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => {
      document.body.style.cursor = "";
      style.remove();
    };
  }, []);

  const dotSize = cursorState === "default" ? 8 : cursorState === "hover" ? 4 : 6;
  const ringSize = cursorState === "default" ? 36 : cursorState === "hover" ? 50 : cursorState === "cta" ? 80 : 36;

  return (
    <>
      {/* Inner dot — direct cursor position */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
          background: "hsl(var(--foreground))",
          mixBlendMode: "difference",
        }}
        animate={{
          width: dotSize,
          height: dotSize,
          opacity: cursorState === "hidden" ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Outer ring — eased follower */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "hsl(var(--infinity-cyan) / 0.5)",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: cursorState === "hidden" ? 0 : cursorState === "cta" ? 0.9 : 0.5,
          borderWidth: cursorState === "cta" ? 2 : 1,
          backgroundColor: cursorState === "cta" ? "hsl(var(--infinity-cyan) / 0.08)" : "transparent",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Label for CTA state */}
      <AnimatePresence>
        {cursorState === "cta" && cursorLabel && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[10px] font-display font-bold tracking-[0.2em] text-foreground uppercase whitespace-nowrap">
              {cursorLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MagneticCursor;
