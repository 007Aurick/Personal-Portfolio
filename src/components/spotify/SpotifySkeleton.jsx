import React from 'react';
import { motion } from 'framer-motion';

const Shimmer = ({ className }) => (
  <motion.div
    className={`rounded-lg bg-gradient-to-r from-white/[0.04] via-gold/10 to-white/[0.04] bg-[length:200%_100%] ${className}`}
    animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
  />
);

export const CurrentlyPlayingSkeleton = () => (
  <motion.div
    className="rounded-2xl border border-gold/20 bg-ink-card/90 p-5 shadow-gold-glow backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <Shimmer className="mb-4 h-3 w-28" />
    <motion.div className="flex flex-row items-center gap-4" initial={{ opacity: 0.6 }} animate={{ opacity: [0.5, 0.85, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }}>
      <Shimmer className="h-24 w-24 shrink-0 rounded-xl" />
      <motion.div className="flex min-w-0 flex-1 flex-col justify-center gap-2 text-left">
        <Shimmer className="h-4 w-3/4 max-w-[200px]" />
        <Shimmer className="h-3 w-1/2 max-w-[140px]" />
        <Shimmer className="mt-3 h-6 w-24" />
        <Shimmer className="mt-4 h-1.5 w-full rounded-full" />
      </motion.div>
    </motion.div>
  </motion.div>
);

export const TopArtistsSkeleton = () => (
  <motion.div
    className="rounded-2xl border border-gold/20 bg-ink-card/90 p-5 shadow-gold-glow backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.05 }}
  >
    <Shimmer className="mb-4 h-3 w-24" />
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div key={i} className="flex items-center gap-3">
          <Shimmer className="h-4 w-4 rounded" />
          <Shimmer className="h-11 w-11 shrink-0 rounded-full" />
          <Shimmer className="h-3 flex-1 max-w-[160px]" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export const RecentTracksSkeleton = () => (
  <motion.div
    className="flex h-full flex-col rounded-2xl border border-gold/20 bg-ink-card/90 p-5 shadow-gold-glow backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.08 }}
  >
    <Shimmer className="mb-4 h-3 w-32" />
    <motion.div className="flex flex-1 flex-col gap-1.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.04] p-2.5">
          <Shimmer className="h-4 w-4" />
          <Shimmer className="h-11 w-11 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3 w-4/5 max-w-[180px]" />
            <Shimmer className="h-2.5 w-1/2 max-w-[120px]" />
          </div>
          <Shimmer className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </motion.div>
  </motion.div>
);

const SpotifySkeleton = () => (
  <motion.div
    className="grid gap-4 lg:grid-cols-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="flex flex-col gap-4">
      <CurrentlyPlayingSkeleton />
      <TopArtistsSkeleton />
    </div>
    <RecentTracksSkeleton />
  </motion.div>
);

export default SpotifySkeleton;
