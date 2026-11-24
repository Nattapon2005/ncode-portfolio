"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Github from "@/components/layout/GithubIcon";
import TiltCard from "@/components/animations/TiltCard";
import { site } from "@/config/site";
import TypeLoop from "@/components/animations/TypeLoop";
import CineHeading from "@/components/animations/CineHeading";
import BuildLog from "@/components/animations/BuildLog";
import { TypewriterCode, TypeOnce } from "@/components/animations/typewriters";
import { profile } from "@/data/projects";
import SkillsBento from "@/components/portfolio/SkillsBento";
import ProjectsShowcase from "@/components/portfolio/ProjectsShowcase";
import ContactSection from "@/components/portfolio/ContactSection";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "const developer = {",
  `  name: "${profile.name}",`,
  `  nickname: "${profile.nickname}",`,
  `  role: "${profile.role}",`,
  `  location: "${profile.location}",`,
  '  stack: ["React", "TypeScript", "Node.js", "Express", "PHP", "SQL"],',
  "};",
];

export function About() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      // quest-log reveal for the goals list
      gsap.fromTo(
        "[data-goal]",
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          duration: 0.5,
          stagger: 0.09,
          scrollTrigger: {
            trigger: "[data-goals]",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, "#about");
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-28 px-6 py-36 md:py-44">
      <CineHeading text="BEHIND THE CODE" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <TiltCard className="md:col-span-2">
          <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt={`${site.name} on GitHub`}
              width={120}
              height={120}
              className="h-28 w-28 shrink-0 rounded-2xl border border-[#00D9FF]/40 shadow-[0_0_20px_#00D9FF22]"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
                <TypeOnce text={`${profile.role} · ${profile.location}`} speed={16} className="shimmer-text" />
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white">
                {profile.name} ({profile.nickname})
              </h3>
              <p className="mt-3 leading-relaxed text-slate-300">{profile.bio}</p>
              <a
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#00D9FF] underline hover:text-white"
                href={site.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={14} /> github.com/{site.github}
              </a>
            </div>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="p-7">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
              Vision &amp; Goals
            </h3>
            <ul data-goals className="space-y-2.5 text-xs text-slate-300">
              {profile.goals.map((g) => (
                <li
                  key={g}
                  data-goal
                  className="goal-item group flex items-start gap-2 rounded-md px-1.5 py-1 transition-colors duration-200 hover:bg-[#00D9FF]/5"
                >
                  <span className="text-[#00D9FF] transition-transform duration-200 group-hover:translate-x-1">
                    ▸
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-white">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>

        <TiltCard className="md:col-span-3">
          <div data-codeshell className="crt-shell flex h-full flex-col p-7 font-mono text-sm">
            {/* CRT dressing: sweeping light band + scanline + flicker overlay */}
            <span className="crt-scan" aria-hidden />
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-4 flex gap-2" aria-hidden>
                <i className="h-3 w-3 rounded-full bg-[#00D9FF]/70" />
                <i className="h-3 w-3 rounded-full bg-[#3B82F6]/70" />
                <i className="h-3 w-3 rounded-full bg-[#8B5CF6]/70" />
              </div>
              <TypewriterCode lines={LINES} />
              <p className="mt-3 text-[#00D9FF]">
                &gt;{" "}
                <TypeLoop
                  phrases={[
                    "CODE. CREATE. IMPROVE. REPEAT.",
                    "BUILDING MODERN WEB EXPERIENCES.",
                    "DESIGNING WHAT’S NEXT.",
                  ]}
                />
              </p>

              {/* deploy pipeline — streams after the code finishes typing, then loops */}
              <div className="mt-auto pt-4">
                <div
                  aria-hidden
                  className="mb-3 h-px w-full bg-gradient-to-r from-[#00D9FF]/40 via-white/10 to-transparent"
                />
                <BuildLog className="min-h-[11rem]" />
              </div>
            </div>
            <span className="crt-lines" aria-hidden />
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

// Re-export Bento Grid as the Skills Section
export { SkillsBento as Skills };

// Re-export Futuristic Dual-Mode Projects Showcase
export { ProjectsShowcase as Projects };

// Re-export ContactSection as Contact
export { ContactSection as Contact };

export const Footer = () => (
  <footer className="border-t border-white/5 bg-[#04060a] py-12 text-center text-sm text-slate-500">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="font-mono text-base font-bold text-white">{site.brand}</span>
        <span className="text-slate-600">/</span>
        <span className="text-xs text-slate-400">{site.name}</span>
      </div>
      <p className="text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name} · Designed &amp; Built with Next.js, React &amp; Canvas
      </p>
      <div className="flex items-center gap-4 text-xs">
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-[#00D9FF]"
        >
          GitHub
        </a>
        <a
          href="https://www.instagram.com/nattapon_phliwan/"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-[#00D9FF]"
        >
          Instagram
        </a>
      </div>
    </div>
  </footer>
);
