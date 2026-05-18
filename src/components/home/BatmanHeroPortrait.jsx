import React, { lazy, Suspense, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Hero3DErrorBoundary from './hero3d/Hero3DErrorBoundary';
import HeroCanvasFallback from './hero3d/HeroCanvasFallback';
import './BatmanHeroPortrait.css';

const HeroCanvas = lazy(() =>
  import('./hero3d/HeroCanvas').catch((err) => {
    console.warn('[hero3d] Chunk load failed:', err);
    return { default: HeroCanvasFallback };
  })
);

const BatmanHeroPortrait = () => {
  const [killshotActive, setKillshotActive] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const toggleKillshot = useCallback(() => {
    setKillshotActive((prev) => !prev);
  }, []);

  const handleCanvasReady = useCallback(() => setCanvasReady(true), []);

  return (
    <motion.div
      className="batman-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div className="batman-hero__stage">
        <motion.div className="batman-hero__art batman-hero__art--3d">
          <Hero3DErrorBoundary>
            <Suspense fallback={<HeroCanvasFallback />}>
              <HeroCanvas
                killshotActive={killshotActive}
                className="batman-hero__canvas"
                onLoad={handleCanvasReady}
              />
            </Suspense>
          </Hero3DErrorBoundary>
        </motion.div>

        <motion.div className="batman-hero__controls">
          <button
            type="button"
            className={`batman-hero__toggle ${killshotActive ? 'batman-hero__toggle--active' : ''}`}
            onClick={toggleKillshot}
            aria-pressed={killshotActive}
            aria-label={killshotActive ? 'Deactivate Killshot mode' : 'Activate Killshot mode'}
          >
            <span className="batman-hero__toggle-label">
              {killshotActive ? 'Killshot Active' : 'Activate Killshot'}
            </span>
          </button>
          {!canvasReady && (
            <span className="batman-hero__loading-hint">Loading model…</span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BatmanHeroPortrait;
