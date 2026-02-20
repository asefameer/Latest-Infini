import { useEffect, useRef, useState, useCallback } from "react";

const GrainOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      const dpr = 1; // grain doesn't need retina
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const mouse = mouseRef.current;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      // Cursor-reactive grain: denser/brighter near cursor
      const mx = mouse.x * w;
      const my = mouse.y * h;

      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const px = pixelIndex % w;
        const py = Math.floor(pixelIndex / w);

        // Distance from cursor (normalized 0-1)
        const dx = (px - mx) / w;
        const dy = (py - my) / h;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Base grain + cursor-reactive intensity boost
        const baseIntensity = 0.03;
        const cursorBoost = Math.max(0, 1 - dist * 3) * 0.06;
        const intensity = baseIntensity + cursorBoost;

        const noise = Math.random() * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = intensity * 255;
      }

      ctx.putImageData(imageData, 0, 0);
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9990]"
      aria-hidden="true"
      style={{ mixBlendMode: "overlay" }}
    />
  );
};

export default GrainOverlay;
