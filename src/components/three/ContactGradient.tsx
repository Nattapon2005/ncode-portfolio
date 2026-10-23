"use client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useEffect, useState } from "react";
import { config } from "@/config/site";
export default function ContactGradient() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const c = document.createElement("canvas");
    const isSupported = !!c.getContext("webgl2") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setOk(isSupported), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!ok) return null;
  return (<ShaderGradientCanvas style={{ position: "absolute", inset: 0, opacity: 0.5 }} pixelDensity={1} pointerEvents="none">
    <ShaderGradient type="waterPlane" animate="on" uSpeed={0.1} uStrength={1.5} {...config.shaderColors} brightness={0.8} grain="off" cDistance={3.6} cPolarAngle={90} /></ShaderGradientCanvas>);
}
