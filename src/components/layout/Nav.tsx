"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import DevLogo from "@/components/layout/DevLogo";
import Github from "@/components/layout/GithubIcon";

export default function Nav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    site.nav.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[90] flex justify-center px-4 pt-4 sm:pt-6">
      {/* Floating Glassmorphic Pill Container */}
      <nav
        aria-label="Primary"
        className={`relative flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#070d1a]/75 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 sm:px-6 sm:py-3 ${
          scrolled ? "border-[#00D9FF]/20 shadow-[0_16px_50px_#00000099]" : ""
        }`}
      >
        {/* sheen sweep on the glass pill */}
        <span aria-hidden className="nav-sheen pointer-events-none absolute inset-0 rounded-full" />

        {/* scroll progress hair-line */}
        <div aria-hidden className="absolute -bottom-px left-6 right-6 h-px overflow-hidden rounded-full opacity-90">
          <div ref={progress} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#00D9FF] via-[#3B82F6] to-[#8B5CF6] shadow-[0_0_10px_#00D9FF99]" />
        </div>
        {/* Left: Developer Brand Logo */}
        <DevLogo />

        {/* Center: Navigation Links */}
        <ul className="hidden items-center gap-1.5 md:flex">
          {site.nav.map((id) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive}
                  className={`relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[#00D9FF]/15 border border-[#00D9FF]/40 shadow-[0_0_12px_#00D9FF33]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {id}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Action: Let's Talk CTA & GitHub */}
        <div className="hidden items-center gap-2.5 sm:flex">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-[#00D9FF] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10"
          >
            <Github size={15} />
          </a>

          <a
            href="#contact"
            className="group flex items-center gap-1.5 rounded-full bg-[#00D9FF] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#05070D] shadow-[0_0_20px_#00D9FF44] transition-all duration-300 hover:bg-white hover:shadow-[0_0_25px_#ffffff66]"
          >
            <span>Let’s Talk</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`absolute top-full left-4 right-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#070d1a]/95 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 p-0 border-transparent opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {site.nav.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all ${
                  active === id
                    ? "bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {id}
              </a>
            </li>
          ))}
          <li className="mt-2 border-t border-white/10 pt-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D9FF] py-3 text-xs font-bold uppercase tracking-wider text-[#05070D]"
            >
              <span>Let’s Talk</span>
              <ArrowUpRight size={14} />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
