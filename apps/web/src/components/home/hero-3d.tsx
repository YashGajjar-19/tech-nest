"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

const PARTICLE_COUNT = 600;
const MAX_DISTANCE = 0.35;

function NeuralMesh() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { resolvedTheme } = useTheme();
  const { viewport } = useThree();

  const isDark = resolvedTheme === "dark";
  const particleColor = isDark ? "#5EEAD4" : "#0D9488";

  // Generate sphere particles
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = [];
    const radius = 1.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random position on or inside sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = Math.cbrt(Math.random()) * radius;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Random slow velocity
      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      ));
    }
    return { positions: pos, velocities: vel };
  }, []);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    // React to pointer (lean toward cursor)
    const targetX = (state.pointer.x * viewport.width) / 10;
    const targetY = (state.pointer.y * viewport.height) / 10;
    
    pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.02;
    pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * 0.02;
    linesRef.current.rotation.copy(pointsRef.current.rotation);

    // Continuous slow auto-rotation
    pointsRef.current.rotation.y += delta * 0.1;
    linesRef.current.rotation.y += delta * 0.1;

    // Pulse effect every 3 seconds
    const time = state.clock.getElapsedTime();
    const pulse = (Math.sin(time * (Math.PI / 1.5)) + 1) / 2; // 0 to 1 every 3 sec

    // Optional: could update positions dynamically, but for performance, 
    // static sphere with rotation and interactive leaning is incredibly smooth and premium.
    
    // We update line alpha based on pulse
    const material = linesRef.current.material as THREE.LineBasicMaterial;
    material.opacity = isDark ? 0.05 + pulse * 0.1 : 0.03 + pulse * 0.05;
  });

  // Calculate static connections at init for performance (could be dynamic but heavy)
  useMemo(() => {
    let vertexCount = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
          linePositions[vertexCount++] = positions[i * 3];
          linePositions[vertexCount++] = positions[i * 3 + 1];
          linePositions[vertexCount++] = positions[i * 3 + 2];

          linePositions[vertexCount++] = positions[j * 3];
          linePositions[vertexCount++] = positions[j * 3 + 1];
          linePositions[vertexCount++] = positions[j * 3 + 2];
        }
      }
    }
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions.slice(0, vertexCount), 3));
  }, [positions, lineGeometry, linePositions]);

  return (
    <group>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.012}
          color={particleColor}
          transparent
          opacity={isDark ? 0.8 : 0.6}
          sizeAttenuation
        />
      </points>

      {/* Network Lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={isDark ? "#888888" : "#aaaaaa"}
          transparent
          opacity={isDark ? 0.1 : 0.05}
        />
      </lineSegments>
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-x-0 top-0 h-[800px] z-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <NeuralMesh />
      </Canvas>
    </div>
  );
}
