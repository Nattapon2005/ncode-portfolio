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

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    // Only update subtle holographic light highlight position - NO card movement/shifting
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
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
