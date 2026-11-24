"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Eye,
  ExternalLink,
  Grid2X2,
  Lock,
  Orbit,
  Pause,
  Play,
  Terminal,
} from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import RevealHeading from "@/components/animations/RevealHeading";
import { site } from "@/config/site";
import type { Project, ProjectCategory } from "@/data/projects";
import ProjectViewport from "@/components/portfolio/ProjectVisuals";
import HoloPreviewModal from "@/components/portfolio/HoloPreviewModal";

gsap.registerPlugin(ScrollTrigger);

type ViewMode = "bento" | "orbital";

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "ALL SYSTEMS" },
  { id: "3d-ai", label: "3D & AI APPS" },
  { id: "ecommerce", label: "E-COMMERCE" },
  { id: "frontend", label: "INTERACTIVE UI" },
];

function CyberProjectCard({
  project,
  index,
  compact = false,
  onPreview,
}: {
  project: Project;
  index: number;
  compact?: boolean;
  onPreview: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || rafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((clientY - rect.top) / rect.height) * 100}%`);
    });
  };

  const statusColor =
    project.status === "LIVE"
      ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
      : project.status === "BETA LIVE"
      ? "text-[#C4B5FD] border-[#8B5CF6]/40 bg-[#8B5CF6]/15"
      : "text-[#7DD3FC] border-[#00D9FF]/30 bg-[#00D9FF]/10";

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="cyber-project-card group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6"
    >
      {/* Animated Cyber Corner Lock-On Reticles */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l-2 border-t-2 border-[#00D9FF]/30 transition-all duration-300 group-hover:left-2 group-hover:top-2 group-hover:border-[#00D9FF]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r-2 border-t-2 border-[#00D9FF]/30 transition-all duration-300 group-hover:right-2 group-hover:top-2 group-hover:border-[#00D9FF]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b-2 border-l-2 border-[#00D9FF]/30 transition-all duration-300 group-hover:bottom-2 group-hover:left-2 group-hover:border-[#00D9FF]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b-2 border-r-2 border-[#00D9FF]/30 transition-all duration-300 group-hover:bottom-2 group-hover:right-2 group-hover:border-[#00D9FF]"
      />

      {/* Top Glowing Accent Hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/70 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div>
        {/* Telemetry Top Row */}
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-[#00D9FF]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" />
            <span>SYS_{String(index + 1).padStart(2, "0")}</span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Cloud size={10} className="text-[#00D9FF]/80" />
              {project.platform.toUpperCase()}
            </span>
          </div>

          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider ${statusColor}`}
          >
            ● {project.status}
          </span>
        </div>

        {/* Interactive Holographic Browser Viewport */}
        <ProjectViewport project={project} compact={compact} onPreview={onPreview} />

        {/* Title & Subtitle */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-mono text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#00D9FF] sm:text-2xl">
              {project.name}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-[#7DD3FC]/90">{project.subtitle}</p>
          </div>
          <span className="select-none font-mono text-3xl font-black leading-none text-white/[0.06] transition-colors group-hover:text-[#00D9FF]/15">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Description */}
        <p
          className={`mt-2.5 text-sm leading-relaxed text-slate-300 ${
            compact ? "line-clamp-2" : "line-clamp-3"
          }`}
        >
          {project.description}
        </p>

        {/* Key Highlights (shown in Bento Grid cards) */}
        {!compact && (
          <div className="mt-3.5 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {project.highlights.map((h) => (
              <div
                key={h}
                className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[11px] text-slate-300"
              >
                <Check size={11} className="shrink-0 text-[#00D9FF]" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack Matrix */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[#00D9FF]/20 bg-[#00D9FF]/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#BAE6FD] transition-colors group-hover:border-[#00D9FF]/40"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Command Action Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00D9FF] px-3.5 py-1.5 font-mono text-xs font-bold text-[#05070D] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_#00D9FF99]"
            >
              LIVE DEMO <ExternalLink size={13} />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onPreview(project)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#00D9FF]/40 bg-[#00D9FF]/15 px-3.5 py-1.5 font-mono text-xs font-semibold text-[#00D9FF] transition-all hover:bg-[#00D9FF]/25"
            >
              <Terminal size={13} /> SYSTEM SPECS
            </button>
          )}

          <button
            type="button"
            onClick={() => onPreview(project)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-200 transition-all hover:border-[#00D9FF]/60 hover:bg-[#00D9FF]/10 hover:text-white"
          >
            <Eye size={13} className="text-[#00D9FF]" />
            {project.demo ? "HOLO PREVIEW" : "ARCHITECTURE"}
          </button>
        </div>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:text-[#00D9FF]"
          title={project.isPrivateRepo ? "Private Repository · View GitHub Profile" : "View GitHub Source"}
        >
          {project.isPrivateRepo ? <Lock size={12} className="text-slate-500" /> : <Github size={13} />}
          <span>{project.isPrivateRepo ? "PRIVATE" : "SOURCE"}</span>
        </a>
      </div>
    </article>
  );
}

export default function ProjectsShowcase({
  projects,
  live,
}: {
  projects: Project[];
  live: boolean;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("bento");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // 3D Orbital interactive state
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoOrbit, setAutoOrbit] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const targetRotRef = useRef(0);
  const currentRotRef = useRef(0);
  const draggingRef = useRef<{ active: boolean; startX: number; startRot: number }>({
    active: false,
    startX: 0,
    startRot: 0,
  });

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const total = projects.length;
  const stepDeg = total > 0 ? 360 / total : 72;

  /* Refresh ScrollTrigger positions cleanly when layout height changes */
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [viewMode, activeCategory]);

  /* Space Monolith & Nebula Backdrop Canvas (auto-pauses off-screen) */
  useEffect(() => {
    const cv = canvasRef.current;
    const root = sectionRef.current;
    if (!cv || !root) return;
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
    const parts = Array.from({ length: 65 }, (_, idx) => ({
      x: ((idx * 37) % 100) / 100,
      y: ((idx * 53) % 100) / 100,
      s: (idx % 3) * 0.6 + 0.6,
      v: ((idx % 5) + 1) * 0.008,
    }));

    let t = 0;
    let raf = 0;
    let visible = true;

    const draw = () => {
      if (!visible) {
        raf = 0;
        return;
      }
      t += reduce ? 0 : 0.014;
      const w = cv.width;
      const h = cv.height;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#04060c");
      bg.addColorStop(0.5, "#070e20");
      bg.addColorStop(1, "#04060c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const cx = w * (0.5 + Math.sin(t * 0.25) * 0.02);
      const cy = h * 0.48;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.36);
      core.addColorStop(0, "rgba(0, 217, 255, 0.16)");
      core.addColorStop(0.35, "rgba(139, 92, 246, 0.08)");
      core.addColorStop(1, "transparent");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0, 217, 255, 0.16)";
      ctx.lineWidth = dpr;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          Math.min(w, 1200) * (0.18 + i * 0.06),
          Math.min(h, 900) * (0.045 + i * 0.015),
          t * (i % 2 ? -0.18 : 0.22) + i,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      for (const p of parts) {
        if (!reduce) {
          p.y -= p.v / 30;
          if (p.y < -0.02) p.y = 1.02;
        }
        const alpha = 0.2 + Math.abs(Math.sin(t * 1.6 + p.x * 25)) * 0.45;
        ctx.fillStyle = `rgba(0, 217, 255, ${alpha * 0.45})`;
        ctx.fillRect(p.x * w, p.y * h, p.s * dpr, p.s * dpr);
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
    io.observe(root);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* Interactive 3D Hologram Orbital Engine */
  useEffect(() => {
    if (viewMode !== "orbital" || total === 0) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const renderRing = () => {
      if (autoOrbit && !draggingRef.current.active && !reduce && !previewProject) {
        targetRotRef.current += 0.12;
      }
      currentRotRef.current += (targetRotRef.current - currentRotRef.current) * 0.09;
      const rot = currentRotRef.current;

      const ring = ringRef.current;
      const radius = Math.min(window.innerWidth * 0.36, 470);
      if (ring) {
        ring.style.transform = `rotateX(-5deg) rotateY(${-rot}deg)`;
      }

      let closestIdx = 0;
      let bestFront = -2;

      ringCardsRef.current.forEach((card, i) => {
        if (!card) return;
        let angle = i * stepDeg - rot;
        angle = ((((angle + 180) % 360) + 360) % 360) - 180;
        const front = Math.cos((angle * Math.PI) / 180);
        if (front > bestFront) {
          bestFront = front;
          closestIdx = i;
        }
        card.style.transform = `translate(-50%, -50%) rotateY(${i * stepDeg}deg) translateZ(${radius}px)`;
        card.style.opacity = String(front > -0.2 ? Math.max(0.22, 0.35 + front * 0.65) : 0.08);
        card.style.zIndex = String(100 + Math.round(front * 100));
        card.style.pointerEvents = front > 0.55 ? "auto" : "none";
      });

      setActiveIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
      raf = requestAnimationFrame(renderRing);
    };

    raf = requestAnimationFrame(renderRing);
    return () => cancelAnimationFrame(raf);
  }, [viewMode, total, stepDeg, autoOrbit, previewProject]);

  const jumpToOrbitalCard = (idx: number) => {
    setAutoOrbit(false);
    const current = targetRotRef.current;
    const desired = idx * stepDeg;
    const diff = ((((desired - current) % 360) + 540) % 360) - 180;
    targetRotRef.current = current + diff;
    setActiveIndex(idx);
  };

  const stepOrbital = (dir: -1 | 1) => {
    setAutoOrbit(false);
    const nextIdx = (activeIndex + dir + total) % total;
    jumpToOrbitalCard(nextIdx);
  };

  const liveCount = projects.filter((p) => Boolean(p.demo)).length;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/5 bg-[#04060c] py-28 md:py-36"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Top Mission Control Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[#00D9FF]">
              ▸ SYSTEM://MISSION.DEPLOYMENTS
            </p>
            <RevealHeading text="DEPLOYED SYSTEMS & SHOWCASE" className="mt-2" />
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Production web applications deployed across Vercel Edge &amp; Render Cloud — click any
              viewport to launch the interactive Holo Preview right inside this page.
            </p>
          </div>

          {/* Right Telemetry HUD Pill */}
          <div className="flex flex-wrap items-center gap-3 self-start rounded-2xl border border-white/10 bg-[#080f20]/90 px-4 py-3 font-mono text-xs lg:self-end">
            <div className="flex items-center gap-2 border-r border-white/10 pr-3">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              <span className="text-slate-300">
                <strong className="text-white">{String(projects.length).padStart(2, "0")}</strong>{" "}
                SYSTEMS ({liveCount} LIVE STREAM)
              </span>
            </div>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#00D9FF] hover:underline"
            >
              <Github size={13} /> @{site.github} · {live ? "SYNCED" : "VERIFIED"}
            </a>
          </div>
        </div>

        {/* Interactive Control Deck: Filter Matrix + View Mode Switcher */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#00D9FF]/20 bg-[#070d1c]/90 p-2.5 sm:px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === cat.id).length;
              const active = activeCategory === cat.id && viewMode === "bento";
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (viewMode !== "bento") setViewMode("bento");
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-200 ${
                    active
                      ? "border border-[#00D9FF]/40 bg-[#00D9FF]/15 font-semibold text-[#00D9FF] shadow-[0_0_14px_#00D9FF22]"
                      : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="ml-1.5 text-[10px] opacity-70">[{count}]</span>
                </button>
              );
            })}
          </div>

          {/* Dual Mode Switcher (Cyber Bento vs 3D Hologram Ring) */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-[#040812] p-1 font-mono text-xs md:flex">
            <button
              type="button"
              onClick={() => setViewMode("bento")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "bento"
                  ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_15px_#00D9FF66]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid2X2 size={14} /> CYBER DECK
            </button>
            <button
              type="button"
              onClick={() => setViewMode("orbital")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "orbital"
                  ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_15px_#00D9FF66]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Orbit size={14} /> 3D HOLOGRAM
            </button>
          </div>
        </div>

        {/* MODE 1: CYBER BENTO COMMAND GRID */}
        {viewMode === "bento" && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
            {filteredProjects.map((project, idx) => {
              const isAll = activeCategory === "all";
              const colSpan = isAll
                ? idx < 2
                  ? "lg:col-span-6"
                  : "lg:col-span-4"
                : filteredProjects.length === 2
                ? "lg:col-span-6"
                : "lg:col-span-4";

              return (
                <div key={project.id} className={colSpan}>
                  <CyberProjectCard
                    project={project}
                    index={projects.findIndex((p) => p.id === project.id)}
                    onPreview={setPreviewProject}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* MODE 2: INTERACTIVE 3D HOLOGRAM ORBITAL STAGE */}
        {viewMode === "orbital" && (
          <div className="mt-8 flex flex-col items-center">
            <div
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("a, button, [role='button']")) return;
                setAutoOrbit(false);
                draggingRef.current = {
                  active: true,
                  startX: e.clientX,
                  startRot: targetRotRef.current,
                };
              }}
              onPointerMove={(e) => {
                if (!draggingRef.current.active) return;
                const dx = e.clientX - draggingRef.current.startX;
                targetRotRef.current = draggingRef.current.startRot - dx * 0.28;
              }}
              onPointerUp={() => {
                draggingRef.current.active = false;
              }}
              onPointerLeave={() => {
                draggingRef.current.active = false;
              }}
              className="relative h-[540px] w-full cursor-grab select-none overflow-visible [perspective:1500px] active:cursor-grabbing"
            >
              <div
                ref={ringRef}
                className="relative h-full w-full [transform-style:preserve-3d]"
              >
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    ref={(el) => {
                      ringCardsRef.current[i] = el;
                    }}
                    className="absolute left-1/2 top-1/2 w-[22rem] will-change-transform sm:w-[25rem]"
                  >
                    <CyberProjectCard
                      project={project}
                      index={i}
                      compact
                      onPreview={setPreviewProject}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Orbital Quick-Select HUD Dock */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#080f20]/95 px-4 py-2.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => stepOrbital(-1)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                aria-label="Previous project"
              >
                <ChevronLeft size={15} />
              </button>

              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jumpToOrbitalCard(idx)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all ${
                    activeIndex === idx
                      ? "border border-[#00D9FF]/50 bg-[#00D9FF]/20 font-bold text-[#00D9FF] shadow-[0_0_12px_#00D9FF33]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")} · {p.name.split(" ")[0].toUpperCase()}
                </button>
              ))}

              <button
                type="button"
                onClick={() => stepOrbital(1)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                aria-label="Next project"
              >
                <ChevronRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => setAutoOrbit((v) => !v)}
                className={`ml-2 flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] transition-all ${
                  autoOrbit
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {autoOrbit ? <Pause size={12} /> : <Play size={12} />}
                {autoOrbit ? "AUTO-ORBIT ON" : "AUTO-ORBIT PAUSED"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Holo Live Preview Modal */}
      <HoloPreviewModal
        key={previewProject?.id ?? "closed"}
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </section>
  );
}

