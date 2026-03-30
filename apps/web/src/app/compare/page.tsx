"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { SoftShadows, RoundedBox, Html, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTheme } from "next-themes";

/* ── "Gliding" 3D Phone Model ── */
function PhoneModel({ isDark, position, rotationY = 0 }: { isDark: boolean; position: [number, number, number]; rotationY?: number; layoutIdPrefix?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
        // Reduced subtle rotation for comparison mode
        const targetX = (state.pointer.x * Math.PI) / 12;
        const targetY = (state.pointer.y * Math.PI) / 24;
        
        groupRef.current.rotation.y += (targetX + rotationY - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1.5}>
      <group ref={groupRef} position={position}>
        {/* Soft Volume Lighting */}
        {isDark && (
          <pointLight position={[0, 0, -2]} intensity={25} color="#2DD4BF" distance={6} decay={2} />
        )}
        
        {/* Phone Case */}
        <RoundedBox args={[3.0, 6.2, 0.3]} radius={0.3} smoothness={16} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color={isDark ? "#0A0A0A" : "#FFFFFF"} roughness={0.15} metalness={0.7} />
        </RoundedBox>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.151]}>
          <planeGeometry args={[2.8, 6.0]} />
          <meshStandardMaterial color={isDark ? "#030303" : "#F3F3F5"} roughness={0.1} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  const comparisonData = [
    { label: "OLED Display", device1: 94, device2: 89, layoutId: "display" },
    { label: "Processor", device1: 98, device2: 92, layoutId: "processor" },
    { label: "Thermal Output", device1: 88, device2: 80, layoutId: "battery" },
  ];

  return (
    <div className="relative w-full min-h-[1000px] flex flex-col items-center pt-[120px] overflow-hidden">
      
      {/* Background radial gradient to enhance the Teal Mist */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[var(--bg-base)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center flex flex-col items-center mb-16">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tn-label mb-4 block text-[var(--text-secondary)]">Surgical Precision</span>
          <h1 className="text-[48px] md:text-[64px] leading-[1.05] tracking-[-0.035em] font-[200] max-w-[800px] font-[family-name:var(--font-geist-sans)]">
            Compare <span className="text-[var(--text-muted)]">Devices.</span>
          </h1>
        </motion.div>
      </div>

      {/* Comparison Arena */}
      <div className="relative w-full max-w-[1200px] h-[600px] flex justify-between items-center z-20 mx-auto px-8">
        
        {/* Device 1 (Left) */}
        <motion.div layoutId="phone-model-1" className="absolute left-0 w-[400px] h-[600px] pointer-events-none z-0">
          {mounted && (
            <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 45 }}>
              <ambientLight intensity={isDark ? 0.3 : 0.8} />
              <directionalLight position={[5, 10, 5]} intensity={isDark ? 1.5 : 1} castShadow />
              <PhoneModel isDark={isDark} position={[0, 0, 0]} rotationY={0.2} layoutIdPrefix="model-1" />
            </Canvas>
          )}
        </motion.div>

        {/* Central Morphing Comparison Bars */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12 z-30 pointer-events-auto max-w-[400px] mx-auto">
          {comparisonData.map((item, index) => (
            <motion.div 
              key={item.label}
              layoutId={`node-card-${item.layoutId}`}
              className="w-full relative px-6 py-5 rounded-[24px] border border-white/[0.08] bg-black/40 backdrop-blur-xl flex flex-col gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="text-center w-full">
                <span className="text-[11px] font-medium tracking-widest uppercase text-slate-400 font-[family-name:var(--font-geist-sans)]">{item.label}</span>
              </div>
              
              <div className="flex items-center justify-between w-full h-8 relative">
                 {/* Left Device Score */}
                 <span className="text-[20px] font-[family-name:var(--font-geist-mono)] text-[#2DD4BF] z-10 bg-black/50 px-2 rounded-md backdrop-blur-md">{item.device1}</span>
                 
                 {/* Right Device Score */}
                 <span className="text-[20px] font-[family-name:var(--font-geist-mono)] text-white z-10 bg-black/50 px-2 rounded-md backdrop-blur-md">{item.device2}</span>

                 {/* Comparison Bar Track */}
                 <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-1 bg-white/5 rounded-full overflow-hidden">
                    {/* Fill */}
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-[#2DD4BF]"
                      initial={{ width: "50%" }}
                      animate={{ width: `${(item.device1 / (item.device1 + item.device2)) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring", damping: 25, stiffness: 100 }}
                    />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Device 2 (Right) */}
        <motion.div layoutId="phone-model-2" className="absolute right-0 w-[400px] h-[600px] pointer-events-none z-0">
          {mounted && (
            <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 45 }}>
              <ambientLight intensity={isDark ? 0.3 : 0.8} />
              <directionalLight position={[-5, 10, 5]} intensity={isDark ? 1.5 : 1} castShadow />
              <PhoneModel isDark={isDark} position={[0, 0, 0]} rotationY={-0.2} layoutIdPrefix="model-2" />
            </Canvas>
          )}
        </motion.div>

      </div>
    </div>
  );
}
