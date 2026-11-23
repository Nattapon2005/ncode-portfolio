"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Light-touch reveal: letters fade-up once on scroll, a thin cyan
 * terminal line draws itself underneath. Cheap (transform/opacity only).
 * Hovering the heading flicks a quick rgb-split shadow.
 */
export default function RevealHeading({
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
      const letters = gsap.utils.toArray<HTMLElement>("[data-ch]", host);
      gsap.fromTo(
        letters,
        { opacity: 0, y: "0.35em" },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.5,
          stagger: 0.026,
          scrollTrigger: { trigger: host, start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        "[data-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "power3.out",
          duration: 0.9,
          delay: 0.9,
          scrollTrigger: { trigger: host, start: "top 85%", once: true },
        }
      );
    }, host);
    return () => ctx.revert();
  }, [text]);

  return (
    <div ref={hostRef} className={className}>
      <h2 aria-label={text} className="reveal-heading text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        <span aria-hidden>
          {text.split("").map((c, i) => (
            <span key={i} data-ch className="reveal-ch">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </span>
      </h2>
      <span aria-hidden data-line className="rgb-line" />
    </div>
  );
}
