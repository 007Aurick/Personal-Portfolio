/**
 * Hero 3D tuning — camera / framing.
 * GLB source: `3D Models/` → `public/models/` via `npm run models:sync`
 */
export const MODEL_URLS = {
  idle: '/models/idle.glb',
  killshot: '/models/killshot.glb',
};

export const CAMERA = {
  idle: {
    position: [0.38, 0.3, 3.38],
    fov: 40,
    lookAt: [0.06, 0.4, 0.12],
  },
  /** Pulled back + shifted — full hand-forward pose, no right-edge crop. */
  killshot: {
    position: [0.26, 0.28, 3.72],
    fov: 42,
    lookAt: [-0.08, 0.38, 0.16],
  },
};

export const MODEL = {
  position: [0, 0.04, 0],
  rotation: [0, -0.2, 0],
  scale: 1.08,
};

/** Idle bust — current sweet spot. */
export const FIT_IDLE = {
  headY: 1.28,
  baseY: -0.96,
  offsetX: 0.14,
  viewScale: 1.05,
  widthWeight: 0.45,
  depthWeight: 0.82,
};

/** Killshot — wider X fit + shift left so hand + far shoulder stay in frame. */
export const FIT_KILLSHOT = {
  headY: 1.28,
  baseY: -0.96,
  offsetX: -0.1,
  viewScale: 0.96,
  widthWeight: 0.72,
  depthWeight: 0.9,
};

export const ORBIT = {
  enablePan: false,
  enableZoom: false,
  minPolarAngle: Math.PI / 2.55,
  maxPolarAngle: Math.PI / 2.05,
  minAzimuthAngle: -0.28,
  maxAzimuthAngle: 0.28,
};

export const BLOOM = {
  idle: { intensity: 0.22, luminanceThreshold: 0.88, luminanceSmoothing: 0.4 },
  killshot: { intensity: 0.48, luminanceThreshold: 0.72, luminanceSmoothing: 0.3 },
};

export const TRANSITION_MS = 1400;
