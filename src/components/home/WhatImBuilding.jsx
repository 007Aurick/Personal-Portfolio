import React from 'react';
import { motion } from 'framer-motion';

const builds = [
  {
    id: 'b1',
    eyebrow: 'Hardware startup',
    title: 'Helmet impact monitoring',
    body:
      'Magnified Systems — turning helmet-mounted sensing into something athletes can actually trust (with receipts).',
    tags: ['IMU', 'ESP32', 'ML'],
    accent: 'from-gold/25 via-transparent to-transparent',
  },
  {
    id: 'b2',
    eyebrow: 'Navigation stack',
    title: 'ROS2 + SLAM rabbit hole',
    body:
      'Learning how robots remember space — transforms, maps, and the eternal joy of “why is my TF tree crying”.',
    tags: ['ROS2', 'SLAM', 'Simulation'],
    accent: 'from-emerald-500/10 via-transparent to-transparent',
  },
  {
    id: 'b3',
    eyebrow: 'Software + models',
    title: 'AI / robotics builds',
    body:
      'Vision pipelines, quick prototypes, and demos that break elegantly until they don’t.',
    tags: ['CV', 'PyTorch', 'Python'],
    accent: 'from-violet-500/10 via-transparent to-transparent',
  },
  {
    id: 'b4',
    eyebrow: 'Mechanical taste',
    title: 'CAD + fabrication',
    body:
      'Printed parts, cable discipline attempts, and learning when “looks fine” is not fine.',
    tags: ['Fusion', 'KiCad', 'Prototypes'],
    accent: 'from-sky-500/10 via-transparent to-transparent',
  },
];

const WhatImBuilding = () => (
  <section className="relative mx-auto max-w-6xl px-6 pb-28">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="mb-12 max-w-2xl"
    >
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">What I&apos;m building</p>
      <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Lab notebook energy</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        No investor deck cosplay — just things I&apos;m actively soldering, training, or googling at 2am.
      </p>
    </motion.div>

    <div className="grid gap-6 md:grid-cols-2">
      {builds.map((item, i) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          whileHover={{ y: -6 }}
          className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-card/80 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08)] backdrop-blur-md transition-shadow duration-300 hover:border-gold/35 hover:shadow-gold-card"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${item.accent}`}
          />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-light">{item.eyebrow}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gold-light"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default WhatImBuilding;
