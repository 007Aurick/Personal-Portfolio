import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AmbientParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${6 + ((i * 23) % 88)}%`,
        size: 2 + (i % 3),
        delay: (i % 7) * 0.4,
        duration: 6 + (i % 5),
      })),
    [],
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gold/30 blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 8, 0],
            opacity: [0.15, 0.55, 0.15],
            scale: [1, 1.35, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      <motion.div
        className="absolute -left-20 top-1/4 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"
        animate={{ opacity: [0.2, 0.4, 0.2], x: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

export default AmbientParticles;
