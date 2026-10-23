"use client";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useState } from "react";
import { config } from "@/config/site";
export default function Shapes() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const c = document.createElement("canvas");
    const isSupported = !!(c.getContext("webgl2") || c.getContext("webgl")) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      config.quality3D !== "low";
    const timer = setTimeout(() => setOk(isSupported), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!ok) return null;
  const dpr: [number, number] = innerWidth < 768 ? [1, 1] : [1, 1.5];
  return (<div className="pointer-events-none absolute inset-0 z-[5] opacity-70" aria-hidden>
    <Canvas dpr={dpr} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: false, powerPreference: "low-power" }}>
      <ambientLight intensity={0.4} /><pointLight position={[5, 5, 5]} color="#00D9FF" intensity={30} /><pointLight position={[-5, -3, 2]} color="#8B5CF6" intensity={25} />
      <Float speed={1.5} floatIntensity={2}><mesh position={[-3.5, 1, 0]}><icosahedronGeometry args={[0.9]} /><meshStandardMaterial color="#3B82F6" wireframe /></mesh></Float>
      <Float speed={2} floatIntensity={2}><mesh position={[3.6, -1, -1]}><octahedronGeometry args={[0.8]} /><meshStandardMaterial color="#00D9FF" wireframe /></mesh></Float>
    </Canvas></div>);
}
