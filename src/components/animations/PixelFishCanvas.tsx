"use client";
import { useEffect, useRef, useState } from "react";

type CreatureMode = "shark" | "koi" | "both";

interface Shark {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  turnSpeed: number;
  length: number;
  phase: number;
  phaseSpeed: number;
  scale: number;
  depth: number;
  accentColor: string;
  name: string;
  history: { x: number; y: number; angle: number }[];
}

interface KoiFish {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  speed: number;
  baseSpeed: number;
  turnSpeed: number;
  phase: number;
  phaseSpeed: number;
  scale: number;
  type: "gold" | "crimson";
  history: { x: number; y: number; angle: number }[];
}

interface PilotFish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  color: string;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

interface FoodPellet {
  x: number;
  y: number;
  vy: number;
  alpha: number;
}

interface SonarPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export default function PixelFishCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CreatureMode>("both");
  const modeRef = useRef<CreatureMode>("both");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let width = 0;
    let height = 0;
    let isVisible = false;

    // Fast resize handling
    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = canvas.width = Math.floor(rect.width);
      height = canvas.height = Math.max(540, Math.floor(rect.height));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Ambient swimming without mouse disruption
    const sonars: SonarPulse[] = [];
    const foods: FoodPellet[] = [];

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      sonars.push({
        x: clickX,
        y: clickY,
        radius: 10,
        maxRadius: 260,
        alpha: 0.85,
      });

      for (let i = 0; i < 4; i++) {
        foods.push({
          x: clickX + (Math.random() - 0.5) * 30,
          y: clickY + (Math.random() - 0.5) * 30,
          vy: 0.4 + Math.random() * 0.3,
          alpha: 1,
        });
      }

      sharks.forEach((s) => {
        s.targetX = clickX;
        s.targetY = clickY;
        s.speed = s.maxSpeed;
      });

      koiList.forEach((k) => {
        k.targetX = clickX;
        k.targetY = clickY;
      });
    };

    canvas.addEventListener("click", onClick);

    // Particles (limited pool for top performance)
    const particles: Particle[] = [];
    const maxParticles = 35;
    const bubbleChars = ["+", "o", "·", "*", "•", "✦"];

    // 1. APEX SHARKS
    const sharks: Shark[] = [
      {
        name: "Apex Great Cyber Shark",
        x: width * 0.25,
        y: height * 0.45,
        targetX: width * 0.8,
        targetY: height * 0.5,
        angle: 0.15,
        speed: 2.2,
        baseSpeed: 2.2,
        maxSpeed: 4.4,
        turnSpeed: 0.038,
        length: 24,
        phase: 0,
        phaseSpeed: 0.09,
        scale: 1.4,
        depth: 1,
        accentColor: "#00F0FF",
        history: [],
      },
      {
        name: "Phantom Ghost Shark",
        x: width * 0.75,
        y: height * 0.7,
        targetX: width * 0.2,
        targetY: height * 0.3,
        angle: Math.PI * 0.85,
        speed: 1.8,
        baseSpeed: 1.8,
        maxSpeed: 3.8,
        turnSpeed: 0.03,
        length: 20,
        phase: 1.8,
        phaseSpeed: 0.08,
        scale: 1.05,
        depth: 0.85,
        accentColor: "#A78BFA",
        history: [],
      },
    ];

    sharks.forEach((s) => {
      for (let i = 0; i < 50; i++) {
        s.history.unshift({
          x: s.x - Math.cos(s.angle) * i * 5,
          y: s.y - Math.sin(s.angle) * i * 5,
          angle: s.angle,
        });
      }
    });

    // 2. BIOLUMINESCENT KOI
    const koiList: KoiFish[] = [
      {
        x: width * 0.65,
        y: height * 0.35,
        targetX: width * 0.25,
        targetY: height * 0.6,
        angle: -1.2,
        speed: 1.7,
        baseSpeed: 1.7,
        turnSpeed: 0.035,
        phase: 0.5,
        phaseSpeed: 0.12,
        scale: 1.1,
        type: "gold",
        history: [],
      },
      {
        x: width * 0.35,
        y: height * 0.75,
        targetX: width * 0.75,
        targetY: height * 0.25,
        angle: 0.8,
        speed: 1.5,
        baseSpeed: 1.5,
        turnSpeed: 0.03,
        phase: 2.2,
        phaseSpeed: 0.11,
        scale: 0.9,
        type: "crimson",
        history: [],
      },
    ];

    koiList.forEach((k) => {
      for (let i = 0; i < 35; i++) {
        k.history.unshift({
          x: k.x - Math.cos(k.angle) * i * 4,
          y: k.y - Math.sin(k.angle) * i * 4,
          angle: k.angle,
        });
      }
    });

    // 3. PILOT FISH
    const pilotSchool: PilotFish[] = [];
    const numPilots = 8;
    for (let i = 0; i < numPilots; i++) {
      pilotSchool.push({
        x: width * 0.25 + (Math.random() - 0.5) * 100,
        y: height * 0.45 + (Math.random() - 0.5) * 60,
        vx: 1 + Math.random(),
        vy: (Math.random() - 0.5) * 0.4,
        angle: 0,
        speed: 2.3 + Math.random() * 0.6,
        color: i % 2 === 0 ? "#00D9FF" : "#38BDF8",
        size: 3,
      });
    }

    // Pre-calculate ambient grid coordinates to avoid CPU recalculation
    const gridPoints: { x: number; y: number; char: string; baseAlpha: number }[] = [];
    const stepX = 56;
    const stepY = 44;
    const gridChars = [".", "+", "·", "x", "o"];
    for (let x = 28; x < 2560; x += stepX) {
      for (let y = 22; y < 1440; y += stepY) {
        gridPoints.push({
          x,
          y,
          char: gridChars[(x + y) % gridChars.length],
          baseAlpha: 0.08 + ((x * y) % 10) * 0.012,
        });
      }
    }

    const render = () => {
      if (!isVisible) return; // Completely idle when offscreen
      ctx.clearRect(0, 0, width, height);
      const currentMode = modeRef.current;

      // LAYER 1: Ambient Matrix Coordinates (High performance)
      ctx.font = '10px "Courier New", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < gridPoints.length; i++) {
        const pt = gridPoints[i];
        if (pt.x > width || pt.y > height) continue;
        ctx.fillStyle = `rgba(0, 217, 255, ${pt.baseAlpha})`;
        ctx.fillText(pt.char, pt.x, pt.y);
      }

      // LAYER 2: Sonar Pulse Waves
      for (let i = sonars.length - 1; i >= 0; i--) {
        const s = sonars[i];
        s.radius += 3.5;
        s.alpha -= 0.015;

        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          sonars.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(0, 240, 255, ${s.alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // LAYER 3: Food Pellets
      for (let i = foods.length - 1; i >= 0; i--) {
        const f = foods[i];
        f.y += f.vy;
        f.alpha -= 0.005;

        if (f.alpha <= 0 || f.y > height) {
          foods.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 230, 100, ${f.alpha})`;
        ctx.fillRect(f.x - 2, f.y - 2, 4, 4);
      }

      // LAYER 4: Bubble Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color.replace("ALPHA", p.alpha.toFixed(2));
        ctx.font = `${p.size}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }

      // LAYER 5: School of Pilot Fish
      if (currentMode === "shark" || currentMode === "both") {
        const leadShark = sharks[0];
        pilotSchool.forEach((pilot, idx) => {
          const targetX =
            leadShark.x + Math.cos(leadShark.angle + 0.4 + idx * 0.15) * (60 + (idx % 3) * 15);
          const targetY =
            leadShark.y + Math.sin(leadShark.angle + 0.4 + idx * 0.15) * (60 + (idx % 3) * 15);

          pilot.vx += (targetX - pilot.x) * 0.02;
          pilot.vy += (targetY - pilot.y) * 0.02;
          pilot.vx *= 0.94;
          pilot.vy *= 0.94;
          pilot.x += pilot.vx;
          pilot.y += pilot.vy;
          pilot.angle = Math.atan2(pilot.vy, pilot.vx);

          ctx.save();
          ctx.fillStyle = pilot.color;
          ctx.translate(pilot.x, pilot.y);
          ctx.rotate(pilot.angle);
          ctx.fillRect(-pilot.size * 1.5, -pilot.size * 0.5, pilot.size * 2.8, pilot.size);
          ctx.restore();
        });
      }

      // LAYER 6: Apex Cyber Sharks
      if (currentMode === "shark" || currentMode === "both") {
        sharks.forEach((shark) => {
          const distToTarget = Math.hypot(shark.targetX - shark.x, shark.targetY - shark.y);

          if (distToTarget < 80 || Math.random() < 0.005) {
            shark.targetX = 100 + Math.random() * (width - 200);
            shark.targetY = 100 + Math.random() * (height - 200);
          }

          let steerTargetX = shark.targetX;
          let steerTargetY = shark.targetY;

          if (foods.length > 0) {
            steerTargetX = foods[0].x;
            steerTargetY = foods[0].y;
          }

          const desiredAngle = Math.atan2(steerTargetY - shark.y, steerTargetX - shark.x);
          let diff = desiredAngle - shark.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          shark.angle += diff * shark.turnSpeed;

          shark.x += Math.cos(shark.angle) * shark.speed;
          shark.y += Math.sin(shark.angle) * shark.speed;

          const pad = 120;
          if (shark.x < -pad) shark.x = width + pad;
          if (shark.x > width + pad) shark.x = -pad;
          if (shark.y < -pad) shark.y = height + pad;
          if (shark.y > height + pad) shark.y = -pad;

          shark.history.unshift({ x: shark.x, y: shark.y, angle: shark.angle });
          if (shark.history.length > 55) shark.history.pop();

          shark.phase += shark.phaseSpeed * (shark.speed / shark.baseSpeed);

          if (particles.length < maxParticles && Math.random() < 0.25) {
            const tailIdx = Math.min(shark.history.length - 1, 22);
            const tailPoint = shark.history[tailIdx];
            if (tailPoint) {
              particles.push({
                x: tailPoint.x + (Math.random() - 0.5) * 6,
                y: tailPoint.y + (Math.random() - 0.5) * 6,
                vx: -Math.cos(tailPoint.angle) * 1.1 + (Math.random() - 0.5) * 0.4,
                vy: -Math.sin(tailPoint.angle) * 1.1 - 0.2 + (Math.random() - 0.5) * 0.4,
                char: bubbleChars[Math.floor(Math.random() * bubbleChars.length)],
                color:
                  shark.name.includes("Apex")
                    ? "rgba(0, 240, 255, ALPHA)"
                    : "rgba(167, 139, 250, ALPHA)",
                size: 8,
                alpha: 0.7 * shark.depth,
                decay: 0.018,
              });
            }
          }

          drawCyberSharkFast(ctx, shark);
        });
      }

      // LAYER 7: Glowing Pixel Koi
      if (currentMode === "koi" || currentMode === "both") {
        koiList.forEach((koi) => {
          const distToTarget = Math.hypot(koi.targetX - koi.x, koi.targetY - koi.y);

          if (distToTarget < 60 || Math.random() < 0.008) {
            koi.targetX = 80 + Math.random() * (width - 160);
            koi.targetY = 80 + Math.random() * (height - 160);
          }

          let steerTargetX = koi.targetX;
          let steerTargetY = koi.targetY;

          if (foods.length > 0) {
            steerTargetX = foods[0].x;
            steerTargetY = foods[0].y;
          }

          const desiredAngle = Math.atan2(steerTargetY - koi.y, steerTargetX - koi.x);
          let diff = desiredAngle - koi.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          koi.angle += diff * koi.turnSpeed;

          koi.x += Math.cos(koi.angle) * koi.speed;
          koi.y += Math.sin(koi.angle) * koi.speed;

          const margin = 80;
          if (koi.x < -margin) koi.x = width + margin;
          if (koi.x > width + margin) koi.x = -margin;
          if (koi.y < -margin) koi.y = height + margin;
          if (koi.y > height + margin) koi.y = -margin;

          koi.history.unshift({ x: koi.x, y: koi.y, angle: koi.angle });
          if (koi.history.length > 40) koi.history.pop();

          koi.phase += koi.phaseSpeed;

          drawPixelKoiFast(ctx, koi);
        });
      }

      animId = requestAnimationFrame(render);
    };

    // IntersectionObserver: PAUSE canvas loop when scrolled away to save 100% CPU/GPU!
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            animId = requestAnimationFrame(render);
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 select-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="pointer-events-none h-full w-full"
        style={{
          imageRendering: "pixelated",
          filter: "drop-shadow(0 0 16px rgba(0, 217, 255, 0.35))",
        }}
      />

      {/* Control Pill */}
      <div className="pointer-events-auto absolute bottom-5 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#070d1a]/85 px-3.5 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#00D9FF]" />
          <span>CYBER OCEAN · CLICK TO FEED & EMIT SONAR</span>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#070d1a]/85 p-1 font-mono text-[10px] backdrop-blur-md">
          {(["shark", "koi", "both"] as CreatureMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`cursor-pointer rounded-full px-3 py-1 font-semibold uppercase tracking-wider transition-all duration-200 ${
                mode === m
                  ? "bg-[#00D9FF] text-[#05070D] shadow-[0_0_12px_#00D9FF88]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m === "shark" && "🦈 Cyber Shark"}
              {m === "koi" && "🐟 Glowing Koi"}
              {m === "both" && "✨ All Creatures"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FAST HIGH-PERFORMANCE SHARK RENDERER
// (Replaces heavy shadowBlur with instant direct drawing)
// ==========================================
function drawCyberSharkFast(ctx: CanvasRenderingContext2D, shark: Shark) {
  const { scale, phase, depth, accentColor } = shark;
  const pixelSize = Math.max(2, Math.round(3.2 * scale * depth));

  const dorsalDark = "#071224";
  const dorsalMid = "#0C2344";
  const ventralWhite = "#E2F8FF";
  const circuitCyan = accentColor;

  const totalJoints = 20;
  const spine: { x: number; y: number; angle: number; halfWidth: number }[] = [];

  for (let i = 0; i < totalJoints; i++) {
    const histIdx = Math.min(shark.history.length - 1, Math.round(i * 1.6));
    const pt = shark.history[histIdx] || { x: shark.x, y: shark.y, angle: shark.angle };

    const waveAmp = (i / totalJoints) * (i / totalJoints) * 20 * scale;
    const wave = Math.sin(phase - i * 0.4) * waveAmp;

    const perp = pt.angle + Math.PI / 2;
    const sx = pt.x + Math.cos(perp) * wave;
    const sy = pt.y + Math.sin(perp) * wave;

    let w = 2;
    if (i === 0) w = 3;
    else if (i === 1) w = 6;
    else if (i === 2) w = 9.5;
    else if (i === 3) w = 12.5;
    else if (i === 4) w = 15;
    else if (i === 5) w = 16.5;
    else if (i === 6) w = 16.5;
    else if (i === 7) w = 15.5;
    else if (i === 8) w = 14;
    else if (i === 9) w = 12;
    else if (i === 10) w = 10;
    else if (i === 11) w = 8.5;
    else if (i === 12) w = 7;
    else if (i === 13) w = 5.5;
    else if (i === 14) w = 4.2;
    else if (i === 15) w = 3.2;
    else if (i === 16) w = 6.5;
    else if (i === 17) w = 11.5;
    else if (i === 18) w = 15.5;
    else w = 18;

    spine.push({
      x: sx,
      y: sy,
      angle: pt.angle,
      halfWidth: w * scale,
    });
  }

  // Pectoral Fins
  if (spine[4]) {
    const chest = spine[4];
    const finFlutter = Math.sin(phase * 1.2) * 0.18;
    drawSharkPectoralFast(
      ctx,
      chest.x,
      chest.y,
      chest.angle - Math.PI / 2.3 + finFlutter,
      26 * scale,
      dorsalMid,
      circuitCyan,
      pixelSize
    );
    drawSharkPectoralFast(
      ctx,
      chest.x,
      chest.y,
      chest.angle + Math.PI / 2.3 - finFlutter,
      26 * scale,
      dorsalMid,
      circuitCyan,
      pixelSize
    );
  }

  // Main Dorsal Fin
  if (spine[6]) {
    const back = spine[6];
    drawSharkDorsalFast(
      ctx,
      back.x,
      back.y,
      back.angle - Math.PI / 2,
      17 * scale,
      dorsalDark,
      circuitCyan,
      pixelSize
    );
  }

  // Body Segments
  for (let i = spine.length - 1; i >= 0; i--) {
    const joint = spine[i];
    const perp = joint.angle + Math.PI / 2;
    const halfW = joint.halfWidth;

    if (i >= 16) {
      drawHeterocercalTailFast(
        ctx,
        joint.x,
        joint.y,
        joint.angle,
        halfW,
        dorsalMid,
        circuitCyan,
        pixelSize
      );
      continue;
    }

    const steps = Math.max(2, Math.round(halfW * 1.8));

    for (let s = -steps / 2; s <= steps / 2; s++) {
      const offset = s * (pixelSize * 0.95);
      const px = Math.round(joint.x + Math.cos(perp) * offset);
      const py = Math.round(joint.y + Math.sin(perp) * offset);

      let color = dorsalMid;
      const normalizedS = s / (steps / 2);

      if (Math.abs(normalizedS) > 0.82) {
        color = circuitCyan;
      } else if (Math.abs(s) <= 1 && i % 3 === 0) {
        color = circuitCyan;
      } else if (normalizedS > 0.25) {
        color = ventralWhite;
      } else if (i % 2 === 0) {
        color = dorsalDark;
      }

      ctx.fillStyle = color;
      ctx.fillRect(px - pixelSize / 2, py - pixelSize / 2, pixelSize, pixelSize);
    }

    // Gills
    if (i === 3) {
      ctx.fillStyle = circuitCyan;
      for (let g = 0; g < 3; g++) {
        const gDist = halfW * (0.5 + g * 0.15);
        ctx.fillRect(
          joint.x + Math.cos(perp) * gDist - 1,
          joint.y + Math.sin(perp) * gDist - 2,
          pixelSize,
          pixelSize * 1.5
        );
        ctx.fillRect(
          joint.x - Math.cos(perp) * gDist - 1,
          joint.y - Math.sin(perp) * gDist - 2,
          pixelSize,
          pixelSize * 1.5
        );
      }
    }
  }

  // Glowing Eyes
  if (spine[2]) {
    const head = spine[2];
    const eyePerp = head.angle + Math.PI / 2;
    const eyeDist = head.halfWidth * 0.85;

    const e1x = Math.round(head.x + Math.cos(eyePerp) * eyeDist);
    const e1y = Math.round(head.y + Math.sin(eyePerp) * eyeDist);
    const e2x = Math.round(head.x - Math.cos(eyePerp) * eyeDist);
    const e2y = Math.round(head.y - Math.sin(eyePerp) * eyeDist);

    const eyeSz = Math.max(3, pixelSize * 1.2);
    ctx.fillStyle = circuitCyan;
    ctx.fillRect(e1x - eyeSz / 2, e1y - eyeSz / 2, eyeSz, eyeSz);
    ctx.fillRect(e2x - eyeSz / 2, e2y - eyeSz / 2, eyeSz, eyeSz);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(e1x - 1, e1y - 1, 2, 2);
    ctx.fillRect(e2x - 1, e2y - 1, 2, 2);
  }
}

function drawSharkPectoralFast(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  bodyColor: string,
  edgeColor: string,
  pixelSize: number
) {
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const dist = (i / steps) * length;
    const fx = Math.round(x + Math.cos(angle) * dist);
    const fy = Math.round(y + Math.sin(angle) * dist);
    const chord = Math.max(1, Math.round((steps - i) * 1.1));

    for (let k = -chord; k <= chord; k++) {
      const isEdge = k === -chord || k === chord || i === steps;
      ctx.fillStyle = isEdge ? edgeColor : bodyColor;
      ctx.fillRect(
        fx + k * (pixelSize * 0.9) - pixelSize / 2,
        fy - pixelSize / 2,
        pixelSize,
        pixelSize
      );
    }
  }
}

function drawSharkDorsalFast(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  height: number,
  bodyColor: string,
  edgeColor: string,
  pixelSize: number
) {
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const dist = (i / steps) * height;
    const fx = Math.round(x + Math.cos(angle) * dist);
    const fy = Math.round(y + Math.sin(angle) * dist);
    const w = Math.max(1, Math.round((steps - i) * 0.8));

    for (let k = -w; k <= w; k++) {
      ctx.fillStyle = k === -w || i === steps ? edgeColor : bodyColor;
      ctx.fillRect(
        fx + k * (pixelSize * 0.8) - pixelSize / 2,
        fy - pixelSize / 2,
        pixelSize,
        pixelSize
      );
    }
  }
}

function drawHeterocercalTailFast(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  span: number,
  bodyColor: string,
  accentColor: string,
  pixelSize: number
) {
  const perp = angle + Math.PI / 2;
  const upperLobeHeight = span * 1.3;
  const lowerLobeHeight = span * 0.8;

  const totalSteps = 5;
  for (let s = 0; s < totalSteps; s++) {
    const t = s / totalSteps;
    const ux = Math.round(x + Math.cos(perp) * (t * upperLobeHeight) - Math.cos(angle) * (t * 7));
    const uy = Math.round(y + Math.sin(perp) * (t * upperLobeHeight) - Math.sin(angle) * (t * 7));
    const lx = Math.round(x - Math.cos(perp) * (t * lowerLobeHeight) - Math.cos(angle) * (t * 5));
    const ly = Math.round(y - Math.sin(perp) * (t * lowerLobeHeight) - Math.sin(angle) * (t * 5));

    const isTip = s === totalSteps - 1;
    ctx.fillStyle = isTip ? accentColor : bodyColor;

    ctx.fillRect(ux - pixelSize / 2, uy - pixelSize / 2, pixelSize, pixelSize);
    ctx.fillRect(lx - pixelSize / 2, ly - pixelSize / 2, pixelSize, pixelSize);
  }

  ctx.fillStyle = accentColor;
  ctx.fillRect(x - pixelSize / 2, y - pixelSize / 2, pixelSize * 1.4, pixelSize);
}

function drawPixelKoiFast(ctx: CanvasRenderingContext2D, koi: KoiFish) {
  const { scale, phase, type } = koi;
  const pixelSize = Math.max(2, Math.round(3.4 * scale));

  const headColor = "#FFFFFF";
  const bodyColor1 = type === "crimson" ? "#FF3366" : "#FFAA00";
  const bodyColor2 = type === "crimson" ? "#CC0044" : "#FF5500";

  const totalSegments = 12;
  const segments: { x: number; y: number; angle: number; width: number }[] = [];

  for (let i = 0; i < totalSegments; i++) {
    const histIdx = Math.min(koi.history.length - 1, Math.round(i * 1.5));
    const histPoint = koi.history[histIdx] || { x: koi.x, y: koi.y, angle: koi.angle };

    const wave = Math.sin(phase - i * 0.42) * (i * 0.8) * scale;
    const perpAngle = histPoint.angle + Math.PI / 2;

    const sx = histPoint.x + Math.cos(perpAngle) * wave;
    const sy = histPoint.y + Math.sin(perpAngle) * wave;

    let w = 2;
    if (i === 0) w = 3.5;
    else if (i === 1) w = 5.2;
    else if (i === 2) w = 6.4;
    else if (i === 3) w = 7.2;
    else if (i === 4) w = 7.2;
    else if (i === 5) w = 6.4;
    else if (i === 6) w = 5.4;
    else if (i === 7) w = 4.4;
    else if (i === 8) w = 3.4;
    else if (i === 9) w = 2.4;
    else if (i === 10) w = 4.2;
    else w = 6.5;

    segments.push({
      x: sx,
      y: sy,
      angle: histPoint.angle,
      width: w * scale,
    });
  }

  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    const perp = seg.angle + Math.PI / 2;
    const halfW = seg.width;

    let c = bodyColor1;
    if (i <= 1) c = headColor;
    else if (i >= 10) c = bodyColor1;
    else if (i % 3 === 0) c = "#FFFFFF";
    else if (i % 2 === 0) c = bodyColor2;

    ctx.fillStyle = c;
    const steps = Math.max(1, Math.round(halfW * 1.8));
    for (let s = -steps / 2; s <= steps / 2; s++) {
      const px = Math.round(seg.x + Math.cos(perp) * s * (pixelSize * 0.95));
      const py = Math.round(seg.y + Math.sin(perp) * s * (pixelSize * 0.95));
      ctx.fillRect(px - pixelSize / 2, py - pixelSize / 2, pixelSize, pixelSize);
    }
  }
}
