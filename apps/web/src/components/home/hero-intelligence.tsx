"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════
   THE DATA CRYSTAL — "Intelligence Engine" Hero
   
   A multi-faceted crystalline core surrounded by orbital rings.
   Each orbital represents a data category being analyzed.
   The crystal breathes with light; hovering a category 
   brightens the corresponding facet in Cyber Teal.
   ══════════════════════════════════════════════════════════════ */

/* ── Intelligence Categories (Orbitals) ── */
const categories = [
  { id: "display",     label: "Display",     angle: 0,   detail: "2000 nit peak · ProMotion 120Hz" },
  { id: "performance", label: "Performance", angle: 72,  detail: "A17 Pro · 35T ops/sec neural" },
  { id: "camera",      label: "Camera",      angle: 144, detail: "48MP fusion · Photonic Engine" },
  { id: "battery",     label: "Battery",     angle: 216, detail: "29hr video · USB-C fast charge" },
  { id: "build",       label: "Build",       angle: 288, detail: "Grade 5 titanium · ceramic shield" },
];

/* ── Orbital Ring ── */
function OrbitalRing({ radius, speed, tilt, opacity }: {
  radius: number; speed: number; tilt: number; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z += speed * 0.001;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.004, 16, 128]} />
      <meshBasicMaterial color="#2DD4BF" transparent opacity={opacity} />
    </mesh>
  );
}

