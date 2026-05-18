import React from 'react';
import heroArt from '../../../assets/aurick-hero.png';

/** Static hero image when WebGL / GLB load fails (e.g. models missing on deploy). */
export default function HeroCanvasFallback() {
  return (
    <img
      src={heroArt}
      alt="Aurick in tactical armored suit"
      className="batman-hero__img-fallback"
    />
  );
}
