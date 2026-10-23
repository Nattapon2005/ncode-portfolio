"use client";

/* ============================================================================
 *  CyberAquaticCreature.tsx
 *  Procedural, retro-cyberpunk pixel-art swimmer for React / Next.js (TS).
 *
 *  creature = "shark" | "koi" | "whale" | "manta" | "jellyfish"
 *
 *  Usage (parent must be position: relative / absolute / fixed):
 *    <section className="relative h-[70vh]">
 *      <CyberAquaticCreature creature="shark" />
 *      ...your content...
 *    </section>
 *
 *  - No sprites / GIF / video: everything is fillRect() pixel blocks.
 *  - Spine: 20-24 joint chain, distance + bend-angle constraints (FK follow
 *    chain) driven by a steering head, plus travelling-wave undulation whose
 *    amplitude grows toward the tail (with a 2nd harmonic for the whip).
 *  - Loop is fully cancelled (cancelAnimationFrame) when off-screen or when the
 *    tab is hidden (IntersectionObserver + visibilitychange).
 *  - pointer-events: none, no shadowBlur; glow = CSS drop-shadow on the canvas.
 * ========================================================================== */

import React, { useEffect, useRef } from "react";

/* ───────────────────────────── Public API ───────────────────────────────── */

export type CreatureKind =
  | "shark"
  | "white_shark"
  | "black_shark"
  | "orca"
  | "whale"
  | "koi"
  | "manta"
  | "jellyfish";

