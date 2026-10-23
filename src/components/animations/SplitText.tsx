"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function SplitText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => gsap.from("[data-c]", { opacity: 0, y: 40, filter: "blur(14px)", stagger: 0.03, duration: 1, ease: "power3.out", delay }), ref);
    return () => ctx.revert();
  }, [delay]);
  return (<span ref={ref} className={className} aria-label={text}>{text.split("").map((c, i) => (
    <span key={i} data-c aria-hidden className="inline-block whitespace-pre">{c}</span>))}</span>);
}
