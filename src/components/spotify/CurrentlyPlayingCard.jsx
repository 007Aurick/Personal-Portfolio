import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EqualizerBars from './EqualizerBars';
import { CurrentlyPlayingSkeleton } from './SpotifySkeleton';

const CurrentlyPlayingCard = ({ loading, isPlaying, track, progressMs, durationMs }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying || !durationMs) {
      setDisplayProgress(0);
      return undefined;
    }

    const started = Date.now();
    const base = progressMs;

    const tick = () => {
      const elapsed = Date.now() - started;
      setDisplayProgress(Math.min(base + elapsed, durationMs));
    };

    tick();
    const id = window.setInterval(tick, 400);
    return () => window.clearInterval(id);
  }, [isPlaying, progressMs, durationMs, track?.id]);

  const progressPct =
    isPlaying && durationMs > 0
      ? Math.min(100, Math.round((displayProgress / durationMs) * 100))
      : 0;

  if (loading) {
    return <CurrentlyPlayingSkeleton />;
  }

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-ink-card via-ink-raised to-ink p-5 shadow-gold-glow backdrop-blur-sm transition-shadow duration-300 hover:border-gold/45 hover:shadow-gold-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -2 }}
    >
      <motion.div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <p className="relative mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
        Currently playing
      </p>

      <motion.div
        className="relative flex flex-row items-center gap-4"
        animate={isPlaying && track ? { opacity: [0.92, 1, 0.92] } : { opacity: 1 }}
        transition={
          isPlaying && track
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        <motion.div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gold/35 shadow-lg shadow-black/50">
          {isPlaying && track ? (
            <>
              <img src={track.albumArt} alt="" className="h-full w-full object-cover" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"
                animate={{ opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </>
          ) : (
            <motion.div className="flex h-full w-full items-center justify-center bg-black/50">
              <img src="/Spotify.png" alt="" className="h-11 w-11 object-contain" />
            </motion.div>
          )}
        </motion.div>

        <motion.div className="min-w-0 flex-1 text-left" layout>
          <motion.div className="mb-2 flex flex-wrap items-center gap-3">
            {isPlaying && track ? (
              <>
                <span
                  className="relative flex h-2.5 w-2.5 items-center justify-center"
                  title="Live"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1ed760]/40" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[#1ed760] shadow-[0_0_14px_rgba(30,215,96,0.75)]" />
                </span>
                <EqualizerBars active />
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" title="Not playing" />
                <EqualizerBars active={false} />
              </>
            )}
          </motion.div>

          {isPlaying && track ? (
            <>
              <h3 className="truncate font-display text-xl font-semibold text-white">
                {track.trackName}
              </h3>
              <p className="truncate text-sm text-zinc-400">{track.artistName}</p>
              {track.albumName ? (
                <p className="mt-0.5 truncate text-xs text-zinc-500">{track.albumName}</p>
              ) : null}
            </>
          ) : (
            <>
              <h3 className="truncate font-display text-xl font-semibold text-zinc-200">
                User is not playing music
              </h3>
              <p className="truncate text-sm text-zinc-500">Nothing on Spotify right now</p>
            </>
          )}

          <motion.div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/60 ring-1 ring-white/10">
            <motion.div
              className={`h-full rounded-full ${
                isPlaying && track
                  ? 'bg-gradient-to-r from-[#1db954] via-[#1ed760] to-gold-light/80'
                  : 'bg-zinc-700/50'
              }`}
              style={{ width: isPlaying && track ? `${progressPct}%` : '0%' }}
              layout
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
};

export default CurrentlyPlayingCard;