export interface CyberAquaticCreatureProps {
  creature?: CreatureKind;
  /** Size of one pixel block in CSS px (2–8). Default 4. */
  pixelSize?: number;
  /** Creature size multiplier on top of automatic responsive scaling. */
  scale?: number;
  /** Floating ASCII matrix grid (+ · x). */
  showGrid?: boolean;
  /** Cavitation bubble wake (✦ * o). */
  showBubbles?: boolean;
  /** CSS drop-shadow glow on the canvas container (cheap, no shadowBlur). */
  glow?: boolean;
  /** CSS background of the wrapper. Use "transparent" to blend with your page. */
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_BG =
  "linear-gradient(180deg, #020611 0%, #041326 58%, #020a17 100%)";

/* ───────────────────────────── Types & data ─────────────────────────────── */

type SpineKind = Exclude<CreatureKind, "jellyfish">;

interface Palette {
  dorsal: string;
  dorsalHi: string;
  mid: string;
  belly: string;
  bellyHi: string;
  pearl: string;
  fin: string;
  finEdge: string;
  line: string;
  lineDim: string;
}

interface SpineSpec {
  view: "side" | "top";
  joints: number;
  segLen: number; // px at scale 1
  speed: number; // px/s at scale 1
  maxTurn: number; // rad/s
  maxBend: number; // rad between neighbouring segments
  beat: number; // tail beat rad/s
  freq: number; // wave phase lag per joint (rad)
  amp: number; // tail amplitude as fraction of body length
  flap?: number; // wing-flap width modulation (manta)
  profile: [number, number][]; // [t, halfWidth / bodyLength]
  pal: Palette;
  dorsalFin?: { t: number; len: number; h: number; sweep: number };
  pectoral?: { t: number; len: number; span: number; sweep: number };
  tail: { kind: "hetero" | "fan" | "fluke" | "whip"; size: number };
  gills?: number[];
  eyeT: number;
  eyeOff: number; // + dorsal, - ventral (fraction of half width)
  lineStyle: "circuit" | "dots";
  mouth?: { a: number; b: number; off: number; teeth: boolean };
  patches?: boolean;
  grooves?: boolean;
}

const PAL_SHARK: Palette = {
  dorsal: "#0a1230",
  dorsalHi: "#14275c",
  mid: "#2b4f8f",
  belly: "#bfe4ee",
  bellyHi: "#f3fdff",
  pearl: "#d3c6f7",
  fin: "#0d1a42",
  finEdge: "#21408a",
  line: "#00F0FF",
  lineDim: "#0b8aa3",
};

const PAL_WHITE_SHARK: Palette = {
  // Great White Shark (ฉลามขาว - Slate Grey / Metallic Silver / Pure Crisp White Belly / Ice Blue Circuit)
  dorsal: "#334155",
  dorsalHi: "#475569",
  mid: "#94a3b8",
  belly: "#f1f5f9",
  bellyHi: "#ffffff",
  pearl: "#e2e8f0",
  fin: "#1e293b",
  finEdge: "#64748b",
  line: "#38bdf8",
  lineDim: "#0284c7",
};

const PAL_BLACK_SHARK: Palette = {
  // Obsidian Cyber Shark (ฉลามกาฬ/ฉลามทมิฬ - Pitch Black / Charcoal / Blood Neon Crimson Circuit)
  dorsal: "#030408",
  dorsalHi: "#0c0d16",
  mid: "#181a26",
  belly: "#242738",
  bellyHi: "#373a4d",
  pearl: "#ff2a5f",
  fin: "#06070c",
  finEdge: "#1e2133",
  line: "#ff0055",
  lineDim: "#88002d",
};

const PAL_ORCA: Palette = {
  // Orca / Killer Whale (วาฬเพชฌฆาต - Inky Black / Striking White Saddle & Belly)
  dorsal: "#05070e",
  dorsalHi: "#0f1524",
  mid: "#1b2438",
  belly: "#f8fafc",
  bellyHi: "#ffffff",
  pearl: "#e0f2fe",
  fin: "#05070e",
  finEdge: "#1e293b",
  line: "#00F0FF",
  lineDim: "#0b8aa3",
};

const PAL_WHALE: Palette = {
  dorsal: "#091a33",
  dorsalHi: "#163560",
  mid: "#2a5584",
  belly: "#a4bfd0",
  bellyHi: "#dcecf4",
  pearl: "#c8c2ea",
  fin: "#0c2142",
  finEdge: "#245089",
  line: "#00F0FF",
  lineDim: "#0b8aa3",
};

const PAL_KOI: Palette = {
  dorsal: "#e8480f",
  dorsalHi: "#ff7a2e",
  mid: "#ffb066",
  belly: "#fff0dc",
  bellyHi: "#ffffff",
  pearl: "#ffd9ec",
  fin: "#ff8a45",
  finEdge: "#ffd2a3",
  line: "#00F0FF",
  lineDim: "#0b8aa3",
};

const PAL_KOI_WHITE: Palette = {
  ...PAL_KOI,
  dorsal: "#e9efff",
  dorsalHi: "#f7f9ff",
  mid: "#ffffff",
};

const PAL_KOI_SUMI: Palette = {
  ...PAL_KOI,
  dorsal: "#14102a",
  dorsalHi: "#241c48",
  mid: "#3a2f6e",
};

const PAL_MANTA: Palette = {
  dorsal: "#0a1230",
  dorsalHi: "#16295e",
  mid: "#2f559a",
  belly: "#bfe4ee",
  bellyHi: "#f3fdff",
  pearl: "#d3c6f7",
  fin: "#0d1a42",
  finEdge: "#21408a",
  line: "#00F0FF",
  lineDim: "#0b8aa3",
};

const SPECS: Record<SpineKind, SpineSpec> = {
  shark: {
    view: "side",
    joints: 22,
    segLen: 13,
    speed: 95,
    maxTurn: 1.1,
    maxBend: 0.34,
    beat: 6.2,
    freq: 0.34,
    amp: 0.075,
    profile: [
      [0, 0], [0.02, 0.016], [0.06, 0.038], [0.14, 0.066], [0.26, 0.085],
      [0.4, 0.082], [0.55, 0.06], [0.7, 0.04], [0.82, 0.026], [0.9, 0.019],
      [1, 0.021],
    ],
    pal: PAL_SHARK,
    dorsalFin: { t: 0.33, len: 0.12, h: 0.11, sweep: 1.3 },
    pectoral: { t: 0.27, len: 0.07, span: 0.09, sweep: 0.16 },
    tail: { kind: "hetero", size: 0.17 },
    gills: [0.205, 0.232, 0.259],
    eyeT: 0.085,
    eyeOff: 0.25,
    lineStyle: "circuit",
    mouth: { a: 0.055, b: 0.19, off: 0.5, teeth: true },
  },
  white_shark: {
    // Great White Shark (ฉลามขาว - Powerful Apex Predator, Large Dorsal Fin & Razor Teeth)
    view: "side",
    joints: 24,
    segLen: 14,
    speed: 105,
    maxTurn: 1.2,
    maxBend: 0.35,
    beat: 6.5,
    freq: 0.35,
    amp: 0.08,
    profile: [
      [0, 0], [0.02, 0.02], [0.06, 0.045], [0.14, 0.075], [0.26, 0.095],
      [0.4, 0.09], [0.55, 0.065], [0.7, 0.045], [0.82, 0.028], [0.9, 0.02],
      [1, 0.022],
    ],
    pal: PAL_WHITE_SHARK,
    dorsalFin: { t: 0.32, len: 0.13, h: 0.135, sweep: 1.35 },
    pectoral: { t: 0.26, len: 0.08, span: 0.11, sweep: 0.18 },
    tail: { kind: "hetero", size: 0.19 },
    gills: [0.195, 0.22, 0.245, 0.27],
    eyeT: 0.085,
    eyeOff: 0.25,
    lineStyle: "circuit",
    mouth: { a: 0.05, b: 0.2, off: 0.52, teeth: true },
  },
  black_shark: {
    // Obsidian Cyber Shark (ฉลามกาฬ/ฉลามทมิฬ - Stealth & Aggressive, Crimson Neon Core)
    view: "side",
    joints: 22,
    segLen: 13,
    speed: 110,
    maxTurn: 1.3,
    maxBend: 0.36,
    beat: 6.8,
    freq: 0.36,
    amp: 0.082,
    profile: [
      [0, 0], [0.02, 0.016], [0.06, 0.038], [0.14, 0.068], [0.26, 0.088],
      [0.4, 0.084], [0.55, 0.06], [0.7, 0.04], [0.82, 0.026], [0.9, 0.019],
      [1, 0.021],
    ],
    pal: PAL_BLACK_SHARK,
    dorsalFin: { t: 0.34, len: 0.12, h: 0.12, sweep: 1.4 },
    pectoral: { t: 0.28, len: 0.075, span: 0.095, sweep: 0.17 },
    tail: { kind: "hetero", size: 0.18 },
    gills: [0.205, 0.232, 0.259],
    eyeT: 0.085,
    eyeOff: 0.25,
    lineStyle: "circuit",
    mouth: { a: 0.055, b: 0.19, off: 0.5, teeth: true },
  },
  orca: {
    // Orca / Killer Whale (วาฬเพชฌฆาต - Inky Black & White, Tall Dorsal Fin)
    view: "side",
    joints: 24,
    segLen: 15,
    speed: 82,
    maxTurn: 0.85,
    maxBend: 0.26,
    beat: 3.8,
    freq: 0.26,
    amp: 0.06,
    profile: [
      [0, 0.01], [0.04, 0.06], [0.12, 0.115], [0.28, 0.13], [0.46, 0.12],
      [0.65, 0.08], [0.8, 0.045], [0.9, 0.028], [1, 0.025],
    ],
    pal: PAL_ORCA,
    dorsalFin: { t: 0.42, len: 0.09, h: 0.16, sweep: 1.15 },
    pectoral: { t: 0.28, len: 0.09, span: 0.11, sweep: 0.12 },
    tail: { kind: "fluke", size: 0.16 },
    eyeT: 0.1,
    eyeOff: 0.2,
    lineStyle: "circuit",
    mouth: { a: 0.04, b: 0.22, off: 0.48, teeth: true },
  },
  koi: {
    view: "side",
    joints: 22,
    segLen: 11,
    speed: 62,
    maxTurn: 1.3,
    maxBend: 0.4,
    beat: 5.0,
    freq: 0.36,
    amp: 0.085,
    profile: [
      [0, 0.008], [0.04, 0.045], [0.12, 0.085], [0.3, 0.1], [0.5, 0.085],
      [0.7, 0.05], [0.85, 0.03], [1, 0.025],
    ],
    pal: PAL_KOI,
    dorsalFin: { t: 0.32, len: 0.28, h: 0.05, sweep: 1.0 },
    pectoral: { t: 0.2, len: 0.06, span: 0.08, sweep: 0.12 },
    tail: { kind: "fan", size: 0.22 },
    eyeT: 0.06,
    eyeOff: 0.3,
    lineStyle: "dots",
    patches: true,
  },
  whale: {
    view: "side",
    joints: 24,
    segLen: 16,
    speed: 48,
    maxTurn: 0.55,
    maxBend: 0.22,
    beat: 2.6,
    freq: 0.22,
    amp: 0.05,
    profile: [
      [0, 0.012], [0.03, 0.05], [0.1, 0.1], [0.25, 0.13], [0.45, 0.125],
      [0.65, 0.085], [0.8, 0.05], [0.9, 0.03], [1, 0.03],
    ],
    pal: PAL_WHALE,
    dorsalFin: { t: 0.62, len: 0.05, h: 0.035, sweep: 1.2 },
    pectoral: { t: 0.3, len: 0.1, span: 0.12, sweep: 0.14 },
    tail: { kind: "fluke", size: 0.13 },
    eyeT: 0.12,
    eyeOff: -0.15,
    lineStyle: "circuit",
    mouth: { a: 0.03, b: 0.3, off: 0.45, teeth: false },
    grooves: true,
  },
  manta: {
    view: "top",
    joints: 22,
    segLen: 10,
    speed: 70,
    maxTurn: 1.0,
    maxBend: 0.3,
    beat: 3.4,
    freq: 0.2,
    amp: 0.035,
    flap: 0.16,
    profile: [
      [0, 0.02], [0.05, 0.05], [0.12, 0.16], [0.22, 0.3], [0.3, 0.33],
      [0.38, 0.26], [0.48, 0.14], [0.56, 0.06], [0.64, 0.025], [1, 0.008],
    ],
    pal: PAL_MANTA,
    tail: { kind: "whip", size: 0 },
    eyeT: 0.07,
    eyeOff: 0.78,
    lineStyle: "circuit",
  },
};

/* ───────────────────────────── Math helpers ─────────────────────────────── */

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function angDiff(from: number, to: number): number {
  let d = (to - from) % TAU;
  if (d > Math.PI) d -= TAU;
  else if (d < -Math.PI) d += TAU;
  return d;
}

function sampleProfile(pts: [number, number][], t: number): number {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, w0] = pts[i - 1];
      const [t1, w1] = pts[i];
      return lerp(w0, w1, (t - t0) / (t1 - t0 || 1));
    }
  }
  return pts[pts.length - 1][1];
}

