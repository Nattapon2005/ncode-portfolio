// Optimized multi-layer background: grid, drifting aurora radial gradients, depth particles
let seed = 7;
const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const dots = Array.from({ length: 32 }, (_, i) => ({
  l: Math.round(rnd() * 100),
  t: Math.round(rnd() * 100),
  s: 1.5 + (i % 2),
  layer: (i % 3) + 1,
  c: i % 3 === 0 ? "#00D9FF" : i % 3 === 1 ? "#3B82F6" : "#8B5CF6",
}));

export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden contain-strict">
      <div className="bg-grid absolute inset-0 opacity-40" />
      {/* High-performance hardware accelerated radial gradients (replaces heavy blur filter) */}
      <div
        data-blob
        className="absolute -left-40 top-0 h-[60vh] w-[60vh] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }}
      />
      <div
        data-blob
        className="absolute right-[-10%] top-1/3 h-[55vh] w-[55vh] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }}
      />
      <div
        data-blob
        className="absolute bottom-[-10%] left-1/3 h-[50vh] w-[50vh] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.15) 0%, transparent 70%)" }}
      />
      {dots.map((d, i) => (
        <div key={i} className="absolute" style={{ left: `${d.l}%`, top: `${d.t}%` }}>
          <span
            className="twinkle block rounded-full"
            style={{
              width: d.s,
              height: d.s,
              background: d.c,
              animationDelay: `${(i % 7) * 0.5}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
