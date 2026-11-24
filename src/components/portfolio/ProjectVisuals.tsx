"use client";
import Image from "next/image";
import { Eye, ExternalLink, Globe, Lock } from "lucide-react";
import type { Project } from "@/data/projects";

export function displayHost(project: Project): string {
  if (project.demo) {
    try {
      return new URL(project.demo).host;
    } catch {
      return project.demo.replace(/^https?:\/\//, "");
    }
  }
  return `${project.id}.render.cloud`;
}

export default function ProjectViewport({
  project,
  compact = false,
  onPreview,
}: {
  project: Project;
  compact?: boolean;
  onPreview?: (p: Project) => void;
}) {
  const host = displayHost(project);

  return (
    <div
      onClick={() => onPreview?.(project)}
      role={onPreview ? "button" : undefined}
      tabIndex={onPreview ? 0 : undefined}
      onKeyDown={(e) => {
        if (onPreview && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onPreview(project);
        }
      }}
      className={`group/vp relative overflow-hidden rounded-xl border border-white/15 bg-[#050914] shadow-[0_16px_40px_rgba(0,0,0,0.65)] ${
        onPreview ? "cursor-pointer" : ""
      } ${compact ? "aspect-[16/10]" : "aspect-[16/10]"}`}
    >
      {/* Top Social Link / Cyber Browser Chrome */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#080e1f]/95 px-3 py-1.5 font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F56]/85" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD2E]/85" />
          <span className="h-2 w-2 rounded-full bg-[#27C93F]/85" />
        </div>

        <div className="mx-2 flex max-w-[65%] items-center gap-1.5 truncate rounded-md border border-white/10 bg-[#040711] px-2.5 py-0.5 text-slate-300">
          <Lock size={9} className="shrink-0 text-[#00D9FF]" />
          <span className="truncate">{host}</span>
        </div>

        <span className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          LIVE
        </span>
      </div>

      {/* Real Deployed Website OG / Live Screenshot Preview */}
      <div className="relative h-[calc(100%-29px)] w-full overflow-hidden bg-[#040710]">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.subtitle}`}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 620px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/vp:scale-105"
        />

        {/* Subtle Cyber Scanline & Vignette Polish */}
        <div
          aria-hidden
          className="hud-viewport-scan pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-transparent via-[#00D9FF]/15 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040711]/90 via-transparent to-transparent"
        />

        {/* Social Link Preview Metadata Bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 px-3.5 py-2">
          <span className="flex items-center gap-1.5 truncate font-mono text-[10px] text-slate-200">
            <Globe size={11} className="shrink-0 text-[#00D9FF]" />
            <span className="truncate">{host}</span>
          </span>

          {onPreview ? (
            <span className="flex items-center gap-1 rounded-md border border-[#00D9FF]/40 bg-[#050b18]/90 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#00D9FF] transition-colors group-hover/vp:bg-[#00D9FF] group-hover/vp:text-[#05070D]">
              <Eye size={10} /> HOLO PREVIEW
            </span>
          ) : (
            project.demo && (
              <span className="flex items-center gap-1 font-mono text-[9px] text-[#00D9FF]">
                OPEN <ExternalLink size={10} />
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
