"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import TiltCard from "@/components/animations/TiltCard";
import { site } from "@/config/site";
import TypeLoop from "@/components/animations/TypeLoop";
import CineHeading from "@/components/animations/CineHeading";
import BuildLog from "@/components/animations/BuildLog";
import { TypewriterCode, TypeOnce } from "@/components/animations/typewriters";
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
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      // quest-log reveal for the goals list
      gsap.fromTo(
        "[data-goal]",
        { opacity: 0, x: -18 },
        {
          opacity: 1, x: 0,
          ease: "power2.out",
          duration: 0.5,
          stagger: 0.09,
          scrollTrigger: { trigger: "[data-goals]", start: "top 82%", toggleActions: "play none none reverse" },
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
              Vision &amp; Goals
            </h3>
            <ul data-goals className="space-y-2.5 text-xs text-slate-300">
              {profile.goals.map((g) => (
                <li
                  key={g}
                  data-goal
                  className="goal-item group flex items-start gap-2 rounded-md px-1.5 py-1 transition-colors duration-200 hover:bg-[#00D9FF]/5"
                >
                  <span className="text-[#00D9FF] transition-transform duration-200 group-hover:translate-x-1">▸</span>
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

/* reusable glass repo card shell */
const RepoGlass = ({ p, i, live }: { p: Project; i: number; live: boolean }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-7 shadow-[0_30px_80px_#0009,inset_0_1px_0_#ffffff2b] backdrop-blur-2xl md:min-h-[21rem]">
    {/* glass sheen */}
    <span className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] rotate-12 bg-[linear-gradient(100deg,transparent_40%,#ffffff14_50%,transparent_60%)]" />
    <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/60 to-transparent" />

    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#00D9FF]">
        <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" />
        REPO_{String(i + 1).padStart(2, "0")}
      </span>
      <span className="font-mono text-5xl font-black text-white/[0.08]">
        {String(i + 1).padStart(2, "0")}
      </span>
    </div>

    <h3 className="mt-3 font-mono text-2xl font-bold text-white md:text-[1.7rem]">
      {p.name}
    </h3>
    <span className="mt-2 block h-px w-20 bg-gradient-to-r from-[#00D9FF] to-transparent" />
    <p className="mt-3 text-sm leading-relaxed text-slate-300 line-clamp-3">
      {p.description}
    </p>

    <div className="mb-5 mt-5 flex flex-wrap gap-2">
      {p.tech.map((t) => (
        <span
          key={t}
          className="rounded border border-[#00D9FF]/25 bg-[#00D9FF]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#00D9FF]/90"
        >
          {t}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between border-t border-white/10 pt-4">
      <div className="flex items-center gap-4">
        <a
          href={p.github}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 font-mono text-xs text-slate-200 transition-colors hover:text-[#00D9FF]"
        >
          <Github size={14} /> SOURCE
          <span className="h-1 w-8 bg-[#00D9FF]/40 transition-all group-hover:w-14 group-hover:bg-[#00D9FF]" />
        </a>
        {p.demo && (
          <a
            href={p.demo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-[#00D9FF] transition-colors hover:text-white"
          >
            <ExternalLink size={14} /> DEMO
          </a>
        )}
      </div>
      <span className="font-mono text-[10px] text-slate-500">
        {live ? "SYNCED" : "ARCHIVED"}
      </span>
    </div>
  </div>
);

export function Projects({ projects, live }: { projects: Project[]; live: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);
  const ringCards = useRef<HTMLDivElement[]>([]);
  const caption = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const items = projects.length ? projects : null;
  const total = items?.length ?? 0;

  /* ---------- cinematic backdrop (clip-1 vibe) ---------- */
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
    };
    resize();
    addEventListener("resize", resize);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const P = 90;
    const parts = Array.from({ length: P }, () => ({
      x: Math.random(), y: Math.random(), s: Math.random() * 1.8 + 0.4,
      v: Math.random() * 0.06 + 0.015, a: Math.random(),
    }));
    let t = 0;
    let raf = 0;
    const draw = () => {
      t += reduce ? 0 : 0.016;
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);

      // deep space base
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#02040a");
      bg.addColorStop(0.5, "#070d1d");
      bg.addColorStop(1, "#02040a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // nebula blobs
      const blob = (cx: number, cy: number, r: number, c: string) => {
        const g = ctx.createRadialGradient(cx + w * Math.sin(t * 0.2) * 0.02, cy, 0, cx, cy, r);
        g.addColorStop(0, c);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      blob(w * 0.28, h * 0.45, w * 0.45, "rgba(76,29,149,0.16)");
      blob(w * 0.75, h * 0.6, w * 0.4, "rgba(0,217,255,0.10)");
      blob(w * 0.5, h * 0.2, w * 0.3, "rgba(59,130,246,0.08)");

      // glowing monolith core + pillar of light (clip-1 signature)
      const cx = w * (0.5 + Math.sin(t * 0.3) * 0.03);
      const cy = h * 0.52;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.3);
      core.addColorStop(0, "rgba(0,217,255,0.35)");
      core.addColorStop(0.25, "rgba(139,92,246,0.15)");
      core.addColorStop(1, "transparent");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);
      // vertical light pillar
      ctx.save();
      ctx.translate(cx, h);
      ctx.rotate(Math.sin(t * 0.25) * 0.06);
      const beam = ctx.createLinearGradient(0, 0, 0, -h);
      beam.addColorStop(0, "rgba(0,217,255,0.14)");
      beam.addColorStop(1, "transparent");
      ctx.fillStyle = beam;
      ctx.fillRect(-h * 0.06, -h, h * 0.12, h);
      ctx.restore();

      // orbiting monolith ring
      ctx.strokeStyle = "rgba(0,217,255,0.25)";
      ctx.lineWidth = dpr * 1.2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, h * (0.2 + i * 0.06) * (1 + Math.sin(t + i) * 0.02), h * (0.05 + i * 0.015), t * (i % 2 ? -0.25 : 0.35) + i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // drifting particles (embers)
      for (const p of parts) {
        p.y -= p.v / 40;
        p.a = 0.25 + Math.abs(Math.sin(t * 2 + p.x * 40)) * 0.6;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        ctx.fillStyle = `rgba(0,217,255,${p.a * 0.5})`;
        ctx.fillRect(p.x * w, p.y * h, p.s * dpr, p.s * dpr);
      }

      // vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);

  /* ---------- orbital ring (cards orbit the monolith on scroll) ---------- */
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !items || total < 2) return;
    const mm = gsap.matchMedia();
    let tick: ((time: number) => void) | undefined;
    mm.add("(min-width: 768px)", () => {
      const stageEl = stage.current;
      const ring = ringEl.current;
      if (!stageEl || !ring) return;
      gsap.set(stageEl, { perspective: "1400px", transformStyle: "preserve-3d" });
      gsap.set(ring, { rotateX: -6, transformStyle: "preserve-3d" });

      const STEP = 360 / total;
      let rot = 0;
      let target = 0;
      let lastIdx = -1;

      const apply = (r: number) => {
        const R = Math.min(innerWidth * 0.38, 560);
        ring.style.transform = `rotateY(${-r}deg)`;
        ringCards.current.forEach((card, i) => {
          if (!card) return;
          let a = i * STEP - r;
          a = ((a + 540) % 360) - 180; // -180..180
          const facing = Math.max(-1, Math.min(1, a / 180));
          const front = Math.cos((a * Math.PI) / 180);
          card.style.transform = `translate(-50%,-50%) rotateY(${i * STEP}deg) translateZ(${R}px)`;
          card.style.opacity = String(front > 0 ? 0.22 + front * 0.78 : 0);
          card.style.filter = `brightness(${0.5 + Math.max(front, 0) * 0.6}) blur(${Math.min((front < 0.55 ? (0.55 - front) * 4 : 0), 3)}px)`;
          card.style.zIndex = String(100 + Math.round(front * 100));
        });
        const idx = Math.max(0, Math.min(total - 1, Math.round(r / STEP)));
        if (idx !== lastIdx && caption.current && items) {
          lastIdx = idx;
          caption.current.style.opacity = "0";
          setTimeout(() => {
            if (caption.current) {
              caption.current.textContent = items[idx].name.toUpperCase();
              caption.current.style.opacity = "1";
            }
          }, 160);
        }
      };
      apply(0);

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => "+=" + (total * 90) + "%",
        pin: true,
        onRefresh: (self) => apply((target = self.progress * (total - 1) * STEP)),
        onUpdate: (self) => {
          target = self.progress * (total - 1) * STEP;
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        },
      });

      // smooth ring inertia (lerp toward scroll target)
      tick = () => {
        rot += (target - rot) * 0.085;
        apply(rot);
      };
      gsap.ticker.add(tick);

      // idle float on each card's inner shell
      ringCards.current.forEach((c, i) => {
        c?.firstElementChild &&
          gsap.to(c.firstElementChild, { y: "+=10", duration: 3 + (i % 3), yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      return () => {
        gsap.ticker.remove(tick!);
        st.kill();
      };
    });
    return () => mm.revert();
  }, [items, total]);

  return (
    <section
      id="projects"
      ref={root}
      className="relative flex h-screen flex-col overflow-hidden bg-[#04060a]"
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />

      {/* header + HUD counter */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00D9FF]">
              ▸ SYSTEM://REPO.EXPLORER
            </p>
            <H>FEATURED REPOSITORIES</H>
          </div>
          <div className="hidden items-end gap-4 font-mono md:flex">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                {live ? "LIVE SYNC · GITHUB API" : "VERIFIED SHOWCASE"}
              </p>
              <p className="text-xs text-[#00D9FF]">
                <a href={site.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  @{site.github}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* card stage */}
      <div ref={stage} className="relative z-10 flex-1">
        {/* mobile: simple vertical stack */}
        <div className="flex h-full flex-col items-center gap-10 overflow-y-auto py-10 md:hidden">
          {items?.map((p, i) => (
            <div key={p.name} className="w-[88vw] max-w-md sm:max-w-lg">
              <RepoGlass p={p} i={i} live={live} />
            </div>
          ))}
        </div>

        {/* desktop: orbital glass ring around the monolith core */}
        <div className="hidden select-none md:absolute md:inset-0 md:block" aria-hidden>
          <div ref={ringEl} className="relative h-full w-full [transform-style:preserve-3d]">
            {items?.map((p, i) => (
              <div
                key={p.name}
                ref={(el) => { if (el) ringCards.current[i] = el; }}
                className="absolute left-1/2 top-1/2 w-[24rem] will-change-transform lg:w-[26rem]"
              >
                <RepoGlass p={p} i={i} live={live} />
              </div>
            ))}
          </div>
        </div>

        {/* bottom caption */}
        <p
          ref={caption}
          data-vs-caption
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 font-mono text-sm tracking-[0.35em] text-slate-400 opacity-100 transition-opacity duration-200 md:block"
        >
          {items?.[0]?.name?.toUpperCase() ?? ""}
        </p>
      </div>

      {/* progress */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-8">
        <div className="hidden items-center gap-4 md:flex">
          <div className="h-px flex-1 bg-white/10">
            <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] shadow-[0_0_12px_#00D9FF88]" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            SCROLL ▸ ROTATE THE RING
          </span>
        </div>
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
