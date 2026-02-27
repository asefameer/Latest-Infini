import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Image as ImageIcon, Film } from 'lucide-react';
import { toast } from 'sonner';

// ── Infinity logo drawing function (shared between static & animated) ──
function drawInfinityLogo(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  bgColor?: string,
) {
  ctx.clearRect(0, 0, w, h);
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) / 2.8;
  const scaleX = scale;
  const scaleY = scale * 0.85;

  const layers = [
    { alpha: 0.1, width: scale * 0.35, blur: scale * 0.22 },
    { alpha: 0.2, width: scale * 0.16, blur: scale * 0.12 },
    { alpha: 0.5, width: scale * 0.08, blur: scale * 0.05 },
    { alpha: 1, width: scale * 0.035, blur: 0 },
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
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const denom = 1 + Math.sin(angle) * Math.sin(angle);
      let x = (Math.cos(angle) / denom) * scaleX;
      let y = ((Math.sin(angle) * Math.cos(angle)) / denom) * scaleY;
      x += Math.sin(angle * 3 + t * 3) * (scale * 0.06);
      y += Math.cos(angle * 2 + t * 2) * (scale * 0.04);
      if (i === 0) ctx.moveTo(cx + x, cy + y);
      else ctx.lineTo(cx + x, cy + y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Sparkles
  for (let i = 0; i < 8; i++) {
    const angle = ((i / 8) * Math.PI * 2 + t * 1.5) % (Math.PI * 2);
    const denom = 1 + Math.sin(angle) * Math.sin(angle);
    const x = cx + (Math.cos(angle) / denom) * scaleX;
    const y = cy + ((Math.sin(angle) * Math.cos(angle)) / denom) * scaleY;
    const sparkleAlpha = Math.sin(t * 3 + i * 1.5) * 0.5 + 0.5;
    const hue = (t * 60 + i * 45) % 360;

    ctx.save();
    ctx.globalAlpha = sparkleAlpha * 0.8;
    ctx.fillStyle = `hsl(${hue}, 90%, 80%)`;
    ctx.shadowColor = `hsl(${hue}, 100%, 75%)`;
    ctx.shadowBlur = scale * 0.06;
    ctx.beginPath();
    ctx.arc(x, y, scale * 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ── Preview canvas ──
const LogoPreview = ({
  size,
  bgColor,
}: {
  size: number;
  bgColor: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    const draw = () => {
      timeRef.current += 0.012;
      drawInfinityLogo(ctx, size, size, timeRef.current, bgColor === 'transparent' ? undefined : bgColor);
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: Math.min(size, 400),
        height: Math.min(size, 400),
        background: bgColor === 'transparent'
          ? 'repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px'
          : bgColor,
        borderRadius: '0.75rem',
      }}
    />
  );
};

const LogoExport = () => {
  const [resolution, setResolution] = useState('1024');
  const [bgColor, setBgColor] = useState('#000000');
  const [exportingPng, setExportingPng] = useState(false);
  const [exportingGif, setExportingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);

  const size = parseInt(resolution);

  const downloadPng = useCallback(() => {
    setExportingPng(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      // Draw at a nice frame (t = 1.5 gives a good color spread)
      drawInfinityLogo(ctx, size, size, 1.5, bgColor === 'transparent' ? undefined : bgColor);
      const link = document.createElement('a');
      link.download = `infinity-logo-${size}x${size}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success(`PNG downloaded (${size}×${size})`);
    } catch (err) {
      toast.error('Failed to export PNG');
    } finally {
      setExportingPng(false);
    }
  }, [size, bgColor]);

  const downloadGif = useCallback(async () => {
    setExportingGif(true);
    setGifProgress(0);
    try {
      // Dynamically import gif.js
      const GIF = (await import('gif.js')).default;

      const gifSize = Math.min(size, 512); // GIFs get very large above 512
      const frames = 60; // ~2 seconds at 30fps
      const delay = 33; // ms per frame

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: gifSize,
        height: gifSize,
        workerScript: '/gif.worker.js',
        transparent: bgColor === 'transparent' ? 0x000000 : undefined,
      });

      const canvas = document.createElement('canvas');
      canvas.width = gifSize;
      canvas.height = gifSize;
      const ctx = canvas.getContext('2d')!;

      for (let i = 0; i < frames; i++) {
        const t = (i / frames) * ((Math.PI * 2) / 1.5) + 0.5;
        ctx.clearRect(0, 0, gifSize, gifSize);
        drawInfinityLogo(ctx, gifSize, gifSize, t, bgColor === 'transparent' ? undefined : bgColor);
        gif.addFrame(ctx, { copy: true, delay });
        setGifProgress(Math.round(((i + 1) / frames) * 50));
      }

      gif.on('progress', (p: number) => setGifProgress(50 + Math.round(p * 50)));
      gif.on('finished', (blob: Blob) => {
        const link = document.createElement('a');
        link.download = `infinity-logo-${gifSize}x${gifSize}.gif`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success(`GIF downloaded (${gifSize}×${gifSize}, ${frames} frames)`);
        setExportingGif(false);
        setGifProgress(0);
      });

      gif.render();
    } catch (err: any) {
      console.error(err);
      toast.error('GIF export failed — see console for details');
      setExportingGif(false);
      setGifProgress(0);
    }
  }, [size, bgColor]);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">Logo Export</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Download the Infinity logo as a high-resolution PNG or animated GIF for documentation, branding, and more.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-border p-4 bg-card">
            <LogoPreview size={size} bgColor={bgColor} />
          </div>
          <span className="text-xs text-muted-foreground">
            Live preview at {size}×{size}px
          </span>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold text-foreground">Export Settings</h2>

            <div className="space-y-2">
              <Label>Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="256">256 × 256</SelectItem>
                  <SelectItem value="512">512 × 512</SelectItem>
                  <SelectItem value="1024">1024 × 1024</SelectItem>
                  <SelectItem value="2048">2048 × 2048</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Background</Label>
              <Select value={bgColor} onValueChange={setBgColor}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="#000000">Black</SelectItem>
                  <SelectItem value="#0a0a0a">Near Black (#0a0a0a)</SelectItem>
                  <SelectItem value="#111111">Dark Grey (#111)</SelectItem>
                  <SelectItem value="#ffffff">White</SelectItem>
                  <SelectItem value="transparent">Transparent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={downloadPng}
              disabled={exportingPng}
              className="w-full gap-2"
              size="lg"
            >
              {exportingPng ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              Download PNG ({size}×{size})
            </Button>

            <Button
              onClick={downloadGif}
              disabled={exportingGif}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              {exportingGif ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating GIF… {gifProgress}%
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  Download Animated GIF ({Math.min(size, 512)}×{Math.min(size, 512)})
                </>
              )}
            </Button>
            {size > 512 && (
              <p className="text-xs text-muted-foreground text-center">
                GIF is capped at 512×512 to keep file size reasonable
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoExport;
