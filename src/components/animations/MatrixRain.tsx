"use client";
import { useEffect, useRef } from "react";

/* katakana + hex city-rain, cyan with rare neon-magenta columns */
const GLYPHS = "アカサタナハマヤラワンイキシリヌフメエケセヘネモヤユヨラリルレ0123456789<>/\\*+";

export default function MatrixRain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 18;
    let raf = 0;
    let w = 0, h = 0;
    let drops: number[] = [];
    let magenta: number[] = [];
    let visible = true;

    const resize = () => {
      // dpr fixed at 1 — ambient rain doesn't need retina, halves the fill cost
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w));
      canvas.height = Math.max(1, Math.floor(h));
      const cols = Math.max(1, Math.floor(w / CELL));
      drops = Array.from({ length: cols }, () => Math.random() * (h / CELL));
      magenta = Array.from({ length: cols }, () => (Math.random() < 0.06 ? 1 : 0));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#05070D";
      ctx.fillRect(0, 0, w, h);
    };

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      if (t - last < 80) return; // throttle ~12fps — dreamy and nearly free
      last = t;
      ctx.fillStyle = "rgba(5,7,13,0.26)"; // translucent wash = trailing tails
      ctx.fillRect(0, 0, w, h);
      ctx.font = "12px ui-monospace, monospace";
      for (let i = 0; i < drops.length; i++) {
        const x = i * CELL;
        const y = drops[i] * CELL;
        ctx.fillStyle = magenta[i] ? "rgba(255,46,136,0.85)" : "rgba(155,234,255,0.9)";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
        drops[i] += 1;
        if (y > h && Math.random() > 0.972) drops[i] = 0;
      }
    };

    resize();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 z-0 ${className}`} />;
}
