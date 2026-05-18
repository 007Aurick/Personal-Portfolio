import React from 'react';
import { motion } from 'framer-motion';

const heights = ['h-2.5', 'h-4', 'h-3.5', 'h-5', 'h-2.5', 'h-5', 'h-3'];

const EqualizerBars = ({ active }) => (
  <div className="flex h-7 items-end gap-[3px]" aria-hidden={!active}>
    {heights.map((h, i) => (
      <motion.span
        key={i}
        className={`w-[3px] origin-bottom rounded-full ${h} ${
          active
            ? 'bg-gradient-to-t from-[#1db954]/50 to-[#1ed760]'
            : 'scale-y-[0.35] bg-gradient-to-t from-gold/30 to-gold-light/50 opacity-40'
        }`}
        animate={
          active
            ? { scaleY: [0.35, 1, 0.5, 0.9, 0.35] }
            : { scaleY: 0.35 }
        }
        transition={
          active
            ? {
                duration: 0.85,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeInOut',
              }
            : undefined
        }
      />
    ))}
  </div>
);

export default EqualizerBars;
