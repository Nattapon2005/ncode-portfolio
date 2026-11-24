"use client";
import { useEffect, useRef, useState } from "react";
import type { ProjectVisualType } from "@/data/projects";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+<>[]";

export function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setDisplay(text));
      return () => cancelAnimationFrame(id);
    }

    let frame = 0;
    const totalFrames = 20;
    let raf = 0;

    const tick = () => {
      frame++;
      const progress = frame / totalFrames;
      const locked = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || i < locked) {
          next += ch;
        } else {
          next += GLYPHS[(i * 11 + frame * 17) % GLYPHS.length];
        }
      }
      setDisplay(next);
      if (frame < totalFrames) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return <span className={className}>{display}</span>;
}

interface TargetPoint {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
}

const COUNT = 1120;

function buildSculpture(kind: ProjectVisualType): TargetPoint[] {
  const pts: TargetPoint[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const u = i / COUNT;
    const jitter = (((i * 29) % 19) - 9) * 0.012;

    if (kind === "globe") {
      // Video 1: Central Particle Spine + 3D Orbital Earth & Tilted Ring
      if (i < 620) {
        const t = i / 620;
        const y = 1 - t * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        const R = 1.05 + jitter;
        const magenta = i % 11 === 0;
        const mint = i % 5 === 0;
        pts.push({
          x: Math.cos(theta) * rad * R,
          y: y * R,
          z: Math.sin(theta) * rad * R,
          r: magenta ? 217 : mint ? 52 : 0,
          g: magenta ? 70 : mint ? 211 : 217,
          b: magenta ? 239 : mint ? 153 : 255,
        });
      } else if (i < 900) {
        // Towering vertical energy spine (Active Theory 00:00 signature!)
        const idx = i - 620;
        const v = (idx / 280) * 3.4 - 1.7;
        const twist = v * 5.2 + (idx % 3) * 2.1;
        const spineR = 0.24 + Math.abs(v) * 0.14 + jitter;
        pts.push({
          x: Math.cos(twist) * spineR,
          y: v,
          z: Math.sin(twist) * spineR,
          r: idx % 2 === 0 ? 192 : 0,
          g: idx % 2 === 0 ? 132 : 240,
          b: 252,
        });
      } else {
        const idx = i - 900;
        const ang = (idx / (COUNT - 900)) * Math.PI * 2;
        const ringR = 1.62 + ((idx % 4) - 1.5) * 0.035;
        const rx = Math.cos(ang) * ringR;
        const rz = Math.sin(ang) * ringR;
        pts.push({
          x: rx,
          y: rz * Math.sin(0.42),
          z: rz * Math.cos(0.42),
          r: 125,
          g: 211,
          b: 252,
        });
      }
    } else if (kind === "audio") {
      // Video 1 (00:03): Quantum Torus Chamber + Hanging Filaments
      if (i < 840) {
        const t = i / 840;
        const major = (t * Math.PI * 2 * 19) % (Math.PI * 2);
        const minor = t * Math.PI * 2;
        const R = 1.08 + 0.09 * Math.sin(major * 5);
        const r = 0.44 + jitter;
        pts.push({
          x: (R + r * Math.cos(minor)) * Math.cos(major),
          y: (R + r * Math.cos(minor)) * Math.sin(major),
          z: r * Math.sin(minor),
          r: i % 7 === 0 ? 251 : i % 2 === 0 ? 168 : 0,
          g: i % 7 === 0 ? 191 : i % 2 === 0 ? 85 : 217,
          b: i % 7 === 0 ? 36 : i % 2 === 0 ? 247 : 255,
        });
      } else {
        // Surrounding chamber pillars & stardust
        const idx = i - 840;
        const ang = (idx % 8) * (Math.PI / 4) + jitter;
        const y = ((idx / 280) * 3.0 - 1.5);
        const rad = 1.65 + Math.sin(y * 2) * 0.15;
        pts.push({
          x: Math.cos(ang) * rad,
          y,
          z: Math.sin(ang) * rad,
          r: 251,
          g: 191,
          b: 36,
        });
      }
    } else if (kind === "techgear") {
      // Video 1 (00:04): Interlocking Gyroscope Rings + Central Reactor Spine
      if (i < 420) {
        const ang = (i / 420) * Math.PI * 2;
        const r = 1.35 + ((i % 5) - 2) * 0.04;
        pts.push({
          x: Math.cos(ang) * r,
          y: Math.sin(ang) * r * Math.cos(0.35),
          z: Math.sin(ang) * r * Math.sin(0.35),
          r: 0,
          g: 217,
          b: 255,
        });
      } else if (i < 840) {
        const idx = i - 420;
        const ang = (idx / 420) * Math.PI * 2;
        const r = 1.12 + ((idx % 5) - 2) * 0.04;
        pts.push({
          x: Math.cos(ang) * r * Math.cos(1.1),
          y: Math.sin(ang) * r,
          z: Math.cos(ang) * r * Math.sin(1.1),
          r: idx % 4 === 0 ? 244 : 59,
          g: idx % 4 === 0 ? 114 : 130,
          b: idx % 4 === 0 ? 182 : 246,
        });
      } else {
        const idx = i - 840;
        const y = (idx / 280) * 3.2 - 1.6;
        const ang = golden * idx * 3;
        const r = 0.35 + Math.abs(Math.sin(y * 3)) * 0.22;
        pts.push({
          x: Math.cos(ang) * r,
          y,
          z: Math.sin(ang) * r,
          r: 125,
          g: 211,
          b: 252,
        });
      }
    } else if (kind === "planto") {
      // Video 1 (00:00-00:01): Towering Twisted Bio-Nebula Vortex Column
      const y = u * 3.4 - 1.7;
      const branch = i % 3;
      const theta = y * 3.6 + branch * ((Math.PI * 2) / 3) + jitter * 4;
      const flare = 0.32 + Math.pow(Math.abs(y) * 0.65, 1.4) + ((i % 7) * 0.06);
      const isPink = i % 6 === 0;
      pts.push({
        x: Math.cos(theta) * flare,
        y,
        z: Math.sin(theta) * flare,
        r: isPink ? 217 : i % 3 === 0 ? 0 : 52,
        g: isPink ? 70 : i % 3 === 0 ? 217 : 211,
        b: isPink ? 239 : i % 3 === 0 ? 255 : 153,
      });
    } else {
      // Video 1 (00:05-00:06): Glowing 3D Figure-8 Infinity Ribbon + Gold Stardust
      if (i < 820) {
        const t = (i / 820) * Math.PI * 2;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const widthOffset = (((i * 19) % 13) - 6) * 0.025;
        const x = (1.62 * Math.sin(t) * Math.cos(t)) / denom + widthOffset;
        const y = (1.42 * Math.cos(t)) / denom;
        const z = Math.sin(t * 2) * 0.52 + widthOffset;
        const gold = i % 5 === 0;
        pts.push({
          x,
          y,
          z,
          r: gold ? 251 : 56,
          g: gold ? 191 : 189,
          b: gold ? 36 : 248,
        });
      } else {
        const idx = i - 820;
        const theta = golden * idx * 5;
        const y = (idx / 300) * 3.0 - 1.5;
        const rad = 1.2 + ((idx * 13) % 10) * 0.08;
        pts.push({
          x: Math.cos(theta) * rad,
          y,
          z: Math.sin(theta) * rad,
          r: idx % 2 === 0 ? 251 : 186,
          g: idx % 2 === 0 ? 191 : 230,
          b: idx % 2 === 0 ? 36 : 253,
        });
      }
    }
  }

  return pts;
}

