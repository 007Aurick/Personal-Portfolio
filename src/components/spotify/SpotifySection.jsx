import React from 'react';
import { motion } from 'framer-motion';
import { useSpotifyFeed } from '../../hooks/useSpotifyFeed';
import AmbientParticles from './AmbientParticles';
import CurrentlyPlayingCard from './CurrentlyPlayingCard';
import RecentTracksCard from './RecentTracksCard';
import TopArtistsCard from './TopArtistsCard';
import SpotifySkeleton from './SpotifySkeleton';

const SpotifySection = () => {
  const {
    loading,
    error,
    warning,
    currentlyPlaying,
    recentTracks,
    topArtists,
    topArtistsHint,
  } = useSpotifyFeed();

  return (
    <motion.section
      className="home-spotify relative mt-10"
      aria-label="Spotify activity"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <AmbientParticles />

      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">
          Spotify activity
        </p>
        <h2 className="font-display text-2xl font-bold text-[#eaeaea] md:text-3xl">
          Live music dashboard
        </h2>
      </motion.div>

      {warning && !error && (
        <motion.p
          className="relative mb-4 rounded-xl border border-tech/25 bg-tech/5 px-4 py-3 text-sm text-tech-light/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {warning}
        </motion.p>
      )}

      {error && (
        <motion.p
          className="relative mb-4 rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-300/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {loading && !error ? (
        <SpotifySkeleton />
      ) : (
        <div className="relative grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CurrentlyPlayingCard
              loading={loading}
              isPlaying={currentlyPlaying.isPlaying}
              track={currentlyPlaying.track}
              progressMs={currentlyPlaying.progressMs}
              durationMs={currentlyPlaying.durationMs}
            />
            <TopArtistsCard
              loading={loading}
              artists={topArtists}
              hint={topArtistsHint}
            />
          </motion.div>

          <RecentTracksCard
            loading={loading}
            tracks={recentTracks}
            emptyMessage={
              warning?.includes('rate-limit')
                ? 'Recently played is temporarily unavailable.'
                : 'No recent tracks yet — play something on Spotify.'
            }
          />
        </div>
      )}
    </motion.section>
  );
};

export default SpotifySection;
