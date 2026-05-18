import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { FIT_IDLE, FIT_KILLSHOT, MODEL, MODEL_URLS } from './hero3dConfig';
import { fitModelToFrame } from './fitModel';
import { useHero3D } from './Hero3DContext';

useGLTF.preload(MODEL_URLS.idle);
useGLTF.preload(MODEL_URLS.killshot);

function applyEmissiveBoost(root, blend, base = 1) {
  if (!root || blend <= 0.001) return;
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      if (!mat.emissive) return;
      if (!mat.userData._baseEmissive) {
        mat.userData._baseEmissive = mat.emissive.clone();
        mat.userData._baseIntensity = mat.emissiveIntensity ?? 1;
      }
      const boost = 1 + blend * 1.6 * base;
      mat.emissive.copy(mat.userData._baseEmissive).multiplyScalar(boost);
      mat.emissiveIntensity = (mat.userData._baseIntensity ?? 1) * (1 + blend * 1.1);
    });
  });
}

function ModelInstance({ url, fit }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => {
    const cloned = scene.clone(true);
    fitModelToFrame(cloned, fit);
    return cloned;
  }, [scene, fit]);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return undefined;
    const names = Object.keys(actions);
    if (!names.length) return undefined;
    const action = actions[names[0]];
    action.reset().fadeIn(0.4).play();
    return () => action.fadeOut(0.3);
  }, [actions]);

  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={group}>
      <primitive object={clone} />
    </group>
  );
}

export default function RobotAvatar() {
  const { blendRef, entranceRef, groupRef, pointer } = useHero3D();
  const idleRoot = useRef();
  const killshotRoot = useRef();

  useFrame((state) => {
    const blend = blendRef.current;
    const entrance = entranceRef.current;
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    const breathe = Math.sin(t * 1.15) * 0.002 * (1 - blend * 0.35);
    const floatY = Math.sin(t * 0.85) * 0.004 * (1 - blend * 0.25);
    group.position.y = MODEL.position[1] + floatY;
    group.scale.setScalar(MODEL.scale * (1 + breathe) * (0.97 + entrance * 0.03));

    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;
    const targetYaw = MODEL.rotation[1] + px * 0.08 * (1 - blend * 0.3);
    const targetPitch = px * 0.02 + py * 0.03;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetYaw, 0.06);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetPitch, 0.06);

    [idleRoot, killshotRoot].forEach((ref, idx) => {
      const root = ref.current;
      if (!root) return;
      const targetOpacity = idx === 0 ? 1 - blend : blend;
      root.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 1, targetOpacity, 0.12);
          mat.depthWrite = mat.opacity > 0.92;
        });
      });
    });

    applyEmissiveBoost(idleRoot.current, blend * 0.25, 0.5);
    applyEmissiveBoost(killshotRoot.current, blend, 1);
  });

  return (
    <group
      ref={groupRef}
      position={MODEL.position}
      rotation={MODEL.rotation}
      scale={MODEL.scale}
    >
      <group ref={idleRoot}>
        <ModelInstance url={MODEL_URLS.idle} fit={FIT_IDLE} />
      </group>
      <group ref={killshotRoot}>
        <ModelInstance url={MODEL_URLS.killshot} fit={FIT_KILLSHOT} />
      </group>
    </group>
  );
}
