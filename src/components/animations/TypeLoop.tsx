"use client";
import { useEffect, useState } from "react";
export default function TypeLoop({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const [t, setT] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = setTimeout(() => setT(phrases[0]), 0);
      return () => clearTimeout(timeout);
    }
    let i = 0, j = 0, del = false, id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const p = phrases[i]; j += del ? -1 : 1; setT(p.slice(0, j)); let d = del ? 35 : 70;
      if (!del && j === p.length) { del = true; d = 1400; } else if (del && j === 0) { del = false; i = (i + 1) % phrases.length; d = 350; }
      id = setTimeout(tick, d);
    };
    id = setTimeout(tick, 1600);
    return () => clearTimeout(id);
  }, [phrases]);
  return (<span className={className} aria-label={phrases[0]}>{t}<span aria-hidden className="animate-pulse text-[#00D9FF]">|</span></span>);
}
