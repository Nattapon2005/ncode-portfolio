"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic scrub heading: while pinned, scrolling drives
 *   slide in → hold → dissolve away → slide back in.
 * Scrub = reversible: scroll down plays the film, scroll up rewinds it.
 * transform/opacity only. Reduced motion → static final text.
 */
export default function CineHeading({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = hostRef.current;
    if (!host || reduce) return;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-ch]", host);
      const h2 = host.querySelector("h2");
      if (h2) gsap.set(h2, { perspective: "700px" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: host,
          start: "top top+=150",
          end: "+=170%",
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1 — slide in from alternating sides, chaotic converging assemble
      tl.fromTo(
        els,
        {
          opacity: 0,
          x: (i) => (i % 2 ? "1.3em" : "-1.3em"),
          rotationX: (i) => (i % 2 ? 45 : -45),
          scale: 1.06,
        },
        {
          opacity: 1,
          x: "0em",
          rotationX: 0,
          scale: 1,
          ease: "power2.out",
          duration: 0.55,
          stagger: { each: 0.045, from: "random" },
        },
        0
      );

      // 2 — hold the assembled line
      tl.to({}, { duration: 0.55 });

      // 3 — dissolve: every letter evaporates to its own drifting direction
      tl.to(
        els,
        {
          opacity: 0,
          x: () => `${gsap.utils.random(-1.7, 1.7)}em`,
          y: () => `${gsap.utils.random(-0.95, 0.45)}em`,
          rotationX: () => gsap.utils.random(-70, 70),
          rotation: () => gsap.utils.random(-28, 28),
          scale: () => gsap.utils.random(0.5, 0.95),
          ease: "power2.in",
          duration: 0.95,
          stagger: { each: 0.05, from: "random" },
        },
        ">"
      );

      // 4 — slide back in from the opposite wings, center-out zip
      tl.set(
        els,
        {
          opacity: 0,
          x: (i) => (i % 2 ? "-1.4em" : "1.4em"),
          y: 0,
          rotationX: (i) => (i % 2 ? -40 : 40),
          rotation: (i) => (i % 2 ? 5 : -5),
          scale: 1.05,
        },
        ">"
      );
      tl.to(
        els,
        {
          opacity: 1,
          x: "0em",
          y: "0em",
          rotationX: 0,
          rotation: 0,
          scale: 1,
          ease: "back.out(1.35)",
          duration: 0.65,
          stagger: { each: 0.05, from: "edges" },
        },
        ">"
      );
    }, host);
    return () => ctx.revert();
  }, [text]);

  return (
    <div ref={hostRef} className={className}>
      <h2 aria-label={text} className="text-4xl font-extrabold tracking-tight md:text-7xl">
        <span aria-hidden>
          {text.split("").map((c, i) => (
            <span key={i} data-ch className="cine-ch">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </span>
      </h2>
    </div>
  );
}
