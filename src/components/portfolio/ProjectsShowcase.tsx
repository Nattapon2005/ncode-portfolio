"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Eye,
  ExternalLink,
  Grid2X2,
  Lock,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import ParticleMorphCanvas, { ScrambleText } from "@/components/animations/ParticleMorphCanvas";
import type { Project, ProjectCategory } from "@/data/projects";
import ProjectViewport, { displayHost } from "@/components/portfolio/ProjectVisuals";
import HoloBook3D from "@/components/portfolio/HoloBook3D";
import HoloPreviewModal from "@/components/portfolio/HoloPreviewModal";

gsap.registerPlugin(ScrollTrigger);

type ViewMode = "vortex" | "folio" | "bento";

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "3d-ai", label: "3D & AI" },
  { id: "ecommerce", label: "E-COMMERCE" },
  { id: "frontend", label: "FRONTEND FX" },
];

function CyberBentoCard({
  project,
  index,
  onPreview,
}: {
  project: Project;
  index: number;
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

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="cyber-project-card group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6"
    >
      <div>
        <div className="mb-3.5 flex items-center justify-between gap-2 font-mono text-[10px]">
          <span className="flex items-center gap-2 tracking-[0.22em] text-[#00D9FF]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00D9FF]" />
            SYS_{String(index + 1).padStart(2, "0")} · {project.platform.toUpperCase()}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[9px] font-semibold text-emerald-300">
            ● {project.status}
          </span>
        </div>

        <ProjectViewport project={project} onPreview={onPreview} />

        <div className="mt-4">
          <h3 className="font-mono text-xl font-bold text-white transition-colors group-hover:text-[#00D9FF] sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-[#7DD3FC]">{project.subtitle}</p>
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-300">
            {project.description}
          </p>
        </div>

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

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[#00D9FF]/20 bg-[#00D9FF]/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#BAE6FD]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00D9FF] px-3.5 py-1.5 font-mono text-xs font-bold text-[#05070D] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_22px_#00D9FF99]"
            >
              LIVE DEMO <ExternalLink size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={() => onPreview(project)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-200 transition-all hover:border-[#00D9FF]/60 hover:bg-[#00D9FF]/10 hover:text-white"
          >
            <Eye size={13} className="text-[#00D9FF]" /> HOLO PREVIEW
          </button>
        </div>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:text-[#00D9FF]"
        >
          {project.isPrivateRepo ? <Lock size={12} /> : <Github size={13} />}
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
  const [viewMode, setViewMode] = useState<ViewMode>("vortex");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Smooth 3D Curved Panorama Arc Engine (Active Theory Video 1 style!)
  const arcCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const targetSlotRef = useRef(0);
  const currentSlotRef = useRef(0);
  const dragRef = useRef<{ down: boolean; startX: number; startSlot: number; moved: boolean }>({
    down: false,
    startX: 0,
    startSlot: 0,
    moved: false,
  });

  const total = projects.length;
  const activeProject = projects[activeIndex] ?? projects[0];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  /* Refresh ScrollTrigger positions whenever viewMode changes */
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [viewMode, activeCategory]);

  const jumpToProject = (idx: number, manual = true) => {
    if (total === 0) return;
    if (manual) setAutoPlay(false);
    const wrapped = ((idx % total) + total) % total;

    // Move along shortest circular arc
    const cur = targetSlotRef.current;
    const curMod = ((cur % total) + total) % total;
    let diff = wrapped - curMod;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    targetSlotRef.current = Math.round(cur + diff);
    setActiveIndex(wrapped);
  };

  /* Auto-advance in Vortex Arc mode */
  useEffect(() => {
    if (viewMode !== "vortex" || !autoPlay || previewProject || total <= 1) return;
    const id = setInterval(() => {
      targetSlotRef.current += 1;
      const wrapped = ((Math.round(targetSlotRef.current) % total) + total) % total;
      setActiveIndex(wrapped);
    }, 5200);
    return () => clearInterval(id);
  }, [viewMode, autoPlay, previewProject, total]);

  /* 60fps Curved 3D Frosted-Glass Panorama Renderer (Left Wing + Center Hero + Right Wing) */
  useEffect(() => {
    if (viewMode !== "vortex" || total === 0) return;
    let raf = 0;

    const tick = () => {
      currentSlotRef.current += (targetSlotRef.current - currentSlotRef.current) * 0.095;
      const slot = currentSlotRef.current;

      const isDesktop = window.innerWidth >= 1024;
      const spreadX = isDesktop ? Math.min(window.innerWidth * 0.34, 490) : window.innerWidth * 0.78;

      let nearestIdx = 0;
      let minAbs = 999;

      arcCardsRef.current.forEach((el, i) => {
        if (!el) return;
        let delta = (i - slot) % total;
        if (delta > total / 2) delta -= total;
        if (delta < -total / 2) delta += total;

        const abs = Math.abs(delta);
        if (abs < minAbs) {
          minAbs = abs;
          nearestIdx = i;
        }

        // Smooth curved panorama math (exact Active Theory 3-card curved stage!)
        const x = delta * spreadX;
        const z = -Math.min(abs * 210, 360);
        const rotY = Math.max(-36, Math.min(36, -delta * 30));
        const scale = Math.max(0.68, 1 - abs * 0.18);
        const opacity = abs > 1.55 ? 0 : Math.max(0.18, 1 - abs * 0.46);

        el.style.transform = `translate3d(-50%, -50%, 0px) translate3d(${x.toFixed(
          1
        )}px, 0px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round((2 - abs) * 20));
        el.style.pointerEvents = abs < 1.35 ? "auto" : "none";
      });

      if (dragRef.current.down) {
        setActiveIndex((prev) => (prev !== nearestIdx ? nearestIdx : prev));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [viewMode, total]);

  /* Keyboard Left/Right navigation when in Vortex or Folio */
  useEffect(() => {
    if (previewProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") jumpToProject(activeIndex + 1, true);
      if (e.key === "ArrowLeft") jumpToProject(activeIndex - 1, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, previewProject, total]);

  if (!activeProject) return null;

  return (
    <section
      id="projects"
      className="relative isolate min-h-screen w-full scroll-mt-20 overflow-hidden border-y border-white/5 bg-[#02040a]"
    >
      {/* =====================================================================
       * MODE 1 (DEFAULT): 100% ACTIVE THEORY FULL-BLEED 3D CURVED GLASS STAGE
       * ===================================================================== */}
      {viewMode === "vortex" && (
        <div className="relative flex min-h-screen w-full flex-col justify-between px-6 pt-28 pb-10 sm:px-10">
          {/* Towering Full-Viewport 1,120-Particle Morphing Spine & Sculptures */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <ParticleMorphCanvas visual={activeProject.visual} />
          </div>

          {/* Atmospheric Cosmic Edge Vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_75%_65%_at_50%_48%,transparent_25%,rgba(2,4,10,0.82)_100%)]"
          />

          {/* ── TOP HUD ROW (Safe below fixed Navbar — Never overlaps!) ── */}
          <div className="relative z-30 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.38em] text-[#00D9FF]">
                ▸ FEATURED DEPLOYMENTS // {live ? "GITHUB SYNCED" : "PRODUCTION LIVE"}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                SELECTED WORKS{" "}
                <span className="font-mono text-base font-normal text-[#00D9FF]">
                  [{String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}]
                </span>
              </h2>
            </div>

            {/* Minimal Floating Cyber Scene Switcher Pill */}
            <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/15 bg-[#060b18]/85 p-1 font-mono text-[11px] shadow-[0_12px_40px_rgba(0,0,0,0.75)]">
              <button
                type="button"
                onClick={() => setViewMode("vortex")}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#00D9FF] px-3.5 py-1.5 font-bold text-[#05070D] shadow-[0_0_18px_#00D9FF88]"
              >
                <Sparkles size={12} /> VORTEX 3D
              </button>
              <button
                type="button"
                onClick={() => setViewMode("folio")}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <BookOpen size={12} /> 3D BOOK FLIP
              </button>
              <button
                type="button"
                onClick={() => setViewMode("bento")}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Grid2X2 size={12} /> ALL GRID
              </button>
            </div>
          </div>

          {/* ── CENTER ROW: 3-CARD CURVED 3D FROSTED-GLASS PANORAMA ── */}
          <div
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("a, button")) return;
              setAutoPlay(false);
              dragRef.current = {
                down: true,
                startX: e.clientX,
                startSlot: targetSlotRef.current,
                moved: false,
              };
            }}
            onPointerMove={(e) => {
              if (!dragRef.current.down) return;
              const dx = e.clientX - dragRef.current.startX;
              if (Math.abs(dx) > 6) dragRef.current.moved = true;
              targetSlotRef.current = dragRef.current.startSlot - dx / 320;
            }}
            onPointerUp={() => {
              if (!dragRef.current.down) return;
              dragRef.current.down = false;
              const snapped = Math.round(targetSlotRef.current);
              targetSlotRef.current = snapped;
              setActiveIndex(((snapped % total) + total) % total);
            }}
            onPointerLeave={() => {
              if (!dragRef.current.down) return;
              dragRef.current.down = false;
              const snapped = Math.round(targetSlotRef.current);
              targetSlotRef.current = snapped;
              setActiveIndex(((snapped % total) + total) % total);
            }}
            className="relative z-20 my-6 h-[310px] w-full cursor-grab select-none [perspective:1400px] active:cursor-grabbing sm:h-[370px] lg:h-[410px]"
          >
            <div className="relative h-full w-full [transform-style:preserve-3d]">
              {projects.map((proj, idx) => {
                const isCenter = idx === activeIndex;
                const host = displayHost(proj);

                return (
                  <div
                    key={proj.id}
                    ref={(el) => {
                      arcCardsRef.current[idx] = el;
                    }}
                    onClick={() => {
                      if (dragRef.current.moved) return;
                      if (!isCenter) {
                        jumpToProject(idx, true);
                      } else {
                        setPreviewProject(proj);
                      }
                    }}
                    className="group/glass absolute left-1/2 top-1/2 aspect-[16/10] w-[min(86vw,580px)] cursor-pointer overflow-hidden rounded-2xl border border-white/25 bg-[#081124]/75 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.88),0_0_45px_rgba(0,217,255,0.14),inset_0_1px_0_rgba(255,255,255,0.3)] transition-colors duration-300 hover:border-[#00D9FF]/70 will-change-transform"
                  >
                    {/* Inner Full-Bleed OG / Live Website Preview Canvas */}
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#040710]">
                      <Image
                        src={proj.image}
                        alt={proj.name}
                        fill
                        priority={idx < 2}
                        sizes="(max-width: 768px) 88vw, 580px"
                        className="object-cover object-top brightness-[0.82] transition-all duration-700 group-hover/glass:scale-105 group-hover/glass:brightness-95"
                      />

                      {/* Frosted Glass Sheen + Atmospheric Dark Gradient */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.14)_0%,transparent_38%,transparent_65%,rgba(0,217,255,0.12)_100%)]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#02050d]/95 via-[#02050d]/35 to-[#02050d]/55"
                      />

                      {/* Top Social Link URL Strip */}
                      <div className="absolute inset-x-3.5 top-3 flex items-center justify-between font-mono text-[10px]">
                        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#040814]/80 px-3 py-1 text-slate-200">
                          <Lock size={9} className="text-[#00D9FF]" />
                          {host}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-[#040814]/85 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                          {proj.platform.toUpperCase()}
                        </span>
                      </div>

                      {/* Active Theory Center Editorial Overlay + Scramble Title */}
                      <div className="absolute inset-x-5 bottom-4 flex flex-col justify-end sm:inset-x-7 sm:bottom-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#00D9FF]">
                          0{idx + 1} {"//"} {proj.subtitle}
                        </p>
                        <div className="mt-1 flex items-end justify-between gap-3">
                          <h3 className="font-mono text-2xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-4xl">
                            {isCenter ? <ScrambleText text={proj.name} /> : proj.name}
                          </h3>
                          <span className="hidden shrink-0 rounded-full border border-[#00D9FF]/50 bg-[#00D9FF]/15 px-3 py-1 font-mono text-[10px] font-semibold text-[#00D9FF] transition-all group-hover/glass:bg-[#00D9FF] group-hover/glass:text-[#05070D] sm:inline-flex">
                            {isCenter ? "HOLO INSPECT ↗" : "SELECT ▸"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BOTTOM ACTIVE THEORY HUD (Bottom-Left Project List + Bottom-Right Details) ── */}
          <div className="relative z-30 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-6 lg:grid-cols-12">
            {/* Bottom-Left: Minimal Vertical Selector + Pill CTA (Exact Video 1 00:00 layout!) */}
            <div className="lg:col-span-6">
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.32em] text-slate-400">
                SELECT DEPLOYED SYSTEM TO MORPH
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs sm:flex-row">
                {projects.map((p, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => jumpToProject(idx, true)}
                      className={`group flex cursor-pointer items-center gap-2 py-1 text-left transition-all ${
                        active ? "font-bold text-white" : "text-slate-500 hover:text-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          active
                            ? "scale-125 bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"
                            : "bg-slate-600 group-hover:bg-slate-400"
                        }`}
                      />
                      <span className="tracking-wider">{p.name.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Pills right below the list */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {activeProject.demo && (
                  <a
                    href={activeProject.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#00D9FF] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#05070D] shadow-[0_0_25px_#00D9FF66] transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    LAUNCH LIVE SITE <ExternalLink size={13} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewProject(activeProject)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-[#00D9FF] hover:text-[#00D9FF]"
                >
                  <Eye size={13} className="text-[#00D9FF]" /> HOLO LIVE PREVIEW
                </button>
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                >
                  {activeProject.isPrivateRepo ? <Lock size={13} /> : <Github size={13} />}
                  <span>{activeProject.isPrivateRepo ? "PRIVATE" : "GITHUB"}</span>
                </a>
              </div>
            </div>

            {/* Bottom-Right: Active Spec Readout + Orbit Controls */}
            <div className="flex flex-col items-start justify-between gap-4 lg:col-span-6 lg:items-end lg:text-right">
              <p className="max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
                {activeProject.description}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {activeProject.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#BAE6FD]"
                  >
                    {t}
                  </span>
                ))}

                <div className="ml-2 flex items-center gap-1 rounded-full border border-white/15 bg-[#060c1a]/90 p-1 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => jumpToProject(activeIndex - 1, true)}
                    className="cursor-pointer rounded-full p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-[#00D9FF]"
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoPlay((v) => !v)}
                    className="flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[10px] text-slate-300 hover:text-white"
                  >
                    {autoPlay ? <Pause size={11} className="text-emerald-400" /> : <Play size={11} />}
                    {autoPlay ? "AUTO" : "PAUSE"}
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpToProject(activeIndex + 1, true)}
                    className="cursor-pointer rounded-full p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-[#00D9FF]"
                    aria-label="Next project"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * MODE 2 & 3: ULTRANATURAL 3D FLIPPING BOOK OR BENTO GRID
       * ===================================================================== */}
      {viewMode !== "vortex" && (
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-24">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.38em] text-[#00D9FF]">
                ▸ {viewMode === "folio" ? "INTERACTIVE 3D ENGINEERING FOLIO" : "ALL DEPLOYED SYSTEMS"}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                {viewMode === "folio" ? "3D HOLOGRAPHIC LOOKBOOK" : "CYBER COMMAND GRID"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/15 bg-[#060b18]/90 p-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode("vortex")}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Sparkles size={12} /> VORTEX 3D
              </button>
              <button
                type="button"
                onClick={() => setViewMode("folio")}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all ${
                  viewMode === "folio"
                    ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_18px_#00D9FF88]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <BookOpen size={12} /> 3D BOOK FLIP
              </button>
              <button
                type="button"
                onClick={() => setViewMode("bento")}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all ${
                  viewMode === "bento"
                    ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_18px_#00D9FF88]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Grid2X2 size={12} /> ALL GRID
              </button>
            </div>
          </div>

          {viewMode === "folio" && (
            <HoloBook3D
              projects={projects}
              activeIndex={activeIndex}
              onSelect={(idx) => jumpToProject(idx, true)}
              onPreview={setPreviewProject}
            />
          )}

          {viewMode === "bento" && (
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {CATEGORIES.map((cat) => {
                    const count =
                      cat.id === "all"
                        ? projects.length
                        : projects.filter((p) => p.category === cat.id).length;
                    const active = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 transition-all ${
                          active
                            ? "border border-[#00D9FF]/50 bg-[#00D9FF]/15 font-bold text-[#00D9FF]"
                            : "border border-white/10 bg-[#060b16] text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat.label} [{count}]
                      </button>
                    );
                  })}
                </div>
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <Cloud size={13} className="text-[#00D9FF]" /> VERCEL EDGE + RENDER CLOUD
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
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
                      <CyberBentoCard
                        project={project}
                        index={projects.findIndex((p) => p.id === project.id)}
                        onPreview={setPreviewProject}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Holo Live Preview Modal */}
      <HoloPreviewModal
        key={previewProject?.id ?? "closed"}
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </section>
  );
}
