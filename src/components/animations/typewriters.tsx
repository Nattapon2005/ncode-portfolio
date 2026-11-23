"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── tiny JS syntax tokenizer: string | keyword | key | punct | other ── */
type Tok = { t: string; c?: string };

const TOKEN_RE = /("[^"]*"|'[^']*')|(\b(?:const|let|var)\b)|([\w$.]+(?=:))|([{}[\]:;,=])|(\s+)|(\S+)/g;

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m[1]) out.push({ t: m[1], c: "tk-str" });
    else if (m[2]) out.push({ t: m[2], c: "tk-key" });
    else if (m[3]) out.push({ t: m[3], c: "tk-prop" });
    else if (m[4]) out.push({ t: m[4], c: "tk-punct" });
    else out.push({ t: m[5] ?? m[6] ?? "" });
  }
  return out;
}

/* slice the typed prefix out of a token list (keeps colors while typing) */
function sliceTokens(toks: Tok[], n: number): Tok[] {
  if (n <= 0) return [{ t: "\u00A0" }]; // ghost blank keeps the line height
  const res: Tok[] = [];
  let left = n;
  for (const tk of toks) {
    if (left <= 0) break;
    res.push(left >= tk.t.length ? tk : { t: tk.t.slice(0, left), c: tk.c });
    left -= tk.t.length;
  }
  return res;
}

/**
 * Terminal code card body: typewriter across lines with syntax colors,
 * line pauses, blinking block caret. Transform/opacity-free (text only),
 * safe under StrictMode, reduced-motion renders the finished code.
 */
export function TypewriterCode({
  lines,
  charMs = 9,
  linePause = 160,
  className = "",
}: {
  lines: string[];
  charMs?: number;
  linePause?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef(0);
  const [typed, setTyped] = useState(0);
  const total = useMemo(() => lines.reduce((a, l) => a + l.length, 0), [lines]);
  const tokens = useMemo(() => lines.map(tokenize), [lines]);
  const lineEnds = useMemo(() => {
    let acc = 0;
    return lines.map((l) => (acc += l.length));
  }, [lines]);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      typedRef.current = total;
      setTyped(total);
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const waitRef = { n: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: host,
        start: "top 78%",
        once: true,
        onEnter: () => {
          interval = setInterval(() => {
            waitRef.n -= waitRef.n > 0 ? 1 : 0;
            if (waitRef.n > 0) return;
            if (typedRef.current >= total) {
              if (interval) clearInterval(interval);
              return;
            }
            typedRef.current += 1;
            const next = typedRef.current;
            if (lineEnds.some((e) => e === next) && next < total) waitRef.n = Math.round(linePause / charMs);
            setTyped(next);
          }, charMs);
        },
      });
    }, host);
    return () => {
      ctx.revert();
      if (interval) clearInterval(interval);
    };
  }, [total, lineEnds, charMs, linePause]);

  const activeLine = typed >= total ? lines.length - 1 : lineEnds.findIndex((e) => typed < e);

  return (
    <div ref={hostRef} role="img" aria-label={`Terminal code: ${lines.join(" ")}`} className={className}>
      <div aria-hidden>
        {lines.map((_, i) => {
          const shown = sliceTokens(tokens[i], typed - lineEnds[i] + lines[i].length);
          const active = i === activeLine;
          return (
            <p key={i} className="relative whitespace-pre text-slate-300">
              {shown.map((tk, j) => (
                <span key={j} className={tk.c}>
                  {tk.t}
                </span>
              ))}
              {active && <span className="code-caret" />}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Types a single line of text once when it scrolls into view.
 * Used for the role/location badge.
 */
export function TypeOnce({
  text,
  speed = 18,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const nRef = useRef(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nRef.current = text.length;
      setN(text.length);
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: host,
        start: "top 88%",
        once: true,
        onEnter: () => {
          interval = setInterval(() => {
            if (nRef.current >= text.length) {
              if (interval) clearInterval(interval);
              return;
            }
            nRef.current += 1;
            setN(nRef.current);
          }, speed);
        },
      });
    }, host);
    return () => {
      ctx.revert();
      if (interval) clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <span ref={hostRef} aria-label={text} className={className}>
      <span aria-hidden>
        {text.slice(0, n)}
        <span className={`code-caret${n >= text.length ? " code-caret--live" : ""}`} />
      </span>
    </span>
  );
}
