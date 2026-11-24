"use client";
import { useEffect, useRef, useState } from "react";
import type { ProjectVisualType } from "@/data/projects";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+<>[]";

/**
 * Active Theory–style character scramble decode text (hydration-safe: renders plain text on SSR,
 * scrambles in useEffect when `text` changes).
 */
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
    const totalFrames = 18;
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
          next += GLYPHS[(i * 7 + frame * 13) % GLYPHS.length];
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

const COUNT = 640;

function buildSculpture(kind: ProjectVisualType): TargetPoint[] {
  const pts: TargetPoint[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const u = i / COUNT;

    if (kind === "globe") {
      // 3D Earth Sphere + Tilted Orbital Ring
      if (i < 460) {
        const t = i / 460;
        const y = 1 - t * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        const R = 1.02;
        const accent = i % 7 === 0;
        pts.push({
          x: Math.cos(theta) * rad * R,
          y: y * R,
          z: Math.sin(theta) * rad * R,
          r: accent ? 52 : 0,
          g: accent ? 211 : 217,
          b: accent ? 153 : 255,
        });
      } else {
        const idx = i - 460;
        const ang = (idx / (COUNT - 460)) * Math.PI * 2;
        const ringR = 1.48 + ((idx % 3) - 1) * 0.04;
        const rx = Math.cos(ang) * ringR;
        const rz = Math.sin(ang) * ringR;
        const tilt = 0.46;
        pts.push({
          x: rx,
          y: rz * Math.sin(tilt),
          z: rz * Math.cos(tilt),
          r: 125,
          g: 211,
          b: 252,
        });
      }
    } else if (kind === "audio") {
      // Video 1 (00:03): Glowing Quantum Torus Donut with Harmonic Sound Ripples
      const major = (u * Math.PI * 2 * 13) % (Math.PI * 2);
      const minor = u * Math.PI * 2;
      const wave = 0.08 * Math.sin(major * 6);
      const R = 1.0 + wave;
      const r = 0.42;
      const x = (R + r * Math.cos(minor)) * Math.cos(major);
      const y = (R + r * Math.cos(minor)) * Math.sin(major);
      const z = r * Math.sin(minor);
      const spark = i % 9 === 0;
      pts.push({
        x,
        y,
        z,
        r: spark ? 251 : i % 2 === 0 ? 167 : 0,
        g: spark ? 191 : i % 2 === 0 ? 139 : 217,
        b: spark ? 36 : i % 2 === 0 ? 250 : 255,
      });
    } else if (kind === "techgear") {
      // Video 1 (00:00): Cyber Double-Helix Spine + Energy Core
      if (i < 500) {
        const strand = i % 2 === 0 ? 0 : Math.PI;
        const t = (i / 500) * 2.7 - 1.35;
        const ang = t * 3.4 + strand;
        const rad = 0.72;
        const isRung = i % 10 === 0;
        const rungFactor = isRung ? ((i % 20) / 10 - 1) * 0.8 : 1;
        pts.push({
          x: Math.cos(ang) * rad * rungFactor,
          y: t,
          z: Math.sin(ang) * rad * rungFactor,
          r: isRung ? 255 : 59,
          g: isRung ? 46 : 165,
          b: isRung ? 136 : 255,
        });
      } else {
        const idx = i - 500;
        const ang = golden * idx * 4;
        const y = (idx / 140) * 2.6 - 1.3;
        const rad = 1.18 + (idx % 4) * 0.08;
        pts.push({
          x: Math.cos(ang) * rad,
          y,
          z: Math.sin(ang) * rad,
          r: 0,
          g: 217,
          b: 255,
        });
      }
    } else if (kind === "planto") {
      // 3D Bioluminescent Fibonacci Lotus Vortex
      const r = Math.sqrt(u) * 1.35;
      const theta = i * golden;
      const petal = Math.sin(theta * 5) * 0.18 * u;
      const y = Math.cos(u * Math.PI) * 0.65 + petal;
      pts.push({
        x: Math.cos(theta) * (r + petal),
        y,
        z: Math.sin(theta) * (r + petal),
        r: i % 5 === 0 ? 0 : 52,
        g: i % 5 === 0 ? 217 : 211,
        b: i % 5 === 0 ? 255 : 153,
      });
    } else {
      // Video 1 (00:05-00:06): 3D Infinity Ribbon / Lemniscate Portal + Gold Sparks
      if (i < 510) {
        const t = (i / 510) * Math.PI * 2;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const spread = (((i * 17) % 11) - 5) * 0.032;
        const x = (1.48 * Math.cos(t)) / denom;
        const y = (1.48 * Math.sin(t) * Math.cos(t)) / denom + spread;
        const z = Math.sin(t * 2) * 0.45 + spread;
        pts.push({
          x,
          y,
          z,
          r: i % 6 === 0 ? 251 : 56,
          g: i % 6 === 0 ? 191 : 189,
          b: i % 6 === 0 ? 36 : 248,
        });
      } else {
        const idx = i - 510;
        const theta = golden * idx * 6;
        const y = (idx / 130) * 2.4 - 1.2;
        const rad = 1.35;
        pts.push({
          x: Math.cos(theta) * rad,
          y,
          z: Math.sin(theta) * rad,
          r: 224,
          g: 242,
          b: 254,
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
    burstRef.current = 1; // Trigger vortex morph energy burst
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
    const initial = SCULPTURE_CACHE[visualRef.current];
    const state = initial.map((p) => ({ ...p }));

    let rotY = 0;
    let rotX = 0.18;
    let mouseX = 0;
    let mouseY = 0;
    let visible = true;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
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

      // Position sculpture centered in the left/center vista on wide screens
      const isWide = w / dpr >= 1024;
      const cx = w * (isWide ? 0.31 : 0.5);
      const cy = h * 0.48;
      const baseScale = Math.min(w * (isWide ? 0.22 : 0.34), h * 0.32);

      // Soft volumetric core nebula behind sculpture
      const targetSample = SCULPTURE_CACHE[visualRef.current][0];
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseScale * 1.65);
      glow.addColorStop(
        0,
        `rgba(${targetSample.r}, ${targetSample.g}, ${targetSample.b}, 0.22)`
      );
      glow.addColorStop(0.45, "rgba(59, 130, 246, 0.07)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      burstRef.current *= 0.94;
      const burst = burstRef.current;

      if (!reduce) {
        rotY += 0.0065 + burst * 0.055;
      }
      const targetTiltX = 0.18 + mouseY * 0.25;
      const targetTiltY = rotY + mouseX * 0.35;
      rotX += (targetTiltX - rotX) * 0.06;

      const cosY = Math.cos(targetTiltY);
      const sinY = Math.sin(targetTiltY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const targets = SCULPTURE_CACHE[visualRef.current];
      const fov = 3.4;

      for (let i = 0; i < COUNT; i++) {
        const s = state[i];
        const t = targets[i];

        // Vortex swirl offset during morph transitions
        const swirl = burst * 0.42;
        const tx = t.x * Math.cos(swirl) - t.z * Math.sin(swirl);
        const tz = t.x * Math.sin(swirl) + t.z * Math.cos(swirl);

        const lerp = reduce ? 0.35 : 0.075;
        s.x += (tx - s.x) * lerp;
        s.y += (t.y - s.y) * lerp;
        s.z += (tz - s.z) * lerp;
        s.r += (t.r - s.r) * 0.08;
        s.g += (t.g - s.g) * 0.08;
        s.b += (t.b - s.b) * 0.08;

        // 3D rotation (Y then X)
        const x1 = s.x * cosY - s.z * sinY;
        const z1 = s.x * sinY + s.z * cosY;
        const y2 = s.y * cosX - z1 * sinX;
        const z2 = s.y * sinX + z1 * cosX;

        const depth = fov / (fov + z2 + 1.8);
        const sx = cx + x1 * baseScale * depth;
        const sy = cy + y2 * baseScale * depth;

        const alpha = Math.max(0.12, Math.min(0.95, (depth - 0.42) * 1.8));
        const size = Math.max(1.1, depth * 2.5) * dpr;

        const rr = Math.round(s.r);
        const gg = Math.round(s.g);
        const bb = Math.round(s.b);

        if (depth > 0.72 && i % 4 === 0) {
          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha * 0.22})`;
          ctx.fillRect(sx - size * 1.2, sy - size * 1.2, size * 3.4, size * 3.4);
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
