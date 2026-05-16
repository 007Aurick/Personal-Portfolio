import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const phrases = [
  'Robotics prototypes that start ugly — then get less embarrassing.',
  'Computer vision stacks that fib less every iteration.',
  'Software that has to survive real demos, not slide decks.',
];

const TypingHeadline = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="max-w-xl space-y-3">
      <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
        I&apos;m an{' '}
        <span className="bg-gradient-to-r from-gold-light via-gold to-gold-bright bg-clip-text font-semibold text-transparent">
          engineering student
        </span>{' '}
        building cool things with robotics, AI, and software — mostly late nights, coffee, and printf debugging.
      </p>
      <motion.p
        key={phrases[index]}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-sm italic leading-relaxed text-zinc-500 md:text-base"
      >
        {phrases[index]}
      </motion.p>
    </div>
  );
};

export default TypingHeadline;
