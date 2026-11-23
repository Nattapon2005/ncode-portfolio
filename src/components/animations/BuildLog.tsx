"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS: { icon: string; text: string; cls: string }[] = [
  { icon: "▸", text: "npm run deploy --profile=nut.dev", cls: "text-sky-300" },
  { icon: "✓", text: "types — checked · 0 errors", cls: "text-emerald-400" },
  { icon: "✓", text: "bundle — client 118kb · edge 212kb", cls: "text-emerald-400" },
  { icon: "▲", text: "uploading to global edge… 100%", cls: "text-amber-300" },
  { icon: "✓", text: "deployed in 3.2s — worldwide", cls: "text-emerald-400" },
  { icon: "★", text: "lighthouse — perf 100 · a11y 100 · seo 100", cls: "text-[#00D9FF]" },
];

/**
 * Streaming build log for the CRT terminal card.
 * Streams one line at a time, holds, wipes, and re-runs forever.
 * Pauses off-screen; reduced motion renders the finished log statically.
 */
export default function BuildLog({
  className = "",
  stepMs = 620,
  holdMs = 3600,
  startDelayMs = 3900, // let the typewriter finish first
}: {
  className?: string;
  stepMs?: number;
  holdMs?: number;
  startDelayMs?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const countRef = useRef(0);
  const [cycle, setCycle] = useState(0); // bumps each re-run so line animations replay
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      countRef.current = STEPS.length;
      setCount(STEPS.length);
      setCycle(1);
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    let active = true; // paused when scrolled away
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; });
    io.observe(host);

    let phase: "stream" | "hold" = "stream";
    const tick = () => {
      if (!active) {
        timer = setTimeout(tick, stepMs);
        return;
      }
      if (phase === "stream") {
        if (countRef.current < STEPS.length) {
          countRef.current += 1;
          setCount(countRef.current);
          timer = setTimeout(tick, stepMs);
        } else {
          phase = "hold";
          timer = setTimeout(tick, holdMs);
        }
      } else {
        // wipe and run the pipeline again
        phase = "stream";
        countRef.current = 0;
        setCount(0);
        setCycle((c) => c + 1);
        timer = setTimeout(tick, stepMs * 2);
      }
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: host,
        start: "top 88%",
        once: true,
        onEnter: () => {
          timer = setTimeout(tick, startDelayMs);
        },
      });
    }, host);

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      io.disconnect();
      ctx.revert();
    };
  }, [stepMs, holdMs, startDelayMs]);

  return (
    <div ref={hostRef} aria-hidden="true" className={className}>
      {STEPS.slice(0, count).map((s, i) => (
        <p key={`${cycle}-${i}`} className="log-line flex items-center gap-2.5 font-mono text-[11px] leading-relaxed">
          <span className={`${s.cls} inline-block w-4 shrink-0 text-center`}>{s.icon}</span>
          <span className="text-slate-300">{s.text}</span>
        </p>
      ))}
      {count === STEPS.length && (
        <p className="log-line mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span>stream live · 0 err · 0 warn</span>
        </p>
      )}
    </div>
  );
}
