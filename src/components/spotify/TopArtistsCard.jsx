import React from 'react';
import { motion } from 'framer-motion';
import { TopArtistsSkeleton } from './SpotifySkeleton';

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

const TopArtistsCard = ({ loading, artists, hint }) => {
  if (loading) {
    return <TopArtistsSkeleton />;
  }

  return (
    <motion.article
      className="flex flex-1 flex-col rounded-2xl border border-gold/25 bg-ink-card/95 p-5 shadow-gold-glow backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.06 }}
    >
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
        Top artists
      </p>
      <p className="mb-4 text-xs text-zinc-500">Short term · last ~4 weeks</p>
      {hint && <p className="mb-3 text-xs text-tech-light/80">{hint}</p>}

      <motion.ul
        className="flex flex-1 flex-col justify-between gap-2"
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <motion.li key={artist.id || artist.name} variants={rowVariants}>
              <motion.a
                href={artist.openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-[1.5rem_44px_1fr] items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-gold/25 hover:bg-gold/[0.04]"
                whileHover={{ x: 4 }}
              >
                <span className="text-center font-mono text-xs font-bold text-zinc-500">
                  {index + 1}
                </span>
                <motion.div
                  className="h-11 w-11 overflow-hidden rounded-full border border-gold/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={artist.image} alt="" className="h-full w-full object-cover" />
                </motion.div>
                <span className="truncate font-medium text-zinc-100 transition-colors group-hover:text-gold-light">
                  {artist.name}
                </span>
              </motion.a>
            </motion.li>
          ))
        ) : (
          <li className="py-4 text-sm text-zinc-500">No top artists data yet.</li>
        )}
      </motion.ul>
    </motion.article>
  );
};

export default TopArtistsCard;
