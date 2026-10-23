"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import TiltCard from "@/components/animations/TiltCard";
import { site } from "@/config/site";
import TypeLoop from "@/components/animations/TypeLoop";
import { profile, type Project } from "@/data/projects";
import SkillsBento from "@/components/portfolio/SkillsBento";
import ContactSection from "@/components/portfolio/ContactSection";

gsap.registerPlugin(ScrollTrigger);

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 data-reveal className="text-4xl font-extrabold tracking-tight md:text-7xl">
    {children}
  </h2>
);

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
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-28 px-6 py-36 md:py-44">
      <H>BEHIND THE CODE</H>
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
                {profile.role} · {profile.location}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white">{profile.name} ({profile.nickname})</h3>
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
              Vision & Goals
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {profile.goals.map((g) => (
                <li key={g} className="flex items-start gap-2">
                  <span className="text-[#00D9FF]">▸</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>

        <TiltCard className="md:col-span-3">
          <div className="p-7 font-mono text-sm">
            <div className="mb-4 flex gap-2" aria-hidden>
              <i className="h-3 w-3 rounded-full bg-[#00D9FF]/70" />
              <i className="h-3 w-3 rounded-full bg-[#3B82F6]/70" />
              <i className="h-3 w-3 rounded-full bg-[#8B5CF6]/70" />
            </div>
            {LINES.map((l, i) => (
              <p key={i} className="whitespace-pre text-slate-300">
                {l}
              </p>
            ))}
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
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

// Re-export Bento Grid as the Skills Section
export { SkillsBento as Skills };

export function Projects({ projects, live }: { projects: Project[]; live: boolean }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const items = projects.length ? projects : null;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !items) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const dist = () => track.current!.scrollWidth - innerWidth + 96;
      gsap.to(track.current, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
          },
        },
      });
    });
    return () => mm.revert();
  }, [items]);

  return (
    <section
      id="projects"
      ref={root}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden scroll-mt-28 py-36 md:py-44"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <H>FEATURED REPOSITORIES</H>
        <p className="mt-3 text-sm text-slate-400">
          {live ? "Live sync from GitHub API" : "Verified repository showcase"} ·{" "}
          <a
            className="text-[#00D9FF] hover:underline"
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            @{site.github}
          </a>
        </p>
      </div>

      <div
        ref={track}
        className="mt-12 flex gap-6 overflow-x-auto px-6 pb-6 snap-x md:overflow-visible md:px-12"
      >
        {(items ?? []).map((p) => (
          <article key={p.name} className="w-[88vw] shrink-0 snap-center sm:w-[480px]">
            <TiltCard reveal={false}>
              <div className="flex h-72 flex-col justify-between p-7">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#00D9FF]">
                      Repository
                    </span>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 transition-colors hover:text-[#00D9FF]"
                    >
                      <Github size={16} />
                    </a>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-white">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300 line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-[#00D9FF]/25 bg-[#00D9FF]/10 px-2.5 py-1 text-xs font-mono text-[#00D9FF]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-[#00D9FF]"
                    >
                      <Github size={14} /> Source Code
                    </a>
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#00D9FF] transition-colors hover:text-white"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </TiltCard>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-8 hidden h-px w-full max-w-7xl bg-white/10 md:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-[#00D9FF]" />
      </div>
    </section>
  );
}

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
        © {new Date().getFullYear()} {site.name} · Designed & Built with Next.js, React & Canvas
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
