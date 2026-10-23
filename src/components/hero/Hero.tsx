"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import Github from "@/components/layout/GithubIcon";
import TypeLoop from "@/components/animations/TypeLoop";
import SplitText from "@/components/animations/SplitText";
import { site } from "@/config/site";
import { profile } from "@/data/projects";
const Shapes = dynamic(() => import("@/components/three/Shapes"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);
const CODE = [
  `import { getProjects } from "@/lib/github";`, `export default async function Page() {`, `  const projects = await getProjects();`,
  `  return <Universe intensity={1} projects={projects} />;`, `}`, ``, `type Card = { title: string; depth: number };`,
  `const reveal = (el: HTMLElement) =>`, `  gsap.fromTo(el, { z: -400, opacity: 0 }, { z: 0, opacity: 1 });`, ``,
  `useEffect(() => {`, `  const lenis = new Lenis({ lerp: 0.1 });`, `  return () => lenis.destroy();`, `}, []);`,
];
const PHRASES = ["BUILDING DIGITAL EXPERIENCES", "CODE IS MY CANVAS.", "DESIGNING WHAT’S NEXT."];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const paint = (l: string) => esc(l).replace(/(&quot;|")([^"]*)"/g, '<span class="text-[#00D9FF]">"$2"</span>')
  .replace(/\b(import|export|default|async|function|const|return|await|type|from)\b/g, '<span class="text-[#8B5CF6]">$1</span>');
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-pop]", { opacity: 0, scale: 0.5, y: 90, rotateX: 25, rotateY: -15, filter: "blur(12px)", transformPerspective: 800,
        stagger: 0.18, duration: 1.4, delay: 1.3, ease: "back.out(1.5)" });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", scrub: 1, pin: true } })
        .to("[data-code]", { scale: 0.6, opacity: 0.25, ease: "none" }, 0)
        .to("[data-l]", { x: "-35vw", ease: "none" }, 0).to("[data-r]", { x: "35vw", ease: "none" }, 0)
        .to("[data-headline]", { opacity: 0, filter: "blur(20px)", y: -60, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);
  return (<section id="home" ref={root} className="relative h-screen overflow-hidden">
    <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 20% 20%, #3B82F633, transparent), radial-gradient(50% 50% at 80% 70%, #8B5CF633, transparent)" }} />
    <div data-code aria-hidden className="absolute inset-0 flex select-none items-center justify-center font-mono text-sm text-slate-500/60 md:text-base">
      <pre className="code-drift leading-7">{CODE.map((l, i) => (<div key={i} dangerouslySetInnerHTML={{ __html: paint(l) || "&nbsp;" }} />))}</pre>
    </div>
    <Shapes />
    <div data-headline className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
      <h1 className="flex flex-wrap justify-center gap-x-4 text-5xl font-extrabold tracking-tight md:gap-x-8 md:text-8xl"><span data-l><SplitText text="NATTAPON" /></span><span data-r><SplitText text="PHLIWAN" /></span></h1>
      <p className="mt-6 text-lg tracking-[0.4em] text-[#00D9FF] md:text-2xl"><SplitText text="CREATIVE DEVELOPER" delay={0.6} /></p>
      <p className="mt-3 text-sm tracking-[0.3em] text-slate-400"><TypeLoop phrases={PHRASES} /></p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a href="#projects" className="btn-primary">Explore My Work</a>
        <a href={site.githubUrl} target="_blank" rel="noreferrer" className="btn-ghost"><Github size={16} /> View GitHub</a></div>
      <div className="pointer-events-none absolute inset-x-6 bottom-10 hidden justify-between lg:flex">
        <div className="flex flex-col gap-3 self-end">
          {["React · SCSS · JavaScript", "Learning Node.js"].map((t) => (<div key={t} data-pop><div className="float-soft holo-card px-4 py-2 text-xs tracking-widest text-slate-300">{t}</div></div>))}</div>
        <div data-pop><div className="float-soft holo-card flex w-64 items-center gap-4 p-4 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar} alt="" width={56} height={56} className="h-14 w-14 rounded-xl border border-[#00D9FF]/40" />
          <div><p className="font-semibold">{site.name}</p><p className="text-xs text-[#00D9FF]">{profile.role}</p><p className="text-xs text-slate-400">{profile.location}</p></div></div></div>
      </div>
      <ArrowDown className="absolute bottom-8 animate-bounce text-slate-400" aria-hidden />
    </div></section>);
}
