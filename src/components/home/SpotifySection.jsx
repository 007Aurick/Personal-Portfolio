import React from 'react';
import { motion } from 'framer-motion';
import EqualizerBars from './EqualizerBars';
import { spotifyPlaceholder as spotify } from '../../data/spotifyPlaceholder';

const SpotifySection = () => {
  const { isPlaying, currentlyPlaying, recentlyPlayed } = spotify;

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Audio moodboard</p>
          <h2 className="font-display text-3xl font-bold text-[#eaeaea] md:text-4xl">Spotify desk</h2>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Live hookup pending — this is a styled placeholder until you wire the Web API + tokens.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
          <span
            className={`h-2 w-2 rounded-full ${isPlaying ? 'animate-pulse bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'bg-zinc-500'}`}
          />
          <span className="font-mono text-xs text-zinc-400">{isPlaying ? 'Playing (demo)' : 'Paused'}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-ink-card/95 via-ink-raised to-ink p-6 shadow-gold-glow md:p-8"
      >
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gold/30 shadow-lg shadow-black/40">
              <img src={currentlyPlaying.albumArt} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-light">Currently playing</p>
              <h3 className="truncate font-display text-xl font-semibold text-white md:text-2xl">
                {currentlyPlaying.trackName}
              </h3>
              <p className="truncate text-sm text-zinc-400">{currentlyPlaying.artistName}</p>
              <p className="mt-1 truncate text-xs text-zinc-500">{currentlyPlaying.albumName}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <EqualizerBars active={isPlaying} />
                <div className="h-px flex-1 bg-white/10 sm:hidden lg:block lg:max-w-[140px]" />
              </div>
            </div>
          </div>
          <div className="w-full max-w-xs lg:w-52">
            <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <span>Progress</span>
              <span>demo</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold via-gold-light to-gold-bright"
                style={{
                  width: `${Math.round((currentlyPlaying.progressMs / currentlyPlaying.durationMs) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-10 border-t border-white/10 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">Recently played</p>
            <span className="text-xs text-zinc-500">Horizontal scroll →</span>
          </div>
          <div className="-mx-2 flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {recentlyPlayed.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="group relative min-w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-inner shadow-black/40 transition-shadow hover:border-gold/40 hover:shadow-gold-glow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.albumArt}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="truncate font-display text-sm font-semibold text-white">{item.trackName}</p>
                  <p className="truncate text-xs text-zinc-400">{item.artistName}</p>
                  <p className="mt-1 font-mono text-[10px] text-gold/90">{item.playedAt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SpotifySection;