const SCULPTURE_CACHE: Record<ProjectVisualType, TargetPoint[]> = {
  globe: buildSculpture("globe"),
  audio: buildSculpture("audio"),
  techgear: buildSculpture("techgear"),
  planto: buildSculpture("planto"),
  outdoors: buildSculpture("outdoors"),
};

export default function ParticleMorphCanvas({
  visual,
  className = "",
}: {
  visual: ProjectVisualType;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualRef = useRef<ProjectVisualType>(visual);
  const burstRef = useRef(0);

  useEffect(() => {
    visualRef.current = visual;
    burstRef.current = 1;
  }, [visual]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = SCULPTURE_CACHE[visualRef.current].map((p) => ({ ...p }));

    let rotY = 0;
    let rotX = 0.14;
    let mouseX = 0;
    let mouseY = 0;
    let visible = true;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = () => {
      if (!visible) {
        raf = 0;
        return;
      }

      const w = cv.width;
      const h = cv.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.49;
      const baseScale = Math.min(w * 0.28, h * 0.34);

      // Central cosmic nebula glow (Cyan + Violet + Deep Space)
      const sample = SCULPTURE_CACHE[visualRef.current][0];
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseScale * 2.1);
      glow.addColorStop(0, `rgba(${sample.r}, ${sample.g}, ${sample.b}, 0.24)`);
      glow.addColorStop(0.38, "rgba(139, 92, 246, 0.11)");
      glow.addColorStop(0.75, "rgba(0, 217, 255, 0.04)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      burstRef.current *= 0.93;
      const burst = burstRef.current;

      if (!reduce) {
        rotY += 0.0055 + burst * 0.065;
      }
      const targetTiltX = 0.12 + mouseY * 0.22;
      const targetTiltY = rotY + mouseX * 0.38;
      rotX += (targetTiltX - rotX) * 0.06;

      const cosY = Math.cos(targetTiltY);
      const sinY = Math.sin(targetTiltY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const targets = SCULPTURE_CACHE[visualRef.current];
      const fov = 3.5;

      for (let i = 0; i < COUNT; i++) {
        const s = state[i];
        const t = targets[i];

        // Explosive radial shockwave + vortex swirl during morph
        const expand = 1 + burst * (0.45 + (i % 5) * 0.12);
        const swirl = burst * 0.55;
        const tx = (t.x * Math.cos(swirl) - t.z * Math.sin(swirl)) * expand;
        const ty = t.y * (1 + burst * 0.22);
        const tz = (t.x * Math.sin(swirl) + t.z * Math.cos(swirl)) * expand;

        const lerp = reduce ? 0.35 : 0.072;
        s.x += (tx - s.x) * lerp;
        s.y += (ty - s.y) * lerp;
        s.z += (tz - s.z) * lerp;
        s.r += (t.r - s.r) * 0.08;
        s.g += (t.g - s.g) * 0.08;
        s.b += (t.b - s.b) * 0.08;

        const x1 = s.x * cosY - s.z * sinY;
        const z1 = s.x * sinY + s.z * cosY;
        const y2 = s.y * cosX - z1 * sinX;
        const z2 = s.y * sinX + z1 * cosX;

        const depth = fov / (fov + z2 + 1.85);
        const sx = cx + x1 * baseScale * depth;
        const sy = cy + y2 * baseScale * depth;

        const alpha = Math.max(0.14, Math.min(0.96, (depth - 0.38) * 1.85));
        const size = Math.max(1.0, depth * 2.35) * dpr;

        const rr = Math.round(s.r);
        const gg = Math.round(s.g);
        const bb = Math.round(s.b);

        if (depth > 0.7 && i % 5 === 0) {
          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha * 0.24})`;
          ctx.fillRect(sx - size * 1.3, sy - size * 1.3, size * 3.6, size * 3.6);
        }
        ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
        ctx.fillRect(sx, sy, size, size);
      }

      if (!reduce) {
        raf = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) draw();
      },
      { threshold: 0.02 }
    );
    io.observe(cv);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none h-full w-full ${className}`}
    />
  );
}
