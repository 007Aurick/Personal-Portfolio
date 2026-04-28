import React, { useMemo } from 'react';
import './HeroPremiumBg.css';

const PARTICLE_SEEDS = [
  { left: 8, top: 18, delay: 0, duration: 24 },
  { left: 22, top: 62, delay: 1.2, duration: 28 },
  { left: 38, top: 28, delay: 2.4, duration: 22 },
  { left: 55, top: 72, delay: 0.6, duration: 26 },
  { left: 72, top: 15, delay: 3, duration: 30 },
  { left: 88, top: 48, delay: 1.8, duration: 25 },
  { left: 15, top: 85, delay: 2.1, duration: 27 },
  { left: 48, top: 8, delay: 0.3, duration: 23 },
  { left: 65, top: 38, delay: 2.7, duration: 29 },
  { left: 92, top: 78, delay: 1.5, duration: 24 },
  { left: 28, top: 45, delay: 3.2, duration: 26 },
  { left: 78, top: 88, delay: 0.9, duration: 28 },
  { left: 5, top: 42, delay: 1.1, duration: 27 },
  { left: 33, top: 92, delay: 2.5, duration: 28 },
  { left: 58, top: 52, delay: 0.4, duration: 25 },
  { left: 42, top: 68, delay: 3.5, duration: 29 }
];

const HeroPremiumBg = () => {
  const particles = useMemo(
    () =>
      PARTICLE_SEEDS.map((p, i) => ({
        id: i,
        left: `${p.left}%`,
        top: `${p.top}%`,
        style: {
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`
        }
      })),
    []
  );

  return (
    <div className="hero-premium-bg" aria-hidden="true">
      <div className="hero-premium-depth" />
      {particles.map((p) => (
        <span key={p.id} className="hero-premium-particle" style={{ left: p.left, top: p.top, ...p.style }} />
      ))}
    </div>
  );
};

export default HeroPremiumBg;
