"use client";
import { useEffect, useRef, useState } from "react";
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
import RevealHeading from "@/components/animations/RevealHeading";
import ParticleMorphCanvas, { ScrambleText } from "@/components/animations/ParticleMorphCanvas";
import { site } from "@/config/site";
import type { Project, ProjectCategory } from "@/data/projects";
import ProjectViewport from "@/components/portfolio/ProjectVisuals";
import HoloPreviewModal from "@/components/portfolio/HoloPreviewModal";

gsap.registerPlugin(ScrollTrigger);

type ViewMode = "vortex" | "folio" | "bento";

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "ALL SYSTEMS" },
  { id: "3d-ai", label: "3D & AI APPS" },
  { id: "ecommerce", label: "E-COMMERCE" },
  { id: "frontend", label: "INTERACTIVE UI" },
];

const SCULPTURE_LABELS: Record<Project["visual"], string> = {
  globe: "ORBITAL_EARTH_MESH",
  audio: "QUANTUM_SONIC_TORUS",
  techgear: "CYBER_HELIX_CORE",
  planto: "FIBONACCI_BIO_BLOOM",
  outdoors: "INFINITY_PORTAL_LOOP",
};

function CyberProjectCard({
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
      {/* Cyber Corner Reticles */}
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

      <div>
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

        <ProjectViewport project={project} onPreview={onPreview} />

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

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-300">
          {project.description}
        </p>

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
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00D9FF] px-3.5 py-1.5 font-mono text-xs font-bold text-[#05070D] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_#00D9FF99]"
            >
              LIVE DEMO <ExternalLink size={13} />
            </a>
          )}

          <button
            type="button"
            onClick={() => onPreview(project)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-200 transition-all hover:border-[#00D9FF]/60 hover:bg-[#00D9FF]/10 hover:text-white"
          >
            <Eye size={13} className="text-[#00D9FF]" />
            HOLO PREVIEW
          </button>
        </div>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:text-[#00D9FF]"
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
  const [viewMode, setViewMode] = useState<ViewMode>("vortex");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Refs for Active Theory Vortex Panel & Ultranatural 3D Book Flip
  const vortexCardRef = useRef<HTMLDivElement>(null);
  const vortexTiltRef = useRef<HTMLDivElement>(null);
  const folioBookRef = useRef<HTMLDivElement>(null);
  const flipLeafRef = useRef<HTMLDivElement>(null);
  const flipAnimatingRef = useRef(false);

  const total = projects.length;
  const activeProject = projects[activeIndex] ?? projects[0];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  /* Keep ScrollTrigger synced cleanly when switching layouts */
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [viewMode, activeCategory]);

  /* Auto-cycle timer for Vortex 3D mode (pauses when modal open or hovered/disabled) */
  useEffect(() => {
    if (viewMode !== "vortex" || !autoCycle || previewProject || total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5600);
    return () => clearInterval(timer);
  }, [viewMode, autoCycle, previewProject, total]);

  /* Animate Floating Glass Panel materialize on project change in Vortex mode */
  useEffect(() => {
    if (viewMode !== "vortex" || !vortexCardRef.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      vortexCardRef.current,
      { opacity: 0, x: 26, rotateY: -10, scale: 0.97 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      }
    );
  }, [activeIndex, viewMode]);

  /* Ultranatural 3D Book Page-Turn Transition */
  const turnFolioPage = (nextIdx: number) => {
    if (nextIdx === activeIndex || flipAnimatingRef.current || total === 0) return;
    const wrapped = (nextIdx + total) % total;

    if (
      viewMode !== "folio" ||
      !flipLeafRef.current ||
      window.innerWidth < 1024 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveIndex(wrapped);
      return;
    }

    const forward =
      nextIdx > activeIndex || (activeIndex === total - 1 && wrapped === 0 && nextIdx >= total);
    const leaf = flipLeafRef.current;
    flipAnimatingRef.current = true;

    gsap.set(leaf, {
      display: "block",
      left: forward ? "50%" : "0%",
      transformOrigin: forward ? "left center" : "right center",
      rotateY: 0,
      opacity: 1,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(leaf, { display: "none", rotateY: 0 });
        flipAnimatingRef.current = false;
      },
    });

    tl.to(leaf, {
      rotateY: forward ? -90 : 90,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setActiveIndex(wrapped),
    }).to(leaf, {
      rotateY: forward ? -180 : 180,
      opacity: 0.35,
      duration: 0.32,
      ease: "power2.out",
    });
  };

  /* Subtle 3D tilt on Vortex wide glass card (bounded strictly inside its column — zero overflow!) */
  const handleVortexCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = vortexTiltRef.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: nx * 7,
      rotateX: -ny * 5,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const resetVortexCardTilt = () => {
    const el = vortexTiltRef.current;
    if (!el) return;
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3.out" });
  };

  const selectProject = (idx: number) => {
    setAutoCycle(false);
    if (viewMode === "folio") {
      turnFolioPage(idx);
    } else {
      setActiveIndex((idx + total) % total);
    }
  };

  if (!activeProject) return null;

  return (
    <section
      id="projects"
      className="relative isolate scroll-mt-28 overflow-hidden border-y border-white/5 bg-[#04060c] py-28 md:py-36"
    >
      {/* Subtle Ambient Background Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-30"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ── Mission Control Header ───────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[#00D9FF]">
              ▸ SYSTEM://MISSION.DEPLOYMENTS
            </p>
            <RevealHeading text="DEPLOYED SYSTEMS & SHOWCASE" className="mt-2" />
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Interactive 3D showcase of live production web applications — switch between{" "}
              <span className="text-[#00D9FF]">Vortex 3D</span>,{" "}
              <span className="text-[#C4B5FD]">3D Holo Folio</span>, and{" "}
              <span className="text-emerald-300">Bento Grid</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start rounded-2xl border border-white/10 bg-[#080f20]/90 px-4 py-3 font-mono text-xs lg:self-end">
            <div className="flex items-center gap-2 border-r border-white/10 pr-3">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              <span className="text-slate-300">
                <strong className="text-white">{String(total).padStart(2, "0")}/{String(total).padStart(2, "0")}</strong>{" "}
                LIVE DEPLOYMENTS
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

        {/* ── Control Deck (Strictly Separated Above the Stage — Never Overlapped) ── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#00D9FF]/20 bg-[#070d1c]/95 p-2.5 sm:px-4">
          {/* View Mode Selector */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-[#040812] p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setViewMode("vortex")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "vortex"
                  ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_16px_#00D9FF66]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles size={13} /> VORTEX 3D
            </button>
            <button
              type="button"
              onClick={() => setViewMode("folio")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "folio"
                  ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_16px_#00D9FF66]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen size={13} /> 3D FOLIO FLIP
            </button>
            <button
              type="button"
              onClick={() => setViewMode("bento")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "bento"
                  ? "bg-[#00D9FF] font-bold text-[#05070D] shadow-[0_0_16px_#00D9FF66]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid2X2 size={13} /> BENTO GRID
            </button>
          </div>

          {/* Right contextual controls */}
          {viewMode === "bento" ? (
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
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
                    className={`cursor-pointer rounded-lg px-2.5 py-1 transition-all ${
                      active
                        ? "border border-[#00D9FF]/40 bg-[#00D9FF]/15 font-semibold text-[#00D9FF]"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    {cat.label} [{count}]
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => selectProject(activeIndex - 1)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                aria-label="Previous project"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 text-slate-300">
                <strong className="text-[#00D9FF]">{String(activeIndex + 1).padStart(2, "0")}</strong>
                <span className="text-slate-600"> / </span>
                {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => selectProject(activeIndex + 1)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                aria-label="Next project"
              >
                <ChevronRight size={16} />
              </button>

              {viewMode === "vortex" && (
                <button
                  type="button"
                  onClick={() => setAutoCycle((v) => !v)}
                  className={`ml-1 flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] transition-all ${
                    autoCycle
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {autoCycle ? <Pause size={11} /> : <Play size={11} />}
                  {autoCycle ? "AUTO" : "PAUSED"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* =====================================================================
         * MODE 1: ACTIVE THEORY–STYLE 3D PARTICLE MORPH VORTEX STAGE
         * ===================================================================== */}
        {viewMode === "vortex" && (
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#00D9FF]/25 bg-[#03060f] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.85)] sm:p-8 lg:p-10">
            {/* Full-Stage 3D Morphing Particle Sculpture Canvas */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <ParticleMorphCanvas visual={activeProject.visual} />
            </div>

            {/* Subtle Top/Bottom Vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_30%_50%,transparent_28%,rgba(3,6,15,0.78)_85%)]"
            />

            <div className="relative z-10 grid grid-cols-1 items-end gap-8 lg:min-h-[470px] lg:grid-cols-12 lg:items-center">
              {/* Left Column: Open Vista for 3D Particle Sculpture + Active Theory Mission Index */}
              <div className="flex h-full flex-col justify-between gap-6 lg:col-span-5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#00D9FF]/30 bg-[#050b18]/85 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-[#00D9FF]">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#00D9FF]" />
                  MESH // {SCULPTURE_LABELS[activeProject.visual]}
                </div>

                {/* Open space where the 3D particle sculpture shines on mobile/desktop */}
                <div className="h-44 lg:h-40" aria-hidden />

                {/* Bottom-Left Mission Selector List (Never Overlapped!) */}
                <div className="rounded-2xl border border-white/10 bg-[#050a16]/85 p-3 font-mono">
                  <p className="mb-2 px-2 text-[10px] tracking-[0.28em] text-slate-500">
                    SELECT DEPLOYMENT TO MORPH CORE
                  </p>
                  <div className="space-y-1">
                    {projects.map((proj, idx) => {
                      const isCurrent = idx === activeIndex;
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => selectProject(idx)}
                          className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all ${
                            isCurrent
                              ? "border border-[#00D9FF]/45 bg-[#00D9FF]/15 text-white shadow-[0_0_18px_#00D9FF22]"
                              : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            <span
                              className={`text-[10px] ${
                                isCurrent ? "font-bold text-[#00D9FF]" : "text-slate-600"
                              }`}
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate font-semibold tracking-wider">
                              {proj.name.toUpperCase()}
                            </span>
                          </span>
                          <span
                            className={`text-[10px] ${
                              isCurrent ? "text-[#00D9FF]" : "text-slate-600 group-hover:text-slate-400"
                            }`}
                          >
                            {isCurrent ? "● ACTIVE" : proj.platform.split(" ")[0].toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Wide Landscape Frosted Holo-Glass Showcase Panel */}
              <div className="lg:col-span-7 [perspective:1100px]">
                <div
                  ref={vortexTiltRef}
                  onMouseMove={handleVortexCardMove}
                  onMouseLeave={resetVortexCardTilt}
                  className="[transform-style:preserve-3d]"
                >
                  <div
                    ref={vortexCardRef}
                    className="cyber-project-card relative overflow-hidden rounded-2xl border border-[#00D9FF]/30 p-5 sm:p-7"
                  >
                    {/* Top Telemetry Strip */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 font-mono text-[11px]">
                      <div className="flex items-center gap-2 text-[#00D9FF]">
                        <span>PROJECT_{String(activeIndex + 1).padStart(2, "0")}</span>
                        <span className="text-slate-600">{"//"}</span>
                        <span className="text-slate-300">{activeProject.platform}</span>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        {activeProject.status}
                      </span>
                    </div>

                    {/* Holographic Viewport */}
                    <ProjectViewport project={activeProject} onPreview={setPreviewProject} />

                    {/* Scramble-Decoded Title & Details */}
                    <div className="mt-5">
                      <h3 className="font-mono text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        <ScrambleText text={activeProject.name} />
                      </h3>
                      <p className="mt-1 font-mono text-xs tracking-wide text-[#00D9FF]">
                        {activeProject.subtitle}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        {activeProject.description}
                      </p>
                    </div>

                    {/* Key Highlights */}
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {activeProject.highlights.map((h) => (
                        <div
                          key={h}
                          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#050914]/80 px-2.5 py-1.5 text-xs text-slate-200"
                        >
                          <Check size={12} className="shrink-0 text-emerald-400" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack + Action Bar */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#BAE6FD]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {activeProject.demo && (
                          <a
                            href={activeProject.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#00D9FF] px-4 py-2 font-mono text-xs font-bold text-[#05070D] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_#00D9FF99]"
                          >
                            LIVE DEMO <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setPreviewProject(activeProject)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-3.5 py-2 font-mono text-xs font-semibold text-white transition-all hover:bg-[#00D9FF]/20"
                        >
                          <Eye size={13} className="text-[#00D9FF]" /> HOLO PREVIEW
                        </button>
                        <a
                          href={activeProject.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                        >
                          {activeProject.isPrivateRepo ? <Lock size={13} /> : <Github size={13} />}
                          <span>{activeProject.isPrivateRepo ? "PRIVATE" : "SOURCE"}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
         * MODE 2: ULTRANATURAL–STYLE 3D INTERACTIVE BOOK / FOLIO SPREAD
         * ===================================================================== */}
        {viewMode === "folio" && (
          <div className="mt-6">
            {/* Dark Brushed Studio Surface */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_top,#0c162c_0%,#040710_72%)] p-4 shadow-[0_35px_90px_rgba(0,0,0,0.9)] sm:p-8 lg:p-12">
              <div className="mx-auto max-w-6xl [perspective:2000px]">
                <div
                  ref={folioBookRef}
                  className="relative grid grid-cols-1 overflow-hidden rounded-2xl border border-[#00D9FF]/25 bg-[#070d1b] shadow-[0_25px_70px_rgba(0,0,0,0.85)] lg:grid-cols-2 lg:[transform:rotateX(4deg)] [transform-style:preserve-3d]"
                >
                  {/* Center Glowing Book Spine Seam */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#00D9FF]/60 to-transparent shadow-[0_0_18px_#00D9FF] lg:block"
                  />

                  {/* Animated 3D Flipping Page Sheet Overlay */}
                  <div
                    ref={flipLeafRef}
                    aria-hidden
                    style={{ display: "none" }}
                    className="pointer-events-none absolute inset-y-0 z-30 w-1/2 rounded-r-2xl border border-[#00D9FF]/40 bg-gradient-to-br from-[#0e1b36] via-[#091224] to-[#050914] shadow-[0_0_50px_rgba(0,217,255,0.28)]"
                  >
                    <div className="flex h-full flex-col justify-between p-8 opacity-45">
                      <div className="h-3 w-28 rounded bg-[#00D9FF]/40" />
                      <div className="space-y-3">
                        <div className="h-8 w-3/4 rounded bg-white/20" />
                        <div className="h-4 w-full rounded bg-white/10" />
                        <div className="h-4 w-5/6 rounded bg-white/10" />
                      </div>
                      <div className="h-3 w-20 rounded bg-[#00D9FF]/30" />
                    </div>
                  </div>

                  {/* LEFT PAGE: Engineering Story & Architecture */}
                  <div className="relative flex flex-col justify-between border-b border-white/10 bg-gradient-to-br from-[#0a1326] to-[#060b16] p-6 sm:p-9 lg:border-b-0 lg:border-r">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                        <span className="tracking-[0.28em] text-[#00D9FF]">
                          CHAPTER {String(activeIndex + 1).padStart(2, "0")} /{" "}
                          {String(total).padStart(2, "0")}
                        </span>
                        <span>{activeProject.platform.toUpperCase()}</span>
                      </div>

                      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                        A PIECE OF DESIGN · A PIECE OF ENGINEERING
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <ScrambleText text={activeProject.name} />
                      </h3>
                      <p className="mt-1.5 font-mono text-sm text-[#00D9FF]">
                        {activeProject.subtitle}
                      </p>

                      <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
                        {activeProject.description}
                      </p>

                      {/* Numbered Capability List */}
                      <div className="mt-6 space-y-2.5">
                        {activeProject.highlights.map((item, i) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-xs text-slate-200"
                          >
                            <span className="font-mono text-[11px] font-bold text-[#00D9FF]">
                              0{i + 1}
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#BAE6FD]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        PAGE {activeIndex * 2 + 1}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT PAGE: Interactive Live System Preview & Controls */}
                  <div className="relative flex flex-col justify-between bg-gradient-to-bl from-[#0b152b] to-[#050913] p-6 sm:p-9">
                    <div>
                      <div className="mb-4 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-400">LIVE PRODUCTION INTERFACE</span>
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                          {activeProject.status}
                        </span>
                      </div>

                      <ProjectViewport project={activeProject} onPreview={setPreviewProject} />

                      <div className="mt-6 rounded-xl border border-white/10 bg-[#040812]/90 p-4 font-mono text-xs">
                        <p className="text-[10px] tracking-[0.25em] text-[#00D9FF]">
                          ▸ INTERACTIVE DEPLOYMENT ENDPOINT
                        </p>
                        <p className="mt-1.5 truncate text-slate-300">
                          {activeProject.demo ?? activeProject.github}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {activeProject.demo && (
                          <a
                            href={activeProject.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#00D9FF] px-5 py-2.5 font-mono text-xs font-bold text-[#05070D] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_#00D9FF99]"
                          >
                            OPEN LIVE WEBSITE <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setPreviewProject(activeProject)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-2.5 font-mono text-xs font-semibold text-white transition-all hover:bg-[#00D9FF]/20"
                        >
                          <Eye size={14} className="text-[#00D9FF]" /> HOLO PREVIEW
                        </button>
                        <a
                          href={activeProject.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
                        >
                          {activeProject.isPrivateRepo ? <Lock size={13} /> : <Github size={13} />}
                          <span>{activeProject.isPrivateRepo ? "PRIVATE" : "SOURCE"}</span>
                        </a>
                      </div>

                      {/* Flip Page Triggers right on the Folio corners */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => turnFolioPage(activeIndex - 1)}
                          className="flex cursor-pointer items-center gap-1.5 text-slate-400 transition-colors hover:text-[#00D9FF]"
                        >
                          <ChevronLeft size={15} /> PREV CHAPTER
                        </button>
                        <span className="text-[11px] text-slate-500">
                          PAGE {activeIndex * 2 + 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => turnFolioPage(activeIndex + 1)}
                          className="flex cursor-pointer items-center gap-1.5 text-[#00D9FF] transition-colors hover:text-white"
                        >
                          FLIP NEXT PAGE <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Chapter Dock Below the Book (Zero Overlap!) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => turnFolioPage(idx)}
                  className={`cursor-pointer rounded-xl px-3.5 py-2 transition-all ${
                    activeIndex === idx
                      ? "border border-[#00D9FF]/50 bg-[#00D9FF]/20 font-bold text-[#00D9FF] shadow-[0_0_14px_#00D9FF33]"
                      : "border border-white/10 bg-[#070d1c] text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")} · {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
         * MODE 3: 12-COLUMN CYBER BENTO COMMAND GRID
         * ===================================================================== */}
        {viewMode === "bento" && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
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
