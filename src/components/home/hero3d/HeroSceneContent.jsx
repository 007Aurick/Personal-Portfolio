import React, { Suspense, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import HeroCameraRig from './HeroCameraRig';
import HeroSceneLights from './HeroSceneLights';
import RobotAvatar from './RobotAvatar';
import HeroPostProcessing from './HeroPostProcessing';
import { CAMERA } from './hero3dConfig';
import { Hero3DProvider } from './Hero3DContext';

function SceneFallback() {
  return (
    <mesh visible={false}>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
    </mesh>
  );
}

function LoadNotifier({ onReady }) {
  const { progress } = useProgress();
  useEffect(() => {
    if (progress >= 100) onReady?.();
  }, [progress, onReady]);
  return null;
}

/**
 * All R3F scene objects — lighting, model, particles, post-FX, camera.
 */
export default function HeroSceneContent({ killshotActive, pointer, onReady }) {
  return (
    <Hero3DProvider killshotActive={killshotActive} pointer={pointer}>
      <HeroCameraRig killshotActive={killshotActive} />
      <HeroSceneLights />
      <LoadNotifier onReady={onReady} />
      <Suspense fallback={<SceneFallback />}>
        <RobotAvatar />
      </Suspense>
      <HeroPostProcessing />
    </Hero3DProvider>
  );
}

export { CAMERA };
