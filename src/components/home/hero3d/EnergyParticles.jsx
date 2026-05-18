import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHero3D } from './Hero3DContext';

const COUNT = 48;

/**
 * Subtle energy sparks around the extended hand — visible during killshot blend.
 */
export default function EnergyParticles() {
  const { blendRef } = useHero3D();
  const pointsRef = useRef();
  const materialRef = useRef();

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] = 0.45 + (Math.random() - 0.5) * 0.35;
      positions[i * 3 + 1] = 0.55 + (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 2] = 0.2 + (Math.random() - 0.5) * 0.35;
      speeds[i] = 0.4 + Math.random() * 1.2;
    }
    return { positions, speeds };
  }, []);

  useFrame((state) => {
    const blend = blendRef.current;
    const mat = materialRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;

    mat.opacity = THREE.MathUtils.lerp(mat.opacity, blend * 0.85, 0.08);
    pts.visible = mat.opacity > 0.02;

    const t = state.clock.elapsedTime;
    const attr = pts.geometry.attributes.position;
    for (let i = 0; i < COUNT; i += 1) {
      const y = positions[i * 3 + 1] + Math.sin(t * speeds[i] + i) * 0.04 * blend;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
    pts.rotation.y = Math.sin(t * 0.3) * 0.08 * blend;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.028}
        color="#6ecfff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
