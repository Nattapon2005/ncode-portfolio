"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  ExternalLink,
  Laptop,
  Lock,
  RefreshCw,
  Server,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import type { Project } from "@/data/projects";
import ProjectViewport from "@/components/portfolio/ProjectVisuals";

type ViewportSize = "desktop" | "tablet" | "mobile";

export default function HoloPreviewModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project || typeof document === "undefined") return null;

  const frameWidth =
    viewport === "mobile"
      ? "max-w-[390px]"
      : viewport === "tablet"
      ? "max-w-[768px]"
      : "max-w-full";

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#02050be8] p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} Live Holo Preview`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-[#00D9FF]/40 bg-[#070c18] shadow-[0_0_80px_rgba(0,217,255,0.18)]"
      >
        {/* Top Command HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0a1224] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold tracking-wider text-white sm:text-base">
                  {project.name.toUpperCase()}
                </h3>
                <span className="rounded border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-2 py-0.5 font-mono text-[10px] text-[#00D9FF]">
                  {project.platform}
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-400">{project.subtitle}</p>
            </div>
          </div>

          {/* Interactive Device Size Switcher */}
          {project.demo && (
            <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-[#050914] p-1 font-mono text-[11px] md:flex">
              {(
                [
                  { id: "desktop", label: "DESKTOP", Icon: Laptop },
                  { id: "tablet", label: "TABLET", Icon: Tablet },
                  { id: "mobile", label: "MOBILE", Icon: Smartphone },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setViewport(id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
                    viewport === id
                      ? "bg-[#00D9FF] font-semibold text-[#05070D] shadow-[0_0_12px_#00D9FF66]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIframeLoaded(false);
                  setReloadKey((k) => k + 1);
                }}
                title="Reload Live Frame"
                className="ml-1 cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-[#00D9FF]"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#00D9FF] px-3.5 py-1.5 font-mono text-xs font-bold text-[#05070D] transition-all hover:shadow-[0_0_20px_#00D9FF88]"
              >
                OPEN FULL SITE <ExternalLink size={13} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/5 p-1.5 text-slate-300 transition-colors hover:border-[#FF2E88] hover:text-white"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Inspector Split Layout */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
          {/* Live Interactive Viewport Area */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#040710] p-3 sm:p-5 lg:col-span-8 xl:col-span-9">
            {project.demo ? (
              <div
                className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/15 bg-[#090f1e] shadow-2xl transition-all duration-300 ${frameWidth}`}
              >
                {/* Browser URL Bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#0b1326] px-3 py-1.5 font-mono text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <Lock size={11} className="text-emerald-400" />
                    <span className="truncate text-slate-300">{project.demo}</span>
                  </span>
                  <span className="text-[10px] text-[#00D9FF]">LIVE STREAM</span>
                </div>

                <div className="relative flex-1 bg-white">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#060b17] p-6 text-center font-mono">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00D9FF]/20 border-t-[#00D9FF]" />
                      <p className="text-xs tracking-widest text-[#00D9FF]">
                        CONNECTING TO {project.platform.toUpperCase()}...
                      </p>
                      <p className="max-w-sm text-[11px] text-slate-400">
                        {project.platform === "Render Cloud"
                          ? "Render cloud instances may take 15–30s to wake from idle sleep on initial boot."
                          : "Streaming live production deployment..."}
                      </p>
                    </div>
                  )}
                  <iframe
                    key={`${project.id}-${reloadKey}`}
                    src={project.demo}
                    title={`${project.name} Live Preview`}
                    onLoad={() => setIframeLoaded(true)}
                    className="h-full w-full border-0"
                    loading="eager"
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full max-w-xl flex-col gap-5 rounded-2xl border border-white/10 bg-[#091122] p-6">
                <ProjectViewport project={project} />
                <div className="rounded-xl border border-[#00D9FF]/20 bg-[#050a16] p-4 font-mono text-xs text-slate-300">
                  <p className="flex items-center gap-2 font-semibold text-[#00D9FF]">
                    <Server size={14} /> CLOUD CONTAINER ARCHITECTURE · DOCKER + RENDER
                  </p>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    Containerized PHP 8 + Apache + Cloud MySQL/TiDB production stack with SSL database
                    connections, automated image healing, PromptPay QR checkout, and Leaflet.js GPS
                    delivery tracking.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Telemetry & Specs Drawer */}
          <aside className="flex flex-col justify-between overflow-y-auto border-t border-white/10 bg-[#080e1d] p-5 lg:col-span-4 lg:border-t-0 lg:border-l xl:col-span-3">
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00D9FF]">
                  ▸ SYSTEM OVERVIEW
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.description}</p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00D9FF]">
                  ▸ KEY CAPABILITIES
                </p>
                <ul className="mt-2.5 space-y-2">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-slate-200"
                    >
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00D9FF]">
                  ▸ TECH STACK MATRIX
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2.5 py-1 font-mono text-[11px] text-[#7DD3FC]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D9FF] py-2.5 font-mono text-xs font-bold text-[#05070D] transition-all hover:shadow-[0_0_24px_#00D9FF88]"
                >
                  LAUNCH PRODUCTION WEB <ExternalLink size={14} />
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] py-2.5 font-mono text-xs text-slate-200 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
              >
                <Github size={14} />
                {project.isPrivateRepo ? "GITHUB PROFILE (PRIVATE SRC)" : "VIEW SOURCE REPOSITORY"}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body
  );
}

