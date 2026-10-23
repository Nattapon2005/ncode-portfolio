"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "@/config/site";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;

    if (config.enableLenis && !reduce) {
      lenis = new Lenis({
        lerp: 0.08, // Smooth and ultra-responsive without feeling sluggish
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(500, 33); // Normal lag smoothing prevents violent frame catch-up stutter

      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          const target = a.getAttribute("href");
          if (target && target !== "#") {
            e.preventDefault();
            lenis?.scrollTo(target, { offset: -80 });
          }
        });
      });
    }

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Hardware-accelerated entrance reveal without heavy blur rasterization
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.9,
            delay: (i % 3) * 0.06,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
