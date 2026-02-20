import { useEffect } from "react";
import Lenis from "lenis";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Allow programmatic scrollTo to work with lenis
    const handleAnchor = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']");
      if (anchor) {
        const id = anchor.getAttribute("href")?.slice(1);
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el);
          }
        }
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchor);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