/* ── Floating Category Label ── */
function CategoryLabel({ category, index, activeId, onHover }: {
  category: typeof categories[0];
  index: number;
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const angleRad = (category.angle * Math.PI) / 180;
  const radius = 2.2;
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;
  const isActive = activeId === category.id;

  useFrame((state) => {
    if (ref.current) {
      // Gentle float
      ref.current.position.y = y + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
    }
  });

  return (
    <group ref={ref} position={[x, y, 0.5]}>
      {/* Leader line from crystal to label */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              -x * 0.35, -y * 0.35, -0.5,
              0, 0, 0,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2DD4BF" transparent opacity={isActive ? 0.5 : 0.12} />
      </line>

      <Html center className="pointer-events-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 + index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => onHover(category.id)}
          onMouseLeave={() => onHover(null)}
          className={`
            cursor-default whitespace-nowrap px-4 py-2.5 rounded-sm
            border transition-all duration-500
            ${isActive
              ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/8"
              : "border-white/8 bg-black/60 hover:border-white/15"
            }
            backdrop-blur-xl
          `}
        >
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isActive ? "bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]" : "bg-white/20"}`} />
            <span className="text-[10px] tracking-[2px] uppercase text-white/70 font-[family-name:var(--font-geist-mono)]">
              {category.label}
            </span>
          </div>
          {isActive && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 6 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="text-[11px] text-[#2DD4BF]/70 font-[family-name:var(--font-geist-mono)] pl-[18px]"
            >
              {category.detail}
            </motion.p>
          )}
        </motion.div>
      </Html>
    </group>
  );
}

/* ── The Crystal Core ── */
function DataCrystal({ activeId }: { activeId: string | null }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (crystalRef.current) {
      // Slow, deliberate rotation — precision hardware, not a toy
      crystalRef.current.rotation.y += 0.002;
      crystalRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;

      // "Breathing" pulse scale
      const breathe = 1.0 + Math.sin(t * 0.8) * 0.015;
      crystalRef.current.scale.setScalar(breathe);
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.003;
      innerRef.current.rotation.z = Math.cos(t * 0.4) * 0.15;
    }

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 0.6) * 0.02 + (activeId ? 0.03 : 0);
    }
  });

  const tealEmissive = activeId ? 0.15 : 0.05;

  return (
    <group>
      {/* Radial Glow — the atmosphere */}
      <mesh ref={glowRef} scale={4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#2DD4BF" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Outer Crystal — frosted glass icosahedron */}
      <mesh ref={crystalRef} castShadow>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshPhysicalMaterial
          color="#0a1a1f"
          metalness={0.1}
          roughness={0.15}
          transmission={0.92}
          thickness={2.5}
          ior={2.4}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.2}
          emissive="#2DD4BF"
          emissiveIntensity={tealEmissive}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Crystal — sharper, denser, rotates opposite */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshPhysicalMaterial
          color="#0d2b2b"
          metalness={0.3}
          roughness={0.05}
          transmission={0.7}
          thickness={1.5}
          ior={2.8}
          clearcoat={1}
          emissive="#2DD4BF"
          emissiveIntensity={tealEmissive * 2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Wireframe overlay — technical precision lines */}
      <mesh>
        <icosahedronGeometry args={[1.32, 1]} />
        <meshBasicMaterial color="#2DD4BF" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Orbital Rings — data categories being processed */}
      <OrbitalRing radius={1.8} speed={0.4} tilt={Math.PI / 6} opacity={0.15} />
      <OrbitalRing radius={2.1} speed={-0.3} tilt={-Math.PI / 4} opacity={0.08} />
      <OrbitalRing radius={2.5} speed={0.2} tilt={Math.PI / 3} opacity={0.05} />
    </group>
  );
}

/* ── Scene (Lighting + Crystal + Labels) ── */
function IntelligenceScene({ activeId, onHover }: {
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle parallax tilt (3-5 degrees)
      const tx = (state.pointer.x * Math.PI) / 40;
      const ty = (state.pointer.y * Math.PI) / 40;
      groupRef.current.rotation.y += (tx - groupRef.current.rotation.y) * 0.06;
      groupRef.current.rotation.x += (ty - groupRef.current.rotation.x) * 0.06;
    }
  });

  return (
    <>
      {/* Lighting — dramatic single-source */}
      <ambientLight intensity={0.15} />
      <spotLight
        position={[5, 8, -3]}
        intensity={15}
        penumbra={0.8}
        color="#ffffff"
        angle={0.4}
      />
      <pointLight position={[-4, -2, 4]} intensity={2} color="#2DD4BF" distance={12} />

      {/* Contact shadow for mass */}
      <ContactShadows
        position={[0, -2.8, 0]}
        opacity={0.8}
        scale={12}
        blur={3}
        far={8}
        color="#0a1a1f"
      />

      <group ref={groupRef}>
        <DataCrystal activeId={activeId} />

        {/* Category Labels */}
        {categories.map((cat, i) => (
          <CategoryLabel
            key={cat.id}
            category={cat}
            index={i}
            activeId={activeId}
            onHover={onHover}
          />
        ))}
      </group>

      <Environment preset="night" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPORT — Hero Section Layout
   Asymmetrical: Text left 40% · Crystal right 60%
   ══════════════════════════════════════════════════════════════ */

export function HeroIntelligence() {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const handleHover = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  return (
    <div className="relative w-full min-h-[1000px] flex items-center overflow-hidden bg-black">

      {/* Radial atmosphere behind crystal */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Left Column — Editorial Copy */}
      <div className="center-col w-full h-full flex flex-col md:flex-row items-center relative z-10">
        <div className="w-full md:w-[42%] flex flex-col items-start justify-center py-32 md:py-0 pr-0 md:pr-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Brand mark */}
            <span className="inline-block text-[10px] tracking-[0.1em] uppercase text-white/40 font-[family-name:var(--font-geist-mono)] border border-white/8 px-3 py-1.5 mb-10">
              Tech Nest
            </span>

            {/* Headline — Geist Sans Light */}
            <h1 className="text-[44px] md:text-[68px] leading-[1.06] tracking-[-0.035em] font-light font-[family-name:var(--font-geist-sans)] text-white">
              Technology,
              <br />
              <span className="text-white/30">Deciphered.</span>
            </h1>

            {/* Subtext — Geist Mono for engineering precision */}
            <p className="mt-10 text-[14px] font-[family-name:var(--font-geist-mono)] text-[#86868B] leading-[1.9] max-w-[380px]">
              Analyzing 4,200+ hardware variables across every component. Precision intelligence, zero noise.
            </p>

            {/* Stat line — functional teal, not decorative */}
            <div className="mt-14 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[28px] font-light text-[#2DD4BF] font-[family-name:var(--font-geist-mono)] leading-none">
                  4.2K
                </span>
                <span className="text-[10px] tracking-[2px] uppercase text-white/25 mt-2 font-[family-name:var(--font-geist-mono)]">
                  Variables
                </span>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div className="flex flex-col">
                <span className="text-[28px] font-light text-[#2DD4BF] font-[family-name:var(--font-geist-mono)] leading-none">
                  98.7
                </span>
                <span className="text-[10px] tracking-[2px] uppercase text-white/25 mt-2 font-[family-name:var(--font-geist-mono)]">
                  Accuracy %
                </span>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div className="flex flex-col">
                <span className="text-[28px] font-light text-[#2DD4BF] font-[family-name:var(--font-geist-mono)] leading-none">
                  340+
                </span>
                <span className="text-[10px] tracking-[2px] uppercase text-white/25 mt-2 font-[family-name:var(--font-geist-mono)]">
                  Devices
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column — 3D Crystal Canvas */}
      <div className="absolute right-[-8%] top-0 bottom-0 w-[100%] md:w-[65%] z-0 pointer-events-auto">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 7], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <IntelligenceScene activeId={activeId} onHover={handleHover} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
