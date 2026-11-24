"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  Lock,
} from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import type { Project } from "@/data/projects";
import { displayHost } from "@/components/portfolio/ProjectVisuals";

function BookLeftPage({
  project,
  index,
  total,
  onPrev,
}: {
  project: Project;
  index: number;
  total: number;
  onPrev?: () => void;
}) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0c1426] via-[#080e1c] to-[#050912] p-6 sm:p-8 lg:p-10">
      {/* Subtle Page Crease Shadow on the Right Spine */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/55 to-transparent"
      />

      {/* Top Editorial Header */}
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] tracking-[0.26em] text-slate-400">
          <span className="text-[#00D9FF]">
            CHAPTER {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span>{project.platform.toUpperCase()}</span>
        </div>

        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.32em] text-slate-500">
          A PIECE OF DESIGN · A PIECE OF ENGINEERING
        </p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-[#00D9FF] sm:text-sm">{project.subtitle}</p>

        <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
          {project.description}
        </p>

        {/* Architectural Feature Cards */}
        <div className="mt-5 space-y-2">
          {project.highlights.map((item, idx) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-xs text-slate-200"
            >
              <span className="font-mono text-[10px] font-bold text-[#00D9FF]">
                0{idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stack + Page Footer */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2 py-0.5 font-mono text-[10px] text-[#BAE6FD]"
            >
              {t}
            </span>
          ))}
        </div>

        {onPrev ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="flex cursor-pointer items-center gap-1 font-mono text-[11px] text-slate-400 transition-colors hover:text-[#00D9FF]"
          >
            <ChevronLeft size={14} /> PREV PAGE
          </button>
        ) : (
          <span className="font-mono text-[10px] text-slate-600">FOLIO P.0{index * 2 + 1}</span>
        )}
      </div>
    </div>
  );
}

