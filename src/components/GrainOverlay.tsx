import { useEffect, useRef } from "react";

const TILE_SIZE = 256; // Small tile, repeated across viewport

const GrainOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tileRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Pre-generate a single noise tile once
    const tile = ctx.createImageData(TILE_SIZE, TILE_SIZE);
    const data = tile.data;
    const intensity = Math.round(0.03 * 255);
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = intensity;
    }
    tileRef.current = tile;

    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // Each frame, stamp the pre-generated tile at random offsets for variation
    const draw = () => {
      if (!tileRef.current) return;
      ctx.clearRect(0, 0, w, h);

      // Random offset gives illusion of new noise each frame
      const ox = Math.random() * TILE_SIZE | 0;
      const oy = Math.random() * TILE_SIZE | 0;

      for (let y = -oy; y < h; y += TILE_SIZE) {
        for (let x = -ox; x < w; x += TILE_SIZE) {
          ctx.putImageData(tileRef.current, x, y);
        }
      }

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
