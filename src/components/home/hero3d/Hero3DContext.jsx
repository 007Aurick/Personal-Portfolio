import React, { createContext, useContext, useMemo, useRef } from 'react';

const Hero3DContext = createContext(null);

/**
 * Shared refs/state for GSAP-driven transitions between idle and killshot.
 * `blend` is 0 (idle) → 1 (killshot), animated externally.
 */
export function Hero3DProvider({ killshotActive, pointer, children }) {
  const blendRef = useRef(0);
  const entranceRef = useRef(0);
  const groupRef = useRef(null);
  const handLightRef = useRef(null);

  const value = useMemo(
    () => ({
      killshotActive,
      blendRef,
      entranceRef,
      groupRef,
      handLightRef,
      pointer,
    }),
    [killshotActive, pointer]
  );

  return <Hero3DContext.Provider value={value}>{children}</Hero3DContext.Provider>;
}

export function useHero3D() {
  const ctx = useContext(Hero3DContext);
  if (!ctx) throw new Error('useHero3D must be used within Hero3DProvider');
  return ctx;
}