/* ───────────────────────────── Scene engine ─────────────────────────────── */

interface SceneOptions {
  creature: CreatureKind;
  pixelSize: number;
  scale: number;
  showGrid: boolean;
  showBubbles: boolean;
}

interface Scene {
  resize(w: number, h: number): void;
  step(dt: number): void;
  draw(): void;
}

interface Particle {
  on: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  g: number;
  big: number;
  seed: number;
}

interface Tentacle {
  a: number; // anchor position across the rim (-1..1)
  kind: 0 | 1; // 0 = tentacle, 1 = oral arm
  seg: number;
  x: number[];
  y: number[];
}

type TriColor = (wa: number, wb: number, wc: number, gx: number, gy: number) => string;

function makeGlyph(ch: string, px: number, color: string): HTMLCanvasElement {
  const s = Math.ceil(px * 1.5);
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d");
  if (g) {
    g.font = `${px}px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace`;
    g.fillStyle = color;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(ch, s / 2, s / 2 + 1);
  }
  return c;
}

function createScene(canvas: HTMLCanvasElement, opt: SceneOptions): Scene {
  const ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
  const P = clamp(Math.round(opt.pixelSize), 2, 8);
  const kind = opt.creature;
  const isJelly = kind === "jellyfish";
  const spec: SpineSpec = kind === "jellyfish" ? SPECS.shark : SPECS[kind];
  const rnd = Math.random;

  let W = 0;
  let H = 0;
  let time = 0;
  let phase = 0;
  let built = false;
  let lastFill = "";

  /* ---- pixel helpers ---- */
  const fill = (c: string) => {
    if (c !== lastFill) {
      ctx.fillStyle = c;
      lastFill = c;
    }
  };
  const block = (x: number, y: number, c: string) => {
    fill(c);
    ctx.fillRect(Math.floor(x / P) * P, Math.floor(y / P) * P, P, P);
  };

  function tri(
    ax: number, ay: number, bx: number, by: number, cx: number, cy: number,
    colorFn: TriColor
  ) {
    const den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (Math.abs(den) < 1e-3) return;
    const minX = Math.floor(Math.min(ax, bx, cx) / P);
    const maxX = Math.floor(Math.max(ax, bx, cx) / P);
    const minY = Math.floor(Math.min(ay, by, cy) / P);
    const maxY = Math.floor(Math.max(ay, by, cy) / P);
    for (let gy = minY; gy <= maxY; gy++) {
      const py = gy * P + P / 2;
      for (let gx = minX; gx <= maxX; gx++) {
        const px = gx * P + P / 2;
        const wa = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / den;
        const wb = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / den;
        const wc = 1 - wa - wb;
        if (wa < -0.04 || wb < -0.04 || wc < -0.04) continue;
        fill(colorFn(wa, wb, wc, gx, gy));
        ctx.fillRect(gx * P, gy * P, P, P);
      }
    }
  }

  /* ---- glyph sprites (no fillText inside the loop) ---- */
  const gridSprites = ["+", "·", "x"].map((c) => makeGlyph(c, 12, "#55d8ff"));
  const bubbleSprites = ["✦", "*", "o"].map((c) => [
    makeGlyph(c, 11, "#c4faff"),
    makeGlyph(c, 16, "#c4faff"),
  ]);

  /* ---- ASCII matrix grid ---- */
  interface Cell { x: number; y: number; s: number; g: number }
  let cells: Cell[] = [];
  function buildGrid() {
    cells = [];
    const G = Math.max(56, Math.sqrt((W * H) / 340));
    for (let y = G / 2; y < H + G; y += G) {
      for (let x = G / 2; x < W + G; x += G) {
        cells.push({
          x: x + (rnd() - 0.5) * G * 0.55,
          y: y + (rnd() - 0.5) * G * 0.55,
          s: rnd() * TAU,
          g: Math.floor(rnd() * 3),
        });
      }
    }
  }

  /* ---- particles (ring buffer, zero allocation in loop) ---- */
  const parts: Particle[] = Array.from({ length: 90 }, () => ({
    on: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, g: 0, big: 0, seed: 0,
  }));
  let pCursor = 0;
  let emitAcc = 0;
  function emit(x: number, y: number, vx: number, vy: number) {
    pCursor = (pCursor + 1) % parts.length;
    const p = parts[pCursor];
    p.on = true;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.max = p.life = 1.2 + rnd() * 1.5;
    p.g = Math.floor(rnd() * 3);
    p.big = rnd() < 0.3 ? 1 : 0;
    p.seed = rnd() * TAU;
  }
  function updateParticles(dt: number) {
    for (const p of parts) {
      if (!p.on) continue;
      p.life -= dt;
      if (p.life <= 0) { p.on = false; continue; }
      p.x += (p.vx + Math.sin(p.life * 5 + p.seed) * 9) * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - Math.min(1, 0.9 * dt);
      p.vy -= 5 * dt;
    }
  }

  /* ---- navigation / steering (shared by every creature) ---- */
  const nav = { x: 0, y: 0, h: 0, av: 0, sp: 0, wx: 0, wy: 0 };
  let bodyL = 220;
  let sf = 1;

  function pickWaypoint() {
    const mx = clamp(bodyL * 0.3, 30, W * 0.25);
    const my = clamp(bodyL * 0.18, 24, H * 0.35);
    for (let i = 0; i < 8; i++) {
      nav.wx = mx + rnd() * Math.max(1, W - 2 * mx);
      nav.wy = my + rnd() * Math.max(1, H - 2 * my);
      if (Math.hypot(nav.wx - nav.x, nav.wy - nav.y) > bodyL * 0.9) break;
    }
  }

  function steer(dt: number, maxTurn: number, targetSpeed: number, speedRate: number) {
    if (nav.x < 0 || nav.x > W || nav.y < 0 || nav.y > H) {
      nav.wx = W / 2;
      nav.wy = H / 2;
    } else if (Math.hypot(nav.wx - nav.x, nav.wy - nav.y) < bodyL * 0.3) {
      pickWaypoint();
    }
    const diff = angDiff(nav.h, Math.atan2(nav.wy - nav.y, nav.wx - nav.x));
    const want = clamp(diff * 2.2, -maxTurn, maxTurn);
    nav.av += (want - nav.av) * (1 - Math.exp(-dt * 2.6)); // angular easing
    nav.h += nav.av * dt;
    const slow = 1 - 0.3 * Math.min(1, Math.abs(nav.av) / maxTurn);
    nav.sp += (targetSpeed * slow - nav.sp) * (1 - Math.exp(-dt * speedRate));
    nav.x += Math.cos(nav.h) * nav.sp * dt;
    nav.y += Math.sin(nav.h) * nav.sp * dt;
  }

  /* ======================================================================
   *  SPINE CREATURES (shark / koi / whale / manta)
   * ==================================================================== */
  const n = spec.joints;
  const mk = () => new Array<number>(n).fill(0);
  const bx = mk(), by = mk(); // constrained chain
  const sx = mk(), sy = mk(); // chain + undulation (rendered spine)
  const bfx = mk(), bfy = mk(), bnx = mk(), bny = mk(); // base frames
  const fx = mk(), fy = mk(), nx = mk(), ny = mk(); // rendered frames
  const ux = mk(), uy = mk(); // dorsal vector (scaled by |roll|)
  const hw = mk();
  let segLen = spec.segLen;
  let L = segLen * (n - 1);
  let roll = 1;
  let rollTarget = 1;

  function frames(
    px: number[], py: number[],
    ofx: number[], ofy: number[], onx: number[], ony: number[]
  ) {
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, i - 1);
      const b = Math.min(n - 1, i + 1);
      let dx = px[a] - px[b];
      let dy = py[a] - py[b];
      const l = Math.hypot(dx, dy) || 1;
      dx /= l;
      dy /= l;
      ofx[i] = dx;
      ofy[i] = dy;
      onx[i] = -dy;
      ony[i] = dx;
    }
  }

  function layoutSpine() {
    for (let i = 0; i < n; i++) {
      bx[i] = nav.x - Math.cos(nav.h) * segLen * i;
      by[i] = nav.y - Math.sin(nav.h) * segLen * i;
    }
  }

  function stepSpine(dt: number) {
    const ref = spec.speed * sf;
    steer(dt, spec.maxTurn, ref * (0.92 + 0.08 * Math.sin(time * 0.7)), 1.6);
    phase += dt * spec.beat * (0.75 + 0.5 * (nav.sp / ref));

    const c = Math.cos(nav.h);
    if (c > 0.3) rollTarget = 1;
    else if (c < -0.3) rollTarget = -1;
    roll += (rollTarget - roll) * Math.min(1, dt * 5);

    // FK follow-chain with distance + bend-angle constraints
    bx[0] = nav.x;
    by[0] = nav.y;
    let prev = nav.h;
    for (let i = 1; i < n; i++) {
      const base = prev + Math.PI;
      let ang = Math.atan2(by[i] - by[i - 1], bx[i] - bx[i - 1]);
      ang = base + clamp(angDiff(base, ang), -spec.maxBend, spec.maxBend);
      bx[i] = bx[i - 1] + Math.cos(ang) * segLen;
      by[i] = by[i - 1] + Math.sin(ang) * segLen;
      prev = ang + Math.PI;
    }

    // travelling-wave undulation, amplified toward the caudal fin
    frames(bx, by, bfx, bfy, bnx, bny);
    const A = spec.amp * L;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const env = 0.1 + 0.9 * t * t;
      const w = phase - i * spec.freq;
      const u = (Math.sin(w) + 0.22 * t * t * t * Math.sin(2 * w + 0.9)) * A * env;
      sx[i] = bx[i] + bnx[i] * u;
      sy[i] = by[i] + bny[i] * u;
    }
    frames(sx, sy, fx, fy, nx, ny);

    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      let w = sampleProfile(spec.profile, t) * L;
      if (spec.flap) {
        const mask = clamp(w / (L * 0.3), 0, 1);
        w *= 1 + spec.flap * Math.sin(phase - t * 4.5) * mask;
      }
      hw[i] = Math.max(P * 0.55, w);
      ux[i] = -roll * nx[i];
      uy[i] = -roll * ny[i];
    }

    // cavitation wake from the tail
    if (opt.showBubbles) {
      emitAcc += dt * 16 * (nav.sp / ref);
      while (emitAcc >= 1) {
        emitAcc -= 1;
        emit(
          sx[n - 1] + (rnd() - 0.5) * P * 4,
          sy[n - 1] + (rnd() - 0.5) * P * 4,
          -fx[n - 1] * (10 + rnd() * 24) + (rnd() - 0.5) * 16,
          -fy[n - 1] * (10 + rnd() * 24) - (5 + rnd() * 16)
        );
      }
    }
  }

  const pt = { x: 0, y: 0, nx: 0, ny: 0, hw: 0 };
  function pointAt(tt: number) {
    const fi = clamp(tt, 0, 1) * (n - 1);
    const i = Math.min(n - 2, Math.floor(fi));
    const f = fi - i;
    pt.x = lerp(sx[i], sx[i + 1], f);
    pt.y = lerp(sy[i], sy[i + 1], f);
    pt.nx = lerp(nx[i], nx[i + 1], f);
    pt.ny = lerp(ny[i], ny[i + 1], f);
    pt.hw = lerp(hw[i], hw[i + 1], f);
  }

  function shade(d: number, chk: boolean, gx: number, gy: number, pal: Palette): string {
    if (d > 0.6) return pal.dorsal;
    if (d > 0.3) return chk ? pal.dorsal : pal.dorsalHi;
    if (d > 0.0) return chk ? pal.dorsalHi : pal.mid;
    if (d > -0.25) return chk ? pal.mid : pal.belly;
    if (d > -0.55) return pal.belly;
    if (((gx * 7 + gy * 13) % 11 + 11) % 11 === 0) return pal.pearl;
    return chk ? pal.belly : pal.bellyHi;
  }

  function finColors(pal: Palette): TriColor {
    return (wa, wb, wc, gx, gy) => {
      const m = Math.min(wa, wb, wc);
      if (m < 0.1) return pal.finEdge;
      if ((((gx + gy) % 7) + 7) % 7 === 0 && m > 0.18) return pal.lineDim;
      return ((gx + gy) & 1) === 0 && wc > 0.5 ? pal.finEdge : pal.fin;
    };
  }

  function colorAt(t: number, s: number, off: number, h: number, gx: number, gy: number): string {
    const chk = ((gx + gy) & 1) === 0;
    const sIdx = Math.floor(s / P);
    const pal0 = spec.pal;

    /* top-down (manta) */
    if (spec.view === "top") {
      const e = Math.abs(off) / h;
      if (e > 0.88) return sIdx % 3 !== 2 ? pal0.line : pal0.lineDim;
      if (Math.abs(off) < P * 0.55 && t > 0.04 && t < 0.8 && sIdx % 4 !== 3) return pal0.line;
      if (t > 0.17 && t < 0.25 && e > 0.3 && e < 0.62 && chk) return pal0.bellyHi;
      if (((sIdx % 9) + 9) % 9 === 0 && e > 0.25 && e < 0.7) return pal0.lineDim;
      if (e < 0.4) return chk ? pal0.dorsal : pal0.dorsalHi;
      if (e < 0.75) return chk ? pal0.dorsalHi : pal0.mid;
      return chk ? pal0.mid : pal0.dorsalHi;
    }

    /* side view */
    const d = -(off / h) * roll; // +1 dorsal … -1 ventral
    const ar = Math.abs(roll);
    let pal = pal0;
    if (spec.patches) {
      const pv = Math.sin(t * 21 + 0.7) + Math.sin(t * 8.3 + 2.1);
      if (pv > 0.95) pal = PAL_KOI_WHITE;
      else if (pv < -1.3) pal = PAL_KOI_SUMI;
    }

    if (ar > 0.35) {
      // pulsing bioluminescent gill slits
      if (spec.gills && d > -0.35 && d < 0.6) {
        const gt = (P * 0.55) / L;
        for (let gi = 0; gi < spec.gills.length; gi++) {
          if (Math.abs(t - spec.gills[gi]) < gt) {
            const lv = Math.sin(time * 3.2 - gi * 0.8);
            return lv > 0.4 ? "#c6fdff" : lv > -0.2 ? pal0.line : pal0.lineDim;
          }
        }
      }
      // neon circuit lateral line
      if (t > 0.12 && t < 0.9) {
        const lo = -roll * h * 0.1;
        const o2 = off - lo;
        if (Math.abs(o2) < P * 0.55) {
          if (spec.lineStyle === "dots") {
            if (sIdx % 3 === 0) return pal0.line;
          } else if (sIdx % 5 !== 4) {
            // travelling "data packet" highlight
            const pk = (((sIdx - Math.floor(time * 26)) % 14) + 14) % 14;
            return pk < 2 ? "#eaffff" : pal0.line;
          }
        } else if (spec.lineStyle === "circuit") {
          const side = o2 * -roll; // + toward dorsal
          if (sIdx % 9 === 4 && side > P * 0.5 && side < P * 3.5 && d > 0) {
            return side > P * 2.6 ? pal0.line : pal0.lineDim;
          }
        }
      }
    }
    if (spec.grooves && d < -0.3 && t > 0.1 && t < 0.55 && (Math.round(off / P) & 1) === 0) {
      return pal.mid;
    }
    return shade(d, chk, gx, gy, pal);
  }

  function drawEye(x: number, y: number) {
    const bright = Math.sin(time * 2.1) > -0.6;
    const glow = spec.pal.lineDim;
    block(x - P, y, glow);
    block(x + P, y, glow);
    block(x, y - P, glow);
    block(x, y + P, glow);
    block(x, y, bright ? spec.pal.line : "#ffffff");
  }

  function drawSpineCreature() {
    const pal = spec.pal;
    const side = spec.view === "side";

    /* 1 ─ caudal fin (behind the body) */
    if (spec.tail.kind !== "whip" && Math.abs(roll) > 0.04) {
      const T = n - 1;
      const size = spec.tail.size * L;
      const tx = sx[T], ty = sy[T];
      const bkx = -fx[T], bky = -fy[T];
      const aX = sx[n - 3], aY = sy[n - 3];
      const tu = ux[T], tv = uy[T];
      let Ux: number, Uy: number, Lx: number, Ly: number, Mx: number, My: number;
      if (spec.tail.kind === "hetero") {
        // asymmetrical lobes: long dorsal lobe, short ventral lobe
        Ux = tx + tu * size + bkx * size * 0.55;
        Uy = ty + tv * size + bky * size * 0.55;
        Lx = tx - tu * size * 0.52 + bkx * size * 0.38;
        Ly = ty - tv * size * 0.52 + bky * size * 0.38;
        Mx = tx + bkx * size * 0.18;
        My = ty + bky * size * 0.18;
      } else if (spec.tail.kind === "fan") {
        Ux = tx + tu * size * 0.78 + bkx * size * 0.95;
        Uy = ty + tv * size * 0.78 + bky * size * 0.95;
        Lx = tx - tu * size * 0.78 + bkx * size * 0.95;
        Ly = ty - tv * size * 0.78 + bky * size * 0.95;
        Mx = tx + bkx * size * 0.42;
        My = ty + bky * size * 0.42;
      } else {
        Ux = tx + tu * size + bkx * size * 0.35;
        Uy = ty + tv * size + bky * size * 0.35;
        Lx = tx - tu * size + bkx * size * 0.35;
        Ly = ty - tv * size + bky * size * 0.35;
        Mx = tx + bkx * size * 0.04;
        My = ty + bky * size * 0.04;
      }
      const fc = finColors(pal);
      tri(aX, aY, Ux, Uy, Mx, My, fc);
      tri(aX, aY, Lx, Ly, Mx, My, fc);
    }

    /* 2 ─ dorsal fin (behind the body so the base tucks in) */
    const df = spec.dorsalFin;
    if (side && df && Math.abs(roll) > 0.05) {
      const a = Math.round(df.t * (n - 1));
      const b = Math.min(n - 2, Math.round((df.t + df.len) * (n - 1)));
      const k = 0.7;
      const apx = lerp(sx[a], sx[b], df.sweep) + ux[a] * (hw[a] + df.h * L);
      const apy = lerp(sy[a], sy[b], df.sweep) + uy[a] * (hw[a] + df.h * L);
      tri(
        sx[a] + ux[a] * hw[a] * k, sy[a] + uy[a] * hw[a] * k,
        sx[b] + ux[b] * hw[b] * k, sy[b] + uy[b] * hw[b] * k,
        apx, apy, finColors(pal)
      );
    }

    /* 3 ─ body: rasterised cross-sections along the spine */
    const STEP = P * 0.7;
    for (let i = 0; i < n - 1; i++) {
      const ax = sx[i], ay = sy[i];
      const ex = sx[i + 1], ey = sy[i + 1];
      const segL = Math.hypot(ex - ax, ey - ay);
      const steps = Math.max(1, Math.ceil(segL / STEP));
      for (let k = 0; k < steps; k++) {
        const f = k / steps;
        const cx = ax + (ex - ax) * f;
        const cy = ay + (ey - ay) * f;
        let nxx = nx[i] + (nx[i + 1] - nx[i]) * f;
        let nyy = ny[i] + (ny[i + 1] - ny[i]) * f;
        const nl = Math.hypot(nxx, nyy) || 1;
        nxx /= nl;
        nyy /= nl;
        const h = hw[i] + (hw[i + 1] - hw[i]) * f;
        const t = (i + f) / (n - 1);
        const s = (i + f) * segLen;
        const m = Math.max(1, Math.ceil((2 * h) / STEP));
        for (let j = 0; j <= m; j++) {
          const off = -h + (2 * h * j) / m;
          const x = cx + nxx * off;
          const y = cy + nyy * off;
          const gx = Math.floor(x / P);
          const gy = Math.floor(y / P);
          fill(colorAt(t, s, off, h, gx, gy));
          ctx.fillRect(gx * P, gy * P, P, P);
        }
      }
    }

    /* 4 ─ swept pectoral fin (in front of the body, ventral side) */
    const pc = spec.pectoral;
    if (side && pc && Math.abs(roll) > 0.05) {
      const a = Math.round(pc.t * (n - 1));
      const b = Math.min(n - 2, Math.round((pc.t + pc.len) * (n - 1)));
      const flap = 1 + 0.22 * Math.sin(phase * 0.8 + 1);
      const reach = hw[b] * 0.9 + pc.span * L * flap;
      tri(
        sx[a] - ux[a] * hw[a] * 0.7, sy[a] - uy[a] * hw[a] * 0.7,
        sx[b] - ux[b] * hw[b] * 0.7, sy[b] - uy[b] * hw[b] * 0.7,
        sx[b] - ux[b] * reach - fx[b] * pc.sweep * L,
        sy[b] - uy[b] * reach - fy[b] * pc.sweep * L,
        finColors(pal)
      );
    }

    /* 5 ─ mouth line / teeth */
    const mo = spec.mouth;
    if (side && mo && Math.abs(roll) > 0.45) {
      for (let k = 0; k < 8; k++) {
        pointAt(lerp(mo.a, mo.b, k / 7));
        const vx = roll * pt.nx;
        const vy = roll * pt.ny;
        const mx = pt.x + vx * pt.hw * mo.off;
        const my = pt.y + vy * pt.hw * mo.off;
        block(mx, my, "#020b16");
        if (mo.teeth && (k & 1) === 1) block(mx + vx * P, my + vy * P, "#eafdff");
      }
    }

    /* 6 ─ eyes */
    if (side) {
      if (Math.abs(roll) > 0.45) {
        pointAt(spec.eyeT);
        drawEye(pt.x - roll * pt.nx * pt.hw * spec.eyeOff, pt.y - roll * pt.ny * pt.hw * spec.eyeOff);
      }
    } else {
      pointAt(spec.eyeT);
      drawEye(pt.x + pt.nx * pt.hw * spec.eyeOff, pt.y + pt.ny * pt.hw * spec.eyeOff);
      drawEye(pt.x - pt.nx * pt.hw * spec.eyeOff, pt.y - pt.ny * pt.hw * spec.eyeOff);
    }
  }

  /* ======================================================================
   *  JELLYFISH
   * ==================================================================== */
  const tents: Tentacle[] = [];
  let R = 44;
  let pulse = 0;

  function anchorOf(tt: Tentacle, out: { x: number; y: number }) {
    const fxx = Math.cos(nav.h), fyy = Math.sin(nav.h);
    const lx = tt.kind === 1 ? -R * 0.12 : -R * 0.05;
    const ly = tt.a * R * (tt.kind === 1 ? 1 : 0.82);
    out.x = nav.x + fxx * lx - fyy * ly;
    out.y = nav.y + fyy * lx + fxx * ly;
  }

  function buildJelly() {
    tents.length = 0;
    const a = { x: 0, y: 0 };
    const add = (an: number, len: number, kd: 0 | 1, seg: number) => {
      const t: Tentacle = { a: an, kind: kd, seg, x: new Array<number>(len).fill(0), y: new Array<number>(len).fill(0) };
      anchorOf(t, a);
      for (let j = 0; j < len; j++) {
        t.x[j] = a.x - Math.cos(nav.h) * seg * j;
        t.y[j] = a.y - Math.sin(nav.h) * seg * j;
      }
      tents.push(t);
    };
    for (let k = 0; k < 7; k++) add((k / 6) * 2 - 1, 16, 0, 8.5 * sf);
    for (let k = 0; k < 4; k++) add(((k / 3) * 2 - 1) * 0.35, 10, 1, 7 * sf);
  }

  let jCc = 0;
  function stepJelly(dt: number) {
    pulse += dt * 2.8;
    jCc = 0.5 + 0.5 * Math.sin(pulse); // bell contraction
    const thrust = Math.max(0, Math.cos(pulse));
    steer(dt, 0.8, 80 * sf * (0.12 + 1.9 * Math.pow(thrust, 1.5)), 6);

    const fxx = Math.cos(nav.h), fyy = Math.sin(nav.h);
    const a = { x: 0, y: 0 };
    for (const tt of tents) {
      anchorOf(tt, a);
      tt.x[0] = a.x;
      tt.y[0] = a.y;
      const pull = clamp(dt * 3, 0, 1);
      for (let j = 1; j < tt.x.length; j++) {
        tt.x[j] += (tt.x[j - 1] - fxx * tt.seg - tt.x[j]) * pull;
        tt.y[j] += (tt.y[j - 1] - fyy * tt.seg - tt.y[j]) * pull;
        let dx = tt.x[j] - tt.x[j - 1];
        let dy = tt.y[j] - tt.y[j - 1];
        const l = Math.hypot(dx, dy) || 1;
        dx /= l;
        dy /= l;
        tt.x[j] = tt.x[j - 1] + dx * tt.seg;
        tt.y[j] = tt.y[j - 1] + dy * tt.seg;
      }
    }

    if (opt.showBubbles && thrust > 0.8 && rnd() < dt * 16) {
      const ang = nav.h + Math.PI / 2 + (rnd() - 0.5) * 2.4;
      emit(
        nav.x - fxx * R * 0.1 + Math.cos(ang) * R * 0.8,
        nav.y - fyy * R * 0.1 + Math.sin(ang) * R * 0.8,
        (rnd() - 0.5) * 14, -(6 + rnd() * 14)
      );
    }
  }

  function drawJelly() {
    const fxx = Math.cos(nav.h), fyy = Math.sin(nav.h);
    const perpX = -fyy, perpY = fxx;

    /* tentacles + oral arms (behind the translucent bell) */
    for (const tt of tents) {
      const len = tt.x.length;
      for (let j = 0; j < len - 1; j++) {
        const sway = Math.sin(time * 2.3 - j * 0.55 + tt.a * 3) * P * 0.9 * (j / len);
        const ax = tt.x[j] + perpX * sway;
        const ay = tt.y[j] + perpY * sway;
        const ex = tt.x[j + 1] + perpX * Math.sin(time * 2.3 - (j + 1) * 0.55 + tt.a * 3) * P * 0.9 * ((j + 1) / len);
        const ey = tt.y[j + 1] + perpY * Math.sin(time * 2.3 - (j + 1) * 0.55 + tt.a * 3) * P * 0.9 * ((j + 1) / len);
        const steps = Math.max(1, Math.ceil(Math.hypot(ex - ax, ey - ay) / (P * 0.8)));
        for (let k = 0; k < steps; k++) {
          const f = k / steps;
          const x = lerp(ax, ex, f);
          const y = lerp(ay, ey, f);
          let c: string;
          if (tt.kind === 1) {
            c = (j + k) % 2 === 0 ? "#c45cff" : "#7a3fd0";
            block(x + P, y, "#4b2a99");
          } else if (j > len * 0.75) {
            c = "#073b52";
          } else {
            c = (j + k) % 3 === 0 ? "#00F0FF" : j % 2 ? "#0b7a96" : "#0a5f7d";
          }
          block(x, y, c);
        }
      }
    }

    /* bell */
    const rx = R * (1 + 0.14 * jCc);
    const ry = R * 0.86 * (1 - 0.2 * jCc);
    const skirt = R * 0.18;
    const ext = Math.max(rx, ry) + skirt + P * 2;
    const minX = Math.floor((nav.x - ext) / P), maxX = Math.floor((nav.x + ext) / P);
    const minY = Math.floor((nav.y - ext) / P), maxY = Math.floor((nav.y + ext) / P);
    ctx.globalAlpha = 0.88;
    for (let gy = minY; gy <= maxY; gy++) {
      const py = gy * P + P / 2 - nav.y;
      for (let gx = minX; gx <= maxX; gx++) {
        const px = gx * P + P / 2 - nav.x;
        const lx = px * fxx + py * fyy;
        const ly = -px * fyy + py * fxx;
        const e =
          lx >= 0
            ? (lx / ry) * (lx / ry) + (ly / rx) * (ly / rx)
            : (ly / rx) * (ly / rx) + (lx / skirt) * (lx / skirt);
        if (e > 1) continue;
        const chk = ((gx + gy) & 1) === 0;
        let c: string;
        if (e > 0.84) {
          c = chk ? "#00F0FF" : "#0aa9c6";
        } else if (lx > 0 && Math.abs(Math.sin(Math.atan2(ly, lx) * 5)) < 0.06 && e > 0.3) {
          c = "#2d9fd6";
        } else if (e > 0.1 && e < 0.3 && lx > 0) {
          c = chk === jCc > 0.5 ? "#b06bff" : "#6a46d6";
        } else {
          const light = (-px * 0.6 - py * 0.8) / R;
          c = light > 0.35 ? "#2a78b0" : chk ? "#144a78" : "#0f3a63";
        }
        fill(c);
        ctx.fillRect(gx * P, gy * P, P, P);
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ======================================================================
   *  Build / resize / step / draw
   * ==================================================================== */
  function build() {
    sf = clamp(Math.min(W / 1100, H / 640), 0.5, 1.35) * opt.scale;
    if (isJelly) {
      R = 44 * sf;
      bodyL = R * 3.6;
    } else {
      segLen = spec.segLen * sf;
      L = segLen * (n - 1);
      bodyL = L;
    }
    if (!built) {
      nav.x = W * (0.3 + rnd() * 0.4);
      nav.y = H * (0.35 + rnd() * 0.3);
      nav.h = rnd() < 0.5 ? 0 : Math.PI;
      roll = rollTarget = Math.cos(nav.h) >= 0 ? 1 : -1;
      built = true;
    } else {
      nav.x = clamp(nav.x, 0, W);
      nav.y = clamp(nav.y, 0, H);
    }
    pickWaypoint();
    if (isJelly) buildJelly();
    else layoutSpine();
    if (!isJelly) {
      frames(bx, by, bfx, bfy, bnx, bny);
      for (let i = 0; i < n; i++) { sx[i] = bx[i]; sy[i] = by[i]; }
      frames(sx, sy, fx, fy, nx, ny);
      for (let i = 0; i < n; i++) {
        hw[i] = Math.max(P * 0.55, sampleProfile(spec.profile, i / (n - 1)) * L);
        ux[i] = -roll * nx[i];
        uy[i] = -roll * ny[i];
      }
    }
  }

  return {
    resize(w, h) {
      W = Math.max(1, Math.floor(w));
      H = Math.max(1, Math.floor(h));
      canvas.width = W;
      canvas.height = H;
      ctx.imageSmoothingEnabled = false;
      lastFill = "";
      buildGrid();
      build();
    },

    step(dt) {
      time += dt;
      if (isJelly) stepJelly(dt);
      else stepSpine(dt);
      updateParticles(dt);
    },

    draw() {
      lastFill = "";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      /* ASCII matrix grid — brightens near the creature */
      if (opt.showGrid) {
        const R2 = 170 * 170;
        for (const c of cells) {
          const x = c.x + Math.sin(time * 0.22 + c.s) * 9;
          const y = c.y + Math.cos(time * 0.17 + c.s * 1.7) * 9;
          const dx = x - nav.x, dy = y - nav.y;
          const near = Math.max(0, 1 - (dx * dx + dy * dy) / R2);
          ctx.globalAlpha = 0.07 + 0.08 * (0.5 + 0.5 * Math.sin(time * 0.5 + c.s * 3)) + near * 0.45;
          ctx.drawImage(gridSprites[c.g], Math.round((x - 6) / P) * P, Math.round((y - 6) / P) * P);
        }
        ctx.globalAlpha = 1;
      }

      /* bubble wake */
      if (opt.showBubbles) {
        for (const p of parts) {
          if (!p.on) continue;
          const spr = bubbleSprites[p.g][p.big];
          ctx.globalAlpha = Math.min(1, (p.life / p.max) * 1.6) * 0.85;
          ctx.drawImage(spr, Math.round(p.x / P) * P - spr.width / 2, Math.round(p.y / P) * P - spr.height / 2);
        }
        ctx.globalAlpha = 1;
      }

      if (isJelly) drawJelly();
      else drawSpineCreature();
    },
  };
}

/* ───────────────────────────── React component ──────────────────────────── */

export default function CyberAquaticCreature({
  creature = "shark",
  pixelSize = 4,
  scale = 1,
  showGrid = true,
  showBubbles = true,
  glow = true,
  background = DEFAULT_BG,
  className,
  style,
}: CyberAquaticCreatureProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const scene = createScene(canvas, { creature, pixelSize, scale, showGrid, showBubbles });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = 0;
    let running = false;
    let inView = false;
    let tabVisible = !document.hidden;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      scene.step(dt);
      scene.draw();
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf); // 0% CPU/GPU while off-screen
    };
    const sync = () => (inView && tabVisible ? start() : stop());

    const renderStatic = () => {
      for (let i = 0; i < 160; i++) scene.step(1 / 30);
      scene.draw();
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      if (r.width < 2 || r.height < 2) return;
      scene.resize(r.width, r.height);
      scene.draw();
      if (reduceMotion) renderStatic();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    const onVis = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [creature, pixelSize, scale, showGrid, showBubbles]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          imageRendering: "pixelated",
          filter: glow
            ? `drop-shadow(0 0 10px ${creature === "black_shark" ? "rgba(255, 0, 85, 0.45)" : "rgba(0, 240, 255, 0.35)"})`
            : undefined,
        }}
      />
    </div>
  );
}