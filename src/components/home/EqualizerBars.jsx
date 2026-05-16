import React from 'react';

const EqualizerBars = ({ active }) => {
  const heights = ['h-3', 'h-5', 'h-4', 'h-6', 'h-3', 'h-7', 'h-4'];
  return (
    <div className="flex h-8 items-end gap-0.5" aria-hidden={!active}>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-gradient-to-t from-gold/40 to-gold-light ${h} origin-bottom ${
            active ? 'animate-eq-bar' : 'scale-y-40 opacity-40'
          }`}
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
};

export default EqualizerBars;
