import React from 'react';
import { motion } from 'framer-motion';
import heroArt from '../../assets/aurick-hero.png';
import './BatmanHeroPortrait.css';

const WAVE_COUNT = 5;

const BatmanHeroPortrait = () => {
  return (
    <motion.div
      className="batman-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div className="batman-hero__stage">
        <motion.div className="batman-hero__art">
          <img
            src={heroArt}
            alt="Aurick in tactical armored suit"
            className="batman-hero__img"
          />

          <motion.div className="batman-hero__fx" aria-hidden>
            <motion.div className="batman-hero__waves">
              {Array.from({ length: WAVE_COUNT }, (_, i) => (
                <span
                  key={i}
                  className="batman-hero__wave"
                  style={{ animationDelay: `${i * 0.48}s` }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BatmanHeroPortrait;
