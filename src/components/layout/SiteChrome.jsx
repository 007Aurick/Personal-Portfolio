import React from 'react';

/**
 * Global atmosphere: ambient glow + film grain (premium / cinematic).
 */
const SiteChrome = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-[#eaeaea]">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(181,122,16,0.09),transparent_55%),radial-gradient(ellipse_at_85%_65%,rgba(181,122,16,0.05),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-grain opacity-[0.045] mix-blend-overlay"
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
};

export default SiteChrome;
