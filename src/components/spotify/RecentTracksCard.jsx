import React from 'react';
import { motion } from 'framer-motion';
import { RecentTracksSkeleton } from './SpotifySkeleton';

function recentKey(item, index) {
  if (item.playedAt) return `recent-${item.playedAt}-${item.id ?? index}`;
  return `recent-${index}-${item.id ?? item.trackName}`;
}

const PlayIcon = () => (
  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const MAX_TRACKS = 10;

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const RecentTracksCard = ({ loading, tracks, emptyMessage = 'No recent tracks yet.' }) => {
  const displayTracks = tracks.slice(0, MAX_TRACKS);

  if (loading) {
    return <RecentTracksSkeleton />;
  }

  return (
    <motion.article
      className="flex h-full flex-col rounded-2xl border border-gold/30 bg-gradient-to-b from-ink-card/95 to-ink p-5 shadow-gold-glow backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.04 }}
    >
      <p className="mb-4 shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
        Recently played
      </p>

      <motion.ul
        className="flex flex-1 flex-col gap-1.5"
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {displayTracks.length === 0 ? (
          <li className="flex flex-1 items-center justify-center py-10 text-center text-sm text-zinc-500">
            {emptyMessage}
          </li>
        ) : null}
        {displayTracks.map((item, index) => (
          <motion.li key={recentKey(item, index)} variants={rowVariants} className="min-h-0 flex-1">
            <motion.a
              href={item.openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-full min-h-[52px] grid-cols-[1.5rem_44px_1fr_auto] items-center gap-3 rounded-xl border border-white/[0.07] bg-black/30 px-2.5 py-2 transition-colors hover:border-gold/35 hover:bg-gold/[0.03] hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]"
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <span className="text-center text-sm font-semibold text-zinc-500">
                {index + 1}
              </span>
              <motion.div
                className="h-11 w-11 overflow-hidden rounded-md border border-gold/20"
                whileHover={{ scale: 1.04 }}
              >
                <img src={item.albumArt} alt="" className="h-full w-full object-cover" />
              </motion.div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">{item.trackName}</p>
                <p className="truncate text-xs text-zinc-400">{item.artistName}</p>
              </div>
              <span className="flex shrink-0 items-center justify-center pr-1 text-[#1ed760]">
                <PlayIcon />
              </span>
            </motion.a>
          </motion.li>
        ))}
      </motion.ul>
    </motion.article>
  );
};

export default RecentTracksCard;
