"use client";
import { useState } from "react";
import CyberAquaticCreature, { CreatureKind } from "@/components/animations/CyberAquaticCreature";
import { site } from "@/config/site";
import { ArrowUpRight, Check, Mail, ExternalLink } from "lucide-react";
import Github from "@/components/layout/GithubIcon";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [creature, setCreature] = useState<CreatureKind>("white_shark");
  const email = site.email;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden scroll-mt-28 px-6 py-36 md:py-48 text-center"
    >
      {/* Procedural Cyber Aquatic Creature from animation.md */}
      <CyberAquaticCreature
        creature={creature}
        pixelSize={4}
        scale={1.05}
        showGrid={true}
        showBubbles={true}
        glow={true}
        background="transparent"
      />

      {/* Subtle Atmospheric Gradient Vignettes (Top & Bottom seamless blending) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#05070D] via-transparent to-[#05070D] opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_30%,#05070D_95%)]" />

      {/* Foreground Contact Card (Image 1 Style) */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        {/* Wings & Brand Emblem (as seen in Image 1 top) */}
        <div className="group relative mb-8 flex items-center justify-center">
          <div className="relative flex items-center gap-4">
            {/* Left Wing SVG */}
            <svg
              className="h-10 w-24 text-[#00D9FF]/40 transition-transform duration-500 group-hover:-translate-x-1"
              viewBox="0 0 100 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M95 20 C70 18, 45 10, 5 35 C35 15, 65 10, 95 20 Z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M90 24 C65 24, 40 18, 15 38 C40 22, 70 18, 90 24 Z"
                fill="currentColor"
                opacity="0.4"
              />
              <path
                d="M85 28 C60 28, 40 25, 25 40 C45 28, 70 25, 85 28 Z"
                fill="currentColor"
                opacity="0.25"
              />
            </svg>

            {/* Center Monogram Shield */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#00D9FF]/50 bg-[#0B132B] shadow-[0_0_25px_#00D9FF55] transition-transform duration-300 group-hover:scale-105">
              <span className="font-mono text-xl font-black tracking-widest text-[#00D9FF]">
                NC
              </span>
              <span className="absolute inset-0 animate-ping rounded-full bg-[#00D9FF]/20" />
            </div>

            {/* Right Wing SVG */}
            <svg
              className="h-10 w-24 -scale-x-100 text-[#00D9FF]/40 transition-transform duration-500 group-hover:translate-x-1"
              viewBox="0 0 100 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M95 20 C70 18, 45 10, 5 35 C35 15, 65 10, 95 20 Z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M90 24 C65 24, 40 18, 15 38 C40 22, 70 18, 90 24 Z"
                fill="currentColor"
                opacity="0.4"
              />
              <path
                d="M85 28 C60 28, 40 25, 25 40 C45 28, 70 25, 85 28 Z"
                fill="currentColor"
                opacity="0.25"
              />
            </svg>
          </div>
        </div>

        {/* Relative Container for Headline + Rotating "OPEN TO WORK" Badge */}
        <div className="relative w-full">
          {/* Main Headline (Image 1 Style) */}
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-200 sm:text-5xl md:text-6xl lg:text-7xl">
            GOT AN IDEA WORTH{" "}
            <span className="text-white drop-shadow-[0_0_25px_#ffffff66]">
              BUILDING?
            </span>
            <br />
            LET’S TALK IT{" "}
            <span className="text-white drop-shadow-[0_0_25px_#00D9FF88]">
              THROUGH
            </span>
          </h2>

          {/* Rotating "OPEN TO WORK" Badge (Visible on medium+ screens, as in Image 1) */}
          <div className="absolute -top-6 -right-6 hidden sm:block lg:-right-10">
            <div className="relative flex h-28 w-28 items-center justify-center">
              {/* Rotating SVG Circular Text */}
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full animate-[spin_16s_linear_infinite]"
              >
                <path
                  id="textCircle"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  fill="none"
                />
                <text className="text-[9.5px] font-mono uppercase tracking-[2.8px] fill-slate-300">
                  <textPath href="#textCircle" startOffset="0%">
                    • OPEN TO WORK • AVAILABLE FOR HIRE •
                  </textPath>
                </text>
              </svg>

              {/* Center status sphere */}
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0d1627]/90 backdrop-blur-md">
                <span className="h-3 w-3 rounded-full bg-[#00D9FF] shadow-[0_0_12px_#00D9FF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA Button (Image 1 Style: "Start a conversation ->") */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-[#05070D] shadow-[0_0_30px_#ffffff44] transition-all duration-300 hover:scale-105 hover:bg-[#00D9FF] hover:shadow-[0_0_40px_#00D9FF88]"
          >
            <span className="text-sm font-bold tracking-wide uppercase sm:text-base">
              Start a conversation
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-black/20">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>

          {/* Quick Copy Email Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-slate-300 backdrop-blur-md transition-all duration-200 hover:border-[#00D9FF] hover:text-white hover:bg-[#00D9FF15]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Email Copied!</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 text-[#00D9FF]" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* Subtitle (Image 1 Style) */}
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          I’m taking on freelance projects and open to full-time roles.
          <br className="hidden sm:inline" /> Tell me what you’re working on.
        </p>

        {/* Social Direct Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0d1627]/60 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-all duration-200 hover:border-[#00D9FF]/60 hover:text-[#00D9FF] hover:bg-[#00D9FF10]"
            >
              {s.label === "GitHub" ? <Github size={14} /> : <ExternalLink size={14} />}
              <span>{s.label}</span>
            </a>
          ))}
        </div>

        {/* Creature Selector Switcher Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-[#060c18]/80 px-3 py-1.5 backdrop-blur-md">
          <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            AQUATIC CREATURE:
          </span>
          {(
            [
              { id: "white_shark", label: "🦈 ฉลามขาว (White Shark)" },
              { id: "black_shark", label: "🌑 ฉลามกาฬ (Black Shark)" },
              { id: "orca", label: "🐬 วาฬเพชฌฆาต (Orca)" },
              { id: "whale", label: "🐋 วาฬ (Whale)" },
              { id: "shark", label: "⚡ Apex Shark" },
              { id: "koi", label: "🎏 Koi" },
              { id: "manta", label: "🌊 Manta" },
              { id: "jellyfish", label: "🪼 Jellyfish" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCreature(item.id)}
              className={`cursor-pointer rounded-full px-3 py-1 font-mono text-xs font-medium transition-all ${
                creature === item.id
                  ? item.id === "black_shark"
                    ? "bg-[#ff0055] text-white font-semibold shadow-[0_0_15px_#ff0055aa]"
                    : "bg-[#00F0FF] text-black font-semibold shadow-[0_0_15px_#00F0FF88]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
