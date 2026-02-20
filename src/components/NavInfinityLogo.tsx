import { useEffect, useRef } from "react";

const NavInfinityLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = 56;
    const h = 44;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const draw = () => {
      timeRef.current += 0.012;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scaleX = 20;
      const scaleY = 18;

      // Glow layers
      const layers = [
        { alpha: 0.1, width: 12, blur: 8 },
        { alpha: 0.2, width: 6, blur: 4 },
        { alpha: 0.5, width: 3, blur: 2 },
        { alpha: 1, width: 1.2, blur: 0 },
      ];

      for (const layer of layers) {
        ctx.save();
        ctx.globalAlpha = layer.alpha;
        if (layer.blur > 0) ctx.filter = `blur(${layer.blur}px)`;

        const grad = ctx.createLinearGradient(cx - scaleX, cy, cx + scaleX, cy);
        const hue1 = (t * 50) % 360;
        const hue2 = (hue1 + 60) % 360;
        const hue3 = (hue1 + 180) % 360;
        grad.addColorStop(0, `hsl(${hue1}, 85%, 65%)`);
        grad.addColorStop(0.5, `hsl(${hue2}, 90%, 60%)`);
        grad.addColorStop(1, `hsl(${hue3}, 85%, 65%)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = layer.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const denom = 1 + Math.sin(angle) * Math.sin(angle);
          let x = (Math.cos(angle) / denom) * scaleX;
          let y = (Math.sin(angle) * Math.cos(angle) / denom) * scaleY;
          x += Math.sin(angle * 3 + t * 3) * 1.2;
          y += Math.cos(angle * 2 + t * 2) * 0.8;

          if (i === 0) ctx.moveTo(cx + x, cy + y);
          else ctx.lineTo(cx + x, cy + y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // A few sparkles on the path
      for (let i = 0; i < 5; i++) {
        const angle = ((i / 5) * Math.PI * 2 + t * 1.5) % (Math.PI * 2);
        const denom = 1 + Math.sin(angle) * Math.sin(angle);
        const x = cx + (Math.cos(angle) / denom) * scaleX;
        const y = cy + (Math.sin(angle) * Math.cos(angle) / denom) * scaleY;
        const sparkleAlpha = Math.sin(t * 3 + i * 1.5) * 0.5 + 0.5;
        const hue = (t * 60 + i * 72) % 360;

        ctx.save();
        ctx.globalAlpha = sparkleAlpha * 0.8;
        ctx.fillStyle = `hsl(${hue}, 90%, 80%)`;
        ctx.shadowColor = `hsl(${hue}, 100%, 75%)`;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-14 h-11"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default NavInfinityLogo;
