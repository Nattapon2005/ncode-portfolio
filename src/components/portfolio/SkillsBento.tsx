"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bentoSkills, workstationApps, type SkillCategory } from "@/data/projects";
import TiltCard from "@/components/animations/TiltCard";
import RevealHeading from "@/components/animations/RevealHeading";
import MatrixRain from "@/components/animations/MatrixRain";

gsap.registerPlugin(ScrollTrigger);

export default function SkillsBento() {
  const [activeTab, setActiveTab] = useState<SkillCategory>("all");
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [bangkokTime, setBangkokTime] = useState<string>("");

  /* bento cards pop-in + pills cascade when entering view */
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-bento]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, scale: 0.94 },
          {
            opacity: 1, y: 0, scale: 1,
            ease: "power2.out",
            duration: 0.9,
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });
      gsap.fromTo(
        "[data-tile]",
        { opacity: 0, y: 14, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          ease: "back.out(1.8)",
          duration: 0.45,
          stagger: { each: 0.035, from: "random" },
          scrollTrigger: { trigger: "[data-tile]", start: "top 90%", toggleActions: "play none none reverse" },
        }
      );
    }, "#skills");
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Bangkok",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      };
      setBangkokTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredSkills = activeTab === "all"
    ? bentoSkills
    : bentoSkills.filter((s) => s.category === activeTab);

  return (
    <section id="skills" className="relative mx-auto max-w-7xl scroll-mt-28 px-6 py-36 md:py-44">
      {/* Section Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
          Core Capabilities & Stack
        </p>
        <RevealHeading
          text="THE STACK BEHIND EVERYTHING I SHIP"
          className="mt-2"
        />
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          From typed frontend components to resilient backend APIs and automated workflows.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="relative overflow-hidden">
        {/* cyber rain flooding the gaps between cards */}
        <MatrixRain className="opacity-40" />
        {/* travelling scan light across the whole grid */}
        <span
          aria-hidden
          className="bento-scan pointer-events-none absolute inset-x-0 z-20 h-16 opacity-70"
          style={{ background: "linear-gradient(to bottom, transparent, #00D9FF14 45%, #00D9FF1f 55%, transparent)" }}
        />
        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CARD 1: HOW I WORK (Left top, 5 cols) */}
        <div data-bento className="lg:col-span-5">
          <TiltCard className="h-full">
            <div className="flex h-full flex-col justify-between p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]/90">
                  HOW I WORK
                </p>
                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  High agency, async-first, ships fast
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Iterative design with rapid prototyping, typed safety, and clean git history.
                </p>
              </div>

              {/* Isometric 3D Wireframe Illustration */}
              <div className="relative my-6 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-[#080d1a]/60">
                <div className="absolute inset-0 bg-[radial-gradient(#00D9FF15_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* SVG Isometric Blueprint Wave */}
                <svg
                  viewBox="0 0 320 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full max-w-[280px] transition-transform duration-500 hover:scale-105"
                >
                  <g stroke="#00D9FF" strokeWidth="0.8" opacity="0.65">
                    {/* Isometric Grid Floor */}
                    <path d="M40 90 L160 30 L280 90 L160 150 Z" strokeDasharray="3 3" opacity="0.3" />
                    <path d="M70 105 L160 60 L250 105 L160 150 Z" opacity="0.2" />

                    {/* Wireframe Extruded Bar Graph (Card 1 in Image 2) */}
                    <path d="M100 110 L100 70 L120 60 L120 100 Z" fill="#00D9FF18" />
                    <path d="M120 60 L140 70 L140 110 L120 100 Z" fill="#00D9FF30" />
                    <path d="M100 70 L120 60 L140 70 L120 80 Z" fill="#00D9FF50" />

                    <path d="M135 125 L135 50 L155 40 L155 115 Z" fill="#3B82F620" />
                    <path d="M155 40 L175 50 L175 125 L155 115 Z" fill="#3B82F640" />
                    <path d="M135 50 L155 40 L175 50 L155 60 Z" fill="#3B82F660" />

                    <path d="M170 140 L170 30 L190 20 L190 130 Z" fill="#00D9FF30" />
                    <path d="M190 20 L210 30 L210 140 L190 130 Z" fill="#00D9FF60" />
                    <path d="M170 30 L190 20 L210 30 L190 40 Z" fill="#00D9FF90" />

                    {/* Flowing Ribbon Sheet Wave */}
                    <path
                      d="M60 80 C 110 50, 150 110, 210 70 S 260 90, 270 100"
                      stroke="#00D9FF"
                      strokeWidth="1.5"
                      fill="none"
                      className="animate-pulse"
                    />
                    <path
                      d="M60 85 C 110 55, 150 115, 210 75 S 260 95, 270 105"
                      stroke="#8B5CF6"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Continuous Delivery
                </span>
                <span className="font-mono text-slate-500">v2.4.0</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* CARD 2: DAILY DRIVERS (The Stack Pill Grid, 7 cols) */}
        <div data-bento className="lg:col-span-7">
          <TiltCard className="h-full">
            <div className="flex h-full flex-col justify-between p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]/90">
                  DAILY DRIVERS
                </p>
                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  The stack behind everything I ship
                </h3>
              </div>

              {/* Skills Interactive Pills Grid */}
              <div className="my-6 flex flex-wrap gap-2.5">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group relative flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d1424]/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D9FF]/60 hover:bg-[#121c33] hover:text-white hover:shadow-[0_0_15px_#00D9FF22]"
                    data-tile
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      width={16}
                      height={16}
                      loading="lazy"
                      className={`h-4 w-4 object-contain transition-transform duration-200 group-hover:scale-110 ${
                        skill.invert ? "invert" : ""
                      }`}
                    />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>

              {/* Category Filter Tabs at bottom (Just like Image 2) */}
              <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-4 text-xs font-mono">
                {(["all", "frontend", "backend", "database", "tools"] as SkillCategory[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer rounded-md px-3 py-1 uppercase tracking-wider transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-[#00D9FF]/15 text-[#00D9FF] font-semibold border border-[#00D9FF]/30 shadow-[0_0_10px_#00D9FF22]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {activeTab === tab && <span className="mr-1.5 text-[#00D9FF]">●</span>}
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* CARD 3: WHAT YOU GET (Conveyor pipeline, 4 cols) */}
        <div data-bento className="lg:col-span-4">
          <TiltCard className="h-full">
            <div className="flex h-full flex-col justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]/90">
                  WHAT YOU GET
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  System design, typed end to end, deployed & scaling
                </h3>
              </div>

              {/* Isometric Conveyor Belt Graphic */}
              <div className="relative my-4 flex h-36 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-[#080d1a]/60">
                <svg viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
                  {/* Conveyor track */}
                  <path d="M20 70 L140 100 L220 50 L100 20 Z" stroke="#ffffff15" strokeWidth="1" fill="#00D9FF05" />
                  <path d="M20 70 L20 80 L140 110 L140 100 Z" fill="#00D9FF10" stroke="#00D9FF30" />
                  <path d="M140 100 L140 110 L220 60 L220 50 Z" fill="#00D9FF15" stroke="#00D9FF40" />

                  {/* Moving Package Boxes with glowing wires */}
                  <g className="animate-pulse">
                    <rect x="50" y="58" width="24" height="20" rx="3" fill="#0f1d38" stroke="#00D9FF" strokeWidth="1" />
                    <text x="62" y="72" fill="#00D9FF" fontSize="9" textAnchor="middle" fontFamily="monospace">API</text>
                  </g>
                  <g>
                    <rect x="105" y="70" width="28" height="22" rx="3" fill="#0f1d38" stroke="#3B82F6" strokeWidth="1" />
                    <text x="119" y="85" fill="#3B82F6" fontSize="9" textAnchor="middle" fontFamily="monospace">UI</text>
                  </g>
                  <g>
                    <rect x="160" y="42" width="26" height="20" rx="3" fill="#0f1d38" stroke="#8B5CF6" strokeWidth="1" />
                    <text x="173" y="56" fill="#8B5CF6" fontSize="9" textAnchor="middle" fontFamily="monospace">SQL</text>
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[#00D9FF]">DEPLOYED & SCALING</span>
                <span>Zero Downtime</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* CARD 4: REMOTE, WORLDWIDE (Bangkok Time, 4 cols) */}
        <div data-bento className="lg:col-span-4">
          <TiltCard className="h-full">
            <div className="flex h-full flex-col justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]/90">
                  REMOTE, WORLDWIDE
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Based in Bangkok, overlapping with your hours
                </h3>
              </div>

              {/* Dotted World Map & Radar Pulse */}
              <div className="relative my-4 flex h-36 flex-col items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-[#080d1a]/60 p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Bangkok Pin with Radar Pulse */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-8 w-8 animate-ping rounded-full bg-[#00D9FF]/30" />
                    <span className="relative h-3 w-3 rounded-full bg-[#00D9FF] shadow-[0_0_12px_#00D9FF]" />
                  </div>
                  <span className="mt-2 font-mono text-xs font-semibold text-white">
                    BANGKOK, TH
                  </span>
                  <span className="mt-0.5 font-mono text-xs text-[#00D9FF]">
                    {bangkokTime || "LIVE TIME"}
                  </span>
                </div>

                <div className="mt-3 flex gap-2 text-[10px] text-slate-400">
                  <span className="text-[#00D9FF]">● LOCAL</span>
                  <span>· US</span>
                  <span>· UK / EU</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Available for contracts
                </span>
                <span className="font-mono text-slate-500">GMT+7</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* CARD 5: WORKSTATION DOCK (Interactive Apps, 4 cols) */}
        <div data-bento className="lg:col-span-4">
          <TiltCard className="h-full">
            <div className="flex h-full flex-col justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]/90">
                  WORKSTATION
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Everything on my desk and dock
                </h3>
              </div>

              {/* Interactive macOS/Linux Style Dock */}
              <div className="relative my-4 flex h-36 flex-col items-center justify-center rounded-lg border border-white/5 bg-[#080d1a]/60 px-2">
                {/* Floating Tooltip (Herdr / App Name style) */}
                <div className="h-6">
                  {hoveredApp ? (
                    <div className="animate-fade-in flex items-center gap-1 rounded-md bg-[#00D9FF] px-2 py-0.5 text-[10px] font-bold text-[#05070D] shadow-[0_0_10px_#00D9FF66]">
                      <span>{hoveredApp}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">HOVER ICONS</span>
                  )}
                </div>

                {/* Dock Shelf */}
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-lg">
                  {workstationApps.slice(0, 6).map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onMouseEnter={() => setHoveredApp(`${app.name} · ${app.role}`)}
                      onMouseLeave={() => setHoveredApp(null)}
                      className="group relative cursor-pointer rounded-xl border border-white/10 bg-[#0f172a] p-2 transition-all duration-200 hover:-translate-y-2 hover:scale-125 hover:border-[#00D9FF] hover:bg-[#1a253d] hover:shadow-[0_0_15px_#00D9FF44]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={app.icon}
                        alt={app.name}
                        width={20}
                        height={20}
                        className={`h-5 w-5 object-contain ${app.invert ? "invert" : ""}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-slate-500">DEV RIG · FAST WORKFLOW</span>
                <span className="text-[#00D9FF]">Windows & Linux</span>
              </div>
            </div>
          </TiltCard>
        </div>
        </div>
      </div>
    </section>
  );
}
