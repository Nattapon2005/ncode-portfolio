"use client";
import { useRef, type ReactNode } from "react";

export default function TiltCard({
  children,
  className = "",
  reveal = true,
}: {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const x = e.clientX;
    const y = e.clientY;
    if (raf.current) return; // coalesce mousemove bursts into one rAF update
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      // Only update subtle holographic light highlight position - NO card movement/shifting
      el.style.setProperty("--mx", `${((x - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((y - r.top) / r.height) * 100}%`);
    });
  };

  return (
    <div data-reveal={reveal ? "" : undefined} className={className}>
      <div
        ref={ref}
        onMouseMove={move}
        className="holo-card h-full transition-colors duration-250"
      >
        {children}
      </div>
    </div>
  );
}
