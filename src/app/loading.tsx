export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070D] text-[#F5F9FF]">
      {/* Background cyber grid & glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#00D9FF]/10 blur-[140px]"
        aria-hidden
      />

      {/* Top HUD Skeleton Header */}
      <header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/5 bg-[#05070D]/80 px-6 backdrop-blur-xl">
        {/* Logo skeleton */}
        <div className="flex items-center gap-3">
          <div className="skeleton-bar h-8 w-8 rounded-lg" />
          <div className="skeleton-bar h-4 w-24" />
        </div>

        {/* Navigation pills skeleton */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 md:flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-bar h-3 w-14" />
          ))}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-mono text-[11px] text-[#00D9FF]/80">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#00D9FF]" />
            LOADING...
          </span>
          <div className="skeleton-bar h-8 w-20 rounded-full" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="relative mx-auto max-w-7xl px-6 pt-36 pb-24">
        {/* Top telemetry line */}
        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-4 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-[#00D9FF]">▸</span>
            <span>SYSTEM://INTERFACE.BOOTING</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton-bar h-2 w-28" />
            <span className="text-[10px] tracking-widest text-slate-600">STREAMING</span>
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7">
            {/* Tagline pill */}
            <div className="skeleton-shimmer mb-6 inline-flex h-7 w-48 rounded-full border border-[#00D9FF]/30 px-3 py-1" />

            {/* Title skeleton lines */}
            <div className="space-y-4">
              <div className="skeleton-bar h-12 w-full max-w-lg md:h-16" />
              <div className="skeleton-bar h-12 w-4/5 md:h-16" />
              <div className="skeleton-bar h-10 w-2/3 md:h-14" />
            </div>

            {/* Bio paragraph skeleton */}
            <div className="mt-8 space-y-2.5 max-w-xl">
              <div className="skeleton-bar h-3.5 w-full" />
              <div className="skeleton-bar h-3.5 w-11/12" />
              <div className="skeleton-bar h-3.5 w-4/5" />
            </div>

            {/* Button group skeleton */}
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="skeleton-shimmer h-12 w-40 rounded-full border border-[#00D9FF]/40" />
              <div className="skeleton-shimmer h-12 w-36 rounded-full border border-white/15" />
            </div>

            {/* Quick stats skeleton */}
            <div className="mt-12 flex gap-8 border-t border-white/5 pt-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="space-y-2">
                  <div className="skeleton-bar h-6 w-16" />
                  <div className="skeleton-bar h-2.5 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Column: 3D Holo Orb / Wireframe Placeholder */}
          <div className="lg:col-span-5">
            <div className="skeleton-shimmer relative aspect-square w-full rounded-3xl border border-[#00D9FF]/20 p-8 shadow-[0_0_50px_#00D9FF11]">
              <div className="flex h-full w-full flex-col items-center justify-center">
                {/* Concentric pulsing rings */}
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-[#00D9FF]/20">
                  <div className="h-40 w-40 animate-pulse rounded-full border border-[#00D9FF]/30" />
                  <div className="absolute h-28 w-28 rounded-full border border-[#8B5CF6]/40" />
                  <div className="absolute h-16 w-16 animate-ping rounded-full bg-[#00D9FF]/10" />
                  <div className="font-mono text-[10px] tracking-widest text-[#00D9FF]">3D_RENDER</div>
                </div>

                <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
                  <span>INITIALIZING SHADERS & MESHES</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects / Bento Grid Preview Skeleton */}
        <div className="mt-28">
          <div className="mb-8 flex items-end justify-between">
            <div className="space-y-2">
              <div className="skeleton-bar h-3 w-32" />
              <div className="skeleton-bar h-8 w-64 md:h-10" />
            </div>
            <div className="skeleton-bar hidden h-4 w-28 md:block" />
          </div>

          {/* 3 Project Card Skeletons */}
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="skeleton-shimmer relative flex min-h-[320px] flex-col justify-between rounded-2xl border border-white/10 p-6 shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="skeleton-bar h-3 w-20" />
                    <div className="skeleton-bar h-4 w-8" />
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="skeleton-bar h-6 w-3/4" />
                    <div className="skeleton-bar h-3.5 w-full" />
                    <div className="skeleton-bar h-3.5 w-5/6" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[1, 2, 3].map((t) => (
                      <div key={t} className="skeleton-bar h-5 w-14 rounded" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="skeleton-bar h-4 w-20" />
                  <div className="skeleton-bar h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
