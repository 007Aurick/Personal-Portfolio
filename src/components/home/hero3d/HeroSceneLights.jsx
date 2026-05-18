import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHero3D } from './Hero3DContext';

/** Cool cinematic lights — no gold/yellow wash. */
export default function HeroSceneLights() {
  const { blendRef, handLightRef } = useHero3D();
  const keyRef = useRef();
  const rimRef = useRef();
  const fillRef = useRef();

  useFrame(() => {
    const t = blendRef.current;
    const key = keyRef.current;
    const rim = rimRef.current;
    const fill = fillRef.current;
    const hand = handLightRef.current;

    if (key) {
      key.intensity = 0.85 + t * 0.35;
      key.color.setRGB(0.92, 0.96, 1);
    }
    if (rim) {
      rim.intensity = 1.4 + t * 0.6;
      rim.color.setRGB(0.45, 0.65, 1);
    }
    if (fill) {
      fill.intensity = 0.28 + t * 0.15;
      fill.color.setRGB(0.75, 0.82, 0.95);
    }
    if (hand) {
      hand.intensity = 0.25 + t * 1.8;
      hand.distance = 3.5;
      hand.position.set(
        THREE.MathUtils.lerp(0.42, -0.14, t),
        THREE.MathUtils.lerp(0.38, 0.36, t),
        THREE.MathUtils.lerp(0.55, 0.62, t)
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.32} color="#141820" />
      <directionalLight
        ref={keyRef}
        position={[2.2, 2.8, 4.5]}
        intensity={0.85}
        color="#eaf2ff"
      />
      <directionalLight
        ref={rimRef}
        position={[-3.2, 1.4, -2.5]}
        intensity={1.4}
        color="#6a9fd4"
      />
      <pointLight
        ref={fillRef}
        position={[-2, 0.2, 2.5]}
        intensity={0.28}
        color="#b8c4d8"
        distance={12}
      />
      <pointLight
        ref={handLightRef}
        position={[0.42, 0.38, 0.55]}
        intensity={0.25}
        color="#5ec8ff"
        distance={3.5}
      />
    </>
  );
}
