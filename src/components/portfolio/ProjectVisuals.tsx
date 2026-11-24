"use client";
import type { CSSProperties } from "react";
import { Eye, Lock, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";

const EQ_HEIGHTS = [42, 78, 55, 92, 64, 86, 38, 95, 70, 50, 88, 60, 76, 44];

function displayHost(project: Project): string {
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
      className={`group/vp relative overflow-hidden rounded-xl border border-white/10 bg-[#050914] ${
        onPreview ? "cursor-pointer" : ""
      } ${compact ? "h-36" : project.featured ? "h-48 sm:h-52" : "h-44"}`}
    >
      {/* Top Cyber Browser Chrome */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#091022]/90 px-3 py-1.5 font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F56]/80" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD2E]/80" />
          <span className="h-2 w-2 rounded-full bg-[#27C93F]/80" />
        </div>

        <div className="mx-2 flex max-w-[62%] items-center gap-1 truncate rounded-md border border-white/5 bg-[#040711] px-2 py-0.5 text-slate-400">
          <Lock size={9} className="shrink-0 text-[#00D9FF]" />
          <span className="truncate">{host}</span>
        </div>

        <span className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          {project.demo ? "200 OK" : "DOCKER"}
        </span>
      </div>

      {/* Subtle Grid & Sweeping Scanline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00D9FF18_1px,transparent_1px)] [background-size:16px_16px] opacity-60"
      />
      <div
        aria-hidden
        className="hud-viewport-scan pointer-events-none absolute inset-x-0 top-6 z-10 h-12 bg-gradient-to-b from-transparent via-[#00D9FF]/12 to-transparent"
      />

      {/* Bespoke Holographic Schematic per Project */}
      <div className="relative z-10 flex h-[calc(100%-29px)] w-full items-center justify-center px-4">
        {project.visual === "globe" && (
          <div className="relative flex w-full items-center justify-between gap-3">
            <div className="hidden space-y-1.5 font-mono text-[9px] text-slate-400 sm:block">
              <div className="rounded border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2 py-0.5 text-[#00D9FF]">
                ● EARTH_MESH: ACTIVE
              </div>
              <div className="px-1 text-slate-500">LAT 13.75°N · LON 100.50°E</div>
              <div className="flex gap-1 px-1 text-[8px] text-slate-400">
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[#00D9FF]">ASIA</span>
                <span className="rounded bg-white/5 px-1.5 py-0.5">EU</span>
                <span className="rounded bg-white/5 px-1.5 py-0.5">US</span>
              </div>
            </div>

            <svg viewBox="0 0 160 120" className="mx-auto h-28 w-36 shrink-0">
              <defs>
                <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="80" cy="60" r="52" fill="url(#globeGlow)" />
              <g className="orbit-spin-slow" style={{ transformOrigin: "80px 60px" }}>
                <ellipse
                  cx="80"
                  cy="60"
                  rx="48"
                  ry="16"
                  fill="none"
                  stroke="#00D9FF"
                  strokeOpacity="0.35"
                  strokeDasharray="3 3"
                />
              </g>
              <circle cx="80" cy="60" r="34" fill="#071529" stroke="#00D9FF" strokeWidth="1.2" strokeOpacity="0.7" />
              <ellipse cx="80" cy="60" rx="18" ry="34" fill="none" stroke="#00D9FF" strokeOpacity="0.35" />
              <ellipse cx="80" cy="60" rx="34" ry="13" fill="none" stroke="#38BDF8" strokeOpacity="0.35" />
              <line x1="46" y1="60" x2="114" y2="60" stroke="#00D9FF" strokeOpacity="0.25" />
              {/* Glowing Residence Beacons */}
              <circle cx="92" cy="49" r="3" fill="#00D9FF" />
              <circle cx="92" cy="49" r="7" fill="none" stroke="#00D9FF" strokeOpacity="0.6" />
              <circle cx="67" cy="66" r="2.5" fill="#8B5CF6" />
              <circle cx="83" cy="72" r="2" fill="#34D399" />
            </svg>

            <div className="hidden text-right font-mono text-[9px] sm:block">
              <div className="text-white font-semibold">3D RESIDENCES</div>
              <div className="text-[#00D9FF]">DRAG TO ORBIT</div>
              <div className="mt-1 text-[8px] text-slate-500">WEBGL · THREE.JS</div>
            </div>
          </div>
        )}

        {project.visual === "audio" && (
          <div className="flex w-full flex-col items-center justify-center gap-2.5">
            <div className="flex w-full max-w-xs items-center justify-between font-mono text-[9px] text-slate-400">
              <span className="flex items-center gap-1.5 rounded border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 px-2 py-0.5 text-[#C4B5FD]">
                <Sparkles size={10} /> NEXA AI · VOICE ROOM
              </span>
              <span className="text-[#00D9FF]">STREAM 128kbps</span>
            </div>

            {/* Animated Cyber Audio Spectrum */}
            <div className="flex h-16 w-full max-w-xs items-end justify-center gap-1.5 rounded-lg border border-white/5 bg-[#080d1d]/90 px-4 py-2.5">
              {EQ_HEIGHTS.map((h, idx) => (
                <span
                  key={idx}
                  style={
                    {
                      height: `${h}%`,
                      "--eq-dur": `${0.9 + (idx % 5) * 0.22}s`,
                      "--eq-delay": `${(idx % 4) * 0.15}s`,
                    } as CSSProperties
                  }
                  className="eq-bar w-2 rounded-t bg-gradient-to-t from-[#8B5CF6] via-[#3B82F6] to-[#00D9FF]"
                />
              ))}
            </div>

            <div className="flex w-full max-w-xs items-center justify-between font-mono text-[8px] text-slate-500">
              <span>● DISCORD BOT CONNECTED</span>
              <span className="text-emerald-400">QUEUE: ACTIVE</span>
            </div>
          </div>
        )}

        {project.visual === "techgear" && (
          <div className="flex w-full items-center justify-around gap-2">
            {/* Hardware Blueprint + QR Checkout */}
            <svg viewBox="0 0 190 105" className="h-24 w-44">
              {/* GPU / Circuit Card */}
              <rect x="10" y="18" width="96" height="68" rx="7" fill="#09152b" stroke="#3B82F6" strokeWidth="1.2" />
              <circle cx="40" cy="52" r="17" fill="none" stroke="#00D9FF" strokeWidth="1" strokeDasharray="4 2" className="orbit-spin-slow" style={{ transformOrigin: "40px 52px" }} />
              <circle cx="40" cy="52" r="6" fill="#00D9FF33" stroke="#00D9FF" />
              <circle cx="80" cy="52" r="17" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 2" className="orbit-spin-rev" style={{ transformOrigin: "80px 52px" }} />
              <circle cx="80" cy="52" r="6" fill="#3B82F633" stroke="#3B82F6" />
              {/* GPS Tracking Route to QR Box */}
              <path d="M106 52 L128 52" stroke="#00D9FF" strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="128" y="24" width="52" height="56" rx="6" fill="#081224" stroke="#00D9FF" strokeOpacity="0.65" />
              <rect x="137" y="33" width="12" height="12" fill="none" stroke="#00D9FF" strokeWidth="1.4" />
              <rect x="159" y="33" width="12" height="12" fill="none" stroke="#00D9FF" strokeWidth="1.4" />
              <rect x="137" y="55" width="12" height="12" fill="none" stroke="#00D9FF" strokeWidth="1.4" />
              <rect x="157" y="55" width="14" height="12" fill="#34D39944" stroke="#34D399" strokeWidth="1" />
              <text x="154" y="76" fill="#7DD3FC" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
                QR + GPS
              </text>
            </svg>

            <div className="hidden space-y-1 font-mono text-[8.5px] sm:block">
              <div className="rounded border border-[#3B82F6]/30 bg-[#3B82F6]/15 px-2 py-0.5 text-[#7DD3FC]">
                PHP 8 · MYSQL · DOCKER
              </div>
              <div className="text-emerald-400">✓ SLIP UPLOAD</div>
              <div className="text-slate-400">✓ LEAFLET LIVE MAP</div>
            </div>
          </div>
        )}

        {project.visual === "planto" && (
          <div className="flex w-full items-center justify-around gap-3">
            <svg viewBox="0 0 120 105" className="h-24 w-28 shrink-0">
              <circle cx="60" cy="56" r="36" fill="#34D39912" stroke="#34D39944" strokeDasharray="3 3" />
              {/* Geometric Bioluminescent Botanical Leaf */}
              <path
                d="M60 20 C84 32, 90 64, 60 88 C30 64, 36 32, 60 20 Z"
                fill="#0b2622"
                stroke="#34D399"
                strokeWidth="1.4"
              />
              <path d="M60 24 L60 85" stroke="#6EE7B9" strokeWidth="1.1" />
              <path d="M60 44 L76 35 M60 56 L79 47 M60 68 L74 60" stroke="#34D399" strokeOpacity="0.7" strokeWidth="1" />
              <path d="M60 44 L44 35 M60 56 L41 47 M60 68 L46 60" stroke="#34D399" strokeOpacity="0.7" strokeWidth="1" />
            </svg>

            <div className="space-y-1.5 font-mono text-[9px]">
              <div className="rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                GET /api/products · 200
              </div>
              <div className="flex items-center justify-between gap-3 rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-slate-300">
                <span>Monstera Deliciosa</span>
                <span className="text-emerald-400">฿359</span>
              </div>
              <div className="text-[8px] text-slate-500">CART DRAWER · EXPRESS + SCSS</div>
            </div>
          </div>
        )}

        {project.visual === "outdoors" && (
          <div className="flex w-full items-center justify-around gap-3">
            <svg viewBox="0 0 175 100" className="h-24 w-44">
              {/* Futuristic Wireframe Terrain + Constellation FX */}
              <polygon points="18,82 58,32 98,82" fill="#0b1d33" stroke="#38BDF8" strokeWidth="1.2" />
              <polygon points="62,82 108,24 156,82" fill="#0d2542" stroke="#00D9FF" strokeWidth="1.3" />
              <line x1="10" y1="82" x2="165" y2="82" stroke="#00D9FF" strokeOpacity="0.5" />
              {/* Particle Nodes */}
              <g stroke="#00D9FF" strokeOpacity="0.4" strokeWidth="0.8">
                <line x1="34" y1="22" x2="72" y2="16" />
                <line x1="72" y1="16" x2="136" y2="28" />
              </g>
              <circle cx="34" cy="22" r="2.5" fill="#00D9FF" />
              <circle cx="72" cy="16" r="3" fill="#38BDF8" />
              <circle cx="136" cy="28" r="2.5" fill="#8B5CF6" />
            </svg>

            <div className="hidden space-y-1 font-mono text-[8.5px] sm:block">
              <div className="rounded border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-sky-300">
                REACT · VITE · FX
              </div>
              <div className="text-slate-300">60FPS PARTICLE HUD</div>
              <div className="text-slate-500">DYNAMIC OG + SEO</div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Interactive Action Overlay */}
      {onPreview && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-gradient-to-t from-[#040711] via-[#040711]/85 to-transparent px-3.5 py-2 opacity-0 transition-opacity duration-200 group-hover/vp:opacity-100">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#00D9FF]">
            <Eye size={12} /> {project.demo ? "OPEN HOLO LIVE PREVIEW" : "INSPECT SYSTEM ARCHITECTURE"}
          </span>
          <span className="rounded border border-[#00D9FF]/40 bg-[#00D9FF]/15 px-1.5 py-0.5 font-mono text-[9px] text-white">
            CLICK
          </span>
        </div>
      )}
    </div>
  );
}

