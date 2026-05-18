import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BLOOM } from './hero3dConfig';
import { useHero3D } from './Hero3DContext';

/** Bloom pass — stronger on emissive hand/suit in killshot mode. */
export default function HeroPostProcessing() {
  const { blendRef } = useHero3D();
  const bloomRef = useRef();

  useFrame(() => {
    const bloom = bloomRef.current;
    if (!bloom) return;
    const t = blendRef.current;
    bloom.intensity = THREE.MathUtils.lerp(
      bloom.intensity,
      THREE.MathUtils.lerp(BLOOM.idle.intensity, BLOOM.killshot.intensity, t),
      0.08
    );
    bloom.luminanceThreshold = THREE.MathUtils.lerp(
      bloom.luminanceThreshold,
      THREE.MathUtils.lerp(BLOOM.idle.luminanceThreshold, BLOOM.killshot.luminanceThreshold, t),
      0.08
    );
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloomRef}
        intensity={BLOOM.idle.intensity}
        luminanceThreshold={BLOOM.idle.luminanceThreshold}
        luminanceSmoothing={BLOOM.idle.luminanceSmoothing}
        mipmapBlur
      />
    </EffectComposer>
  );
}