function BookRightPage({
  project,
  index,
  onPreview,
  onNext,
}: {
  project: Project;
  index: number;
  onPreview: (p: Project) => void;
  onNext?: () => void;
}) {
  const host = displayHost(project);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-bl from-[#0e182e] via-[#091020] to-[#050811] p-6 sm:p-8 lg:p-10">
      {/* Subtle Page Crease Shadow on the Left Spine */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/55 to-transparent"
      />

      <div>
        <div className="mb-3.5 flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] tracking-[0.22em]">
          <span className="truncate text-slate-400">{host.toUpperCase()}</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {project.status}
          </span>
        </div>

        {/* Real OG / Live Screenshot Spread Frame */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPreview(project);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPreview(project);
            }
          }}
          className="group/img relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border border-[#00D9FF]/30 bg-[#040710] shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
        >
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(max-width: 1024px) 92vw, 540px"
            className="object-cover object-top transition-transform duration-700 group-hover/img:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040710]/85 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px]">
            <span className="rounded-md border border-white/15 bg-[#050914]/90 px-2.5 py-1 text-slate-200">
              🔒 {host}
            </span>
            <span className="rounded-md bg-[#00D9FF] px-2.5 py-1 font-bold text-[#05070D]">
              CLICK FOR LIVE HOLO
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons + Page Turn Trigger */}
      <div className="relative z-10 mt-5 space-y-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#00D9FF] px-4 py-2 font-mono text-xs font-bold text-[#05070D] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_#00D9FF99]"
            >
              LIVE DEMO <ExternalLink size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(project);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-3.5 py-2 font-mono text-xs font-semibold text-white transition-all hover:bg-[#00D9FF]/20"
          >
            <Eye size={13} className="text-[#00D9FF]" /> HOLO PREVIEW
          </button>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-[#00D9FF] hover:text-[#00D9FF]"
          >
            {project.isPrivateRepo ? <Lock size={13} /> : <Github size={13} />}
            <span>{project.isPrivateRepo ? "PRIVATE" : "SOURCE"}</span>
          </a>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px]">
          <span className="text-slate-500">FOLIO P.0{index * 2 + 2}</span>
          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="flex cursor-pointer items-center gap-1 font-semibold text-[#00D9FF] transition-colors hover:text-white"
            >
              TURN PAGE <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Ultranatural (Video 2)–Inspired Real Double-Sided Stacked 3D Holographic Lookbook
 * Resting on a dark brushed-obsidian studio surface with realistic 3D page-turning physics.
 */
export default function HoloBook3D({
  projects,
  activeIndex,
  onSelect,
  onPreview,
}: {
  projects: Project[];
  activeIndex: number;
  onSelect: (idx: number) => void;
  onPreview: (p: Project) => void;
}) {
  const total = projects.length;
  const [stackIndex, setStackIndex] = useState(activeIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStackIndex(activeIndex);
    }, 430);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const currentProject = projects[activeIndex] ?? projects[0];

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Top Lookbook Chapter Tabs (Just like Ultranatural 00:01) */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px]">
        {projects.map((p, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(idx)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 transition-all ${
                active
                  ? "border border-[#00D9FF]/60 bg-[#00D9FF]/20 font-bold text-white shadow-[0_0_16px_#00D9FF44]"
                  : "border border-white/10 bg-[#060b16]/80 text-slate-400 hover:border-white/25 hover:text-slate-200"
              }`}
            >
              <span className="mr-1.5 text-[#00D9FF]">{String(idx + 1).padStart(2, "0")}</span>
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Brushed Dark Obsidian Studio Desk Stage */}
      <div
        className="relative rounded-3xl border border-white/10 p-4 shadow-[0_40px_100px_rgba(0,0,0,0.95)] sm:p-8 lg:px-12 lg:py-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 55% at 50% 18%, rgba(0,217,255,0.12), transparent 70%), repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px), linear-gradient(180deg, #070c18 0%, #03050b 100%)",
        }}
      >
        {/* DESKTOP: True Stacked Double-Sided 3D Turning Book */}
        <div className="hidden lg:block [perspective:2400px]">
          <div className="relative mx-auto h-[500px] w-full rounded-2xl border border-white/15 bg-[#04070f] shadow-[0_35px_80px_rgba(0,0,0,0.92),0_0_40px_rgba(0,217,255,0.08)] [transform:rotateX(6deg)] [transform-style:preserve-3d]">
            {/* Base Left Board: Project 0 Left Page */}
            <div className="absolute inset-y-0 left-0 z-[1] w-1/2 overflow-hidden rounded-l-2xl border-r border-white/10">
              <BookLeftPage project={projects[0]} index={0} total={total} />
            </div>

            {/* Base Right Board: Last Project Right Page */}
            <div className="absolute inset-y-0 right-0 z-[1] w-1/2 overflow-hidden rounded-r-2xl">
              <BookRightPage
                project={projects[total - 1]}
                index={total - 1}
                onPreview={onPreview}
                onNext={() => onSelect(0)}
              />
            </div>

            {/* Stacked Double-Sided Physical Sheets (0 .. total-2) */}
            {projects.slice(0, total - 1).map((proj, sheetIdx) => {
              const isTurned = sheetIdx < activeIndex;
              const minIdx = Math.min(activeIndex, stackIndex);
              const maxIdx = Math.max(activeIndex, stackIndex);
              const isMoving = sheetIdx >= minIdx && sheetIdx < maxIdx;

              const zIndex = isMoving
                ? 60 + sheetIdx
                : sheetIdx < stackIndex
                ? 10 + sheetIdx
                : 10 + (total - sheetIdx);

              const nextProject = projects[sheetIdx + 1];

              return (
                <div
                  key={proj.id}
                  style={{
                    zIndex,
                    transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                    transition: "transform 0.86s cubic-bezier(0.645, 0.045, 0.355, 1)",
                  }}
                  className="absolute inset-y-0 left-1/2 w-1/2 origin-left [transform-style:preserve-3d]"
                >
                  {/* FRONT FACE: Right Page of Spread `sheetIdx` */}
                  <div
                    onClick={() => onSelect(sheetIdx + 1)}
                    className="backface-hidden absolute inset-0 cursor-pointer overflow-hidden rounded-r-2xl border-l border-white/10 shadow-[-8px_0_25px_rgba(0,0,0,0.45)]"
                  >
                    <BookRightPage
                      project={proj}
                      index={sheetIdx}
                      onPreview={onPreview}
                      onNext={() => onSelect(sheetIdx + 1)}
                    />
                  </div>

                  {/* BACK FACE: Left Page of Spread `sheetIdx + 1` */}
                  <div
                    onClick={() => onSelect(sheetIdx)}
                    className="backface-hidden absolute inset-0 cursor-pointer overflow-hidden rounded-l-2xl border-r border-white/10 shadow-[8px_0_25px_rgba(0,0,0,0.45)] [transform:rotateY(180deg)]"
                  >
                    <BookLeftPage
                      project={nextProject}
                      index={sheetIdx + 1}
                      total={total}
                      onPrev={() => onSelect(sheetIdx)}
                    />
                  </div>
                </div>
              );
            })}

            {/* Glowing Center Book Spine Line */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 z-[80] w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#00D9FF]/20 via-[#00D9FF]/80 to-[#8B5CF6]/30 shadow-[0_0_18px_#00D9FF]"
            />
          </div>

          {/* Subtle Desk Surface Reflection Glow Underneath the Book */}
          <div
            aria-hidden
            className="mx-auto mt-3 h-5 w-[92%] rounded-full bg-gradient-to-r from-transparent via-[#00D9FF]/18 to-transparent blur-md"
          />
        </div>

        {/* MOBILE / TABLET (< lg): Clean Responsive Two-Page Spread Card */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/15 lg:hidden">
          <BookLeftPage
            project={currentProject}
            index={activeIndex}
            total={total}
            onPrev={activeIndex > 0 ? () => onSelect(activeIndex - 1) : undefined}
          />
          <BookRightPage
            project={currentProject}
            index={activeIndex}
            onPreview={onPreview}
            onNext={() => onSelect((activeIndex + 1) % total)}
          />
        </div>
      </div>
    </div>
  );
}
