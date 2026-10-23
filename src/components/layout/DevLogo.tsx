"use client";

export default function DevLogo() {
  return (
    <a
      href="#home"
      className="group flex items-center gap-2.5 rounded-full px-2 py-1 transition-all duration-300 hover:scale-105"
    >
      {/* High-Tech Dev Shield Icon */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-[#00D9FF]/40 bg-[#091322] shadow-[0_0_12px_#00D9FF33] transition-all duration-300 group-hover:border-[#00D9FF] group-hover:shadow-[0_0_18px_#00D9FF66]">
        <span className="font-mono text-xs font-black tracking-tighter text-[#00D9FF]">
          &lt;/&gt;
        </span>
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <span className="font-mono text-sm font-bold tracking-wider text-white group-hover:text-[#00D9FF] transition-colors">
          Nut<span className="text-[#00D9FF]">.dev</span>
        </span>
        <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
          Full-Stack
        </span>
      </div>
    </a>
  );
}
