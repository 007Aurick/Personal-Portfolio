import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { CAMERA, ORBIT, TRANSITION_MS } from './hero3dConfig';
import { useHero3D } from './Hero3DContext';

const lookAtIdle = new THREE.Vector3(...CAMERA.idle.lookAt);
const lookAtKillshot = new THREE.Vector3(...CAMERA.killshot.lookAt);
const lookAtCurrent = new THREE.Vector3();

/**
 * Perspective camera with GSAP transitions; idle vs killshot use different framing.
 */
export default function HeroCameraRig({ killshotActive }) {
  const { camera } = useThree();
  const { blendRef, entranceRef } = useHero3D();
  const controlsRef = useRef();
  const tweenRef = useRef(null);

  useEffect(() => {
    entranceRef.current = 0;
    camera.position.set(
      CAMERA.idle.position[0],
      CAMERA.idle.position[1] - 0.08,
      CAMERA.idle.position[2] + 0.2
    );
    if (camera.fov) camera.fov = CAMERA.idle.fov + 2;
    camera.updateProjectionMatrix();

    gsap.to(entranceRef, {
      current: 1,
      duration: 1.6,
      ease: 'power3.out',
    });
    gsap.to(camera.position, {
      x: CAMERA.idle.position[0],
      y: CAMERA.idle.position[1],
      z: CAMERA.idle.position[2],
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix(),
    });
    gsap.to(camera, {
      fov: CAMERA.idle.fov,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [camera, entranceRef]);

  useEffect(() => {
    if (tweenRef.current) tweenRef.current.kill();

    const target = killshotActive ? CAMERA.killshot : CAMERA.idle;
    tweenRef.current = gsap.timeline({
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    tweenRef.current.to(
      blendRef,
      { current: killshotActive ? 1 : 0, duration: TRANSITION_MS / 1000, ease: 'power2.inOut' },
      0
    );
    tweenRef.current.to(
      camera.position,
      {
        x: target.position[0],
        y: target.position[1],
        z: target.position[2],
        duration: TRANSITION_MS / 1000,
        ease: 'power2.inOut',
      },
      0
    );
    tweenRef.current.to(
      camera,
      { fov: target.fov, duration: TRANSITION_MS / 1000, ease: 'power2.inOut' },
      0
    );

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [killshotActive, camera, blendRef]);

  useFrame(() => {
    const t = blendRef.current;
    lookAtCurrent.copy(lookAtIdle).lerp(lookAtKillshot, t);
    camera.lookAt(lookAtCurrent);
    if (controlsRef.current) controlsRef.current.target.copy(lookAtCurrent);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={ORBIT.enablePan}
      enableZoom={ORBIT.enableZoom}
      minPolarAngle={ORBIT.minPolarAngle}
      maxPolarAngle={ORBIT.maxPolarAngle}
      minAzimuthAngle={ORBIT.minAzimuthAngle}
      maxAzimuthAngle={ORBIT.maxAzimuthAngle}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.35}
    />
  );
}
