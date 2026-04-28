import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import './IntroLoader.css';

const LINES = [
  'INITIALIZING AURICK.OS',
  'LOADING PROJECTS...',
  'AI MODULE: ACTIVE',
  'ROBOTICS MODULE: ACTIVE',
  'SYSTEM READY'
];

const CHAR_MS = 52;
const PAUSE_AFTER_LINE_MS = 420;

const IntroLoader = ({ onComplete }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, idx) => ({
        id: idx,
        left: `${(idx * 13 + 7) % 100}%`,
        top: `${(idx * 23 + 17) % 100}%`,
        delay: `${(idx % 7) * 0.18}s`,
        duration: `${3.2 + (idx % 5) * 0.55}s`
      })),
    []
  );

  // Type current line one character at a time, pause, then next line
  useEffect(() => {
    if (lineIndex >= LINES.length) {
      return undefined;
    }

    const full = LINES[lineIndex];
    let pos = 0;

    const interval = setInterval(() => {
      pos += 1;
      if (pos <= full.length) {
        setCharIndex(pos);
      }
      if (pos >= full.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCharIndex(0);
          setLineIndex((i) => i + 1);
        }, PAUSE_AFTER_LINE_MS);
      }
    }, CHAR_MS);

    return () => clearInterval(interval);
  }, [lineIndex]);

  useEffect(() => {
    if (lineIndex < LINES.length) {
      return undefined;
    }

    const logoTimer = setTimeout(() => setShowLogo(true), 380);
    const ctaTimer = setTimeout(() => setShowCta(true), 1200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(ctaTimer);
    };
  }, [lineIndex]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => onComplete(), 700);
  };

  const allLinesDone = lineIndex >= LINES.length;

  return (
    <motion.div
      className="intro-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="intro-grid-scan" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="intro-particle"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}

      <div className="intro-content">
        <div className="intro-lines">
          {LINES.map((line, idx) => {
            if (idx > lineIndex) {
              return null;
            }

            const isComplete = idx < lineIndex;
            const display = isComplete ? line : line.slice(0, charIndex);
            const isActive = !allLinesDone && idx === lineIndex;

            return (
              <p key={line} className="intro-line">
                &gt; {display}
                {isActive && <span className="intro-cursor">|</span>}
              </p>
            );
          })}
        </div>

        <motion.h2
          className="intro-logo"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showLogo ? 1 : 0, y: showLogo ? 0 : 8 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          AURICK
        </motion.h2>

        <motion.button
          type="button"
          className="intro-enter-btn"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 10 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          onClick={handleEnter}
        >
          View Portfolio
        </motion.button>
      </div>
    </motion.div>
  );
};

export default IntroLoader;
