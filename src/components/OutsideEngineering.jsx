import React from 'react';
import { motion } from 'framer-motion';
import PageFade from './layout/PageFade';
import {
  friends,
  vacationSlides,
  PLAYOFF_SCORING_NOTE,
  ufcPredictions,
  nbaWesternPlayoffs,
  nbaEasternPlayoffs,
  nbaFinalsBracket,
  tallyNbaPlayoffsFromBracket,
} from '../data/lifeContent';
import './OutsideEngineering.css';

const POLAROID_TILTS = [-2.4, 1.8, -2.1, 2.5, -1.6, 2.2];

const PARTICLES = [
  { left: '6%', top: '18%', delay: 0 },
  { left: '14%', top: '72%', delay: 1.2 },
  { left: '22%', top: '38%', delay: 2.1 },
  { left: '78%', top: '22%', delay: 0.6 },
  { left: '88%', top: '55%', delay: 1.8 },
  { left: '52%', top: '12%', delay: 2.8 },
  { left: '68%', top: '78%', delay: 0.3 },
  { left: '34%', top: '62%', delay: 1.5 },
  { left: '92%', top: '88%', delay: 2.4 },
  { left: '10%', top: '48%', delay: 3.1 },
  { left: '44%', top: '28%', delay: 0.9 },
  { left: '58%', top: '44%', delay: 2.2 },
];

const sectionReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const masonryParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const masonryChild = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function bracketOutcomeLabel(outcome) {
  switch (outcome) {
    case 'exact':
      return 'Exact (+2)';
    case 'winner':
      return 'Winner OK (+1)';
    case 'wrong':
      return 'Miss (+1 L)';
    case 'pending':
      return 'Pending';
    default:
      return '';
  }
}

function BracketSeriesCard({ series }) {
  return (
    <article className={`life-bracket-card life-bracket-card--${series.outcome}`}>
      <span className="life-bracket-status">{bracketOutcomeLabel(series.outcome)}</span>
      <p className="life-bracket-matchup">{series.matchup}</p>
      <p className="life-bracket-pred">
        <span className="life-bracket-k">Pick</span> {series.prediction}
      </p>
      {series.actual ? (
        <p className="life-bracket-actual">
          <span className="life-bracket-k">Result</span> {series.actual}
        </p>
      ) : null}
      {series.note ? <p className="life-bracket-note">{series.note}</p> : null}
    </article>
  );
}

function PlayoffConferenceBlock({ data }) {
  return (
    <div className="life-bracket-conf">
      <h3 className="life-bracket-conf-title">{data.conference} Conference</h3>
      {data.rounds.map((round) => (
        <div key={round.label} className="life-bracket-round">
          <h4 className="life-bracket-round-title">{round.label}</h4>
          <div className="life-bracket-round-grid">
            {round.series.map((s) => (
              <BracketSeriesCard key={s.id} series={s} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OutsideEngineering() {
  const playoffTally = tallyNbaPlayoffsFromBracket();
  const { wins: playoffWins, losses: playoffLosses, pending: playoffPending } = playoffTally;
  const settledDenom = playoffWins + playoffLosses;
  const accuracyPct = settledDenom ? Math.round((playoffWins / settledDenom) * 100) : 0;

  return (
    <PageFade>
      <div className="life-page">
        <div className="life-grain" aria-hidden />
        <div className="life-glow life-glow--a" aria-hidden />
        <div className="life-glow life-glow--b" aria-hidden />

        <div className="life-particles" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="life-particle"
              style={{ left: p.left, top: p.top, animationDelay: `${p.delay}s` }}
            />
          ))}
        </div>

        <header className="life-hero">
          <div className="container">
          <motion.p
            className="life-hero-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Just proof I exist:
          </motion.p>
          <motion.h1
            className="life-hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
          >
            Outside of Engineering
          </motion.h1>
          <motion.p
            className="life-hero-lede"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            No GitHub commits, no LinkedIn flexing, no “building in public.” Just figuring out life and
            living more in the moment.
          </motion.p>
          </div>
        </header>

        {/* ——— Friends ——— */}
        <motion.section
          className="life-section"
          id="friends"
          aria-labelledby="life-friends-heading"
          {...sectionReveal}
        >
          <div className="container">
            <div className="life-section-head">
              <h2 id="life-friends-heading" className="life-section-title">
                Friends
              </h2>
            </div>

            <motion.div
              className="life-friends-masonry"
              variants={masonryParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
            >
            {friends.map((f, i) => (
              <motion.article
                key={f.id}
                className="life-polaroid"
                style={{ '--tilt': `${POLAROID_TILTS[i % POLAROID_TILTS.length]}deg` }}
                variants={masonryChild}
              >
                <div className="life-polaroid-inner">
                  <div
                    className="life-polaroid-photo"
                    style={
                      f.aspectRatio
                        ? { aspectRatio: f.aspectRatio.replace(':', ' / ') }
                        : undefined
                    }
                  >
                    <img
                      src={f.image}
                      alt={f.caption ? `${f.location} — ${f.caption}` : f.location}
                      loading="lazy"
                      style={f.objectPosition ? { objectPosition: f.objectPosition } : undefined}
                    />
                  </div>
                  <div className="life-polaroid-meta">
                    <p className="life-polaroid-loc">
                      <span aria-hidden>📍</span> {f.location}
                    </p>
                    <p className="life-polaroid-date">{f.date}</p>
                    {f.caption ? <p className="life-polaroid-caption">“{f.caption}”</p> : null}
                  </div>
                </div>
              </motion.article>
            ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ——— Vacations ——— */}
        <motion.section
          className="life-section life-section--vacations"
          id="vacations"
          aria-labelledby="life-vacations-heading"
          {...sectionReveal}
        >
          <div className="container">
            <div className="life-section-head">
              <h2 id="life-vacations-heading" className="life-section-title">
                Vacations
              </h2>
              
            </div>

            <div className="life-vacation-shell">
              <div className="life-vacation-fade life-vacation-fade--left" aria-hidden />
              <div className="life-vacation-fade life-vacation-fade--right" aria-hidden />
              <div className="life-vacation-track">
                {vacationSlides.map((v) => (
                  <article key={v.id} className="life-vacation-card">
                    <div className="life-vacation-visual">
                      <img src={v.image} alt="" loading="lazy" />
                      <div className="life-vacation-overlay" />
                      <div className="life-vacation-glass">
                        {v.sectionLabel ? (
                          <span className="life-vacation-chip">{v.sectionLabel}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="life-vacation-body">
                      <p className="life-vacation-loc">
                        <span aria-hidden>📍</span> {v.location}
                      </p>
                      <p className="life-vacation-date">{v.date}</p>
                      {v.note ? <p className="life-vacation-note">“{v.note}”</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ——— Sports ——— */}
        <motion.section
          className="life-section"
          id="sports"
          aria-labelledby="life-sports-heading"
          {...sectionReveal}
        >
          <div className="container">
            <div className="life-section-head">
              <h2 id="life-sports-heading" className="life-section-title">
                Sports predictions
              </h2>
              
            </div>

            <div className="life-sports-dashboard">
              <div className="life-sports-accuracy">
              <div className="life-sports-accuracy-head">
                <span className="life-sports-accuracy-label">NBA playoff tracker</span>
                <span className="life-sports-accuracy-pct">{accuracyPct}%</span>
              </div>
              <p className="life-sports-accuracy-note">{PLAYOFF_SCORING_NOTE}</p>
              <div
                className="life-sports-accuracy-bar"
                role="img"
                aria-label={`Playoff points rate about ${accuracyPct} percent`}
              >
                <span className="life-sports-accuracy-fill" style={{ width: `${accuracyPct}%` }} />
              </div>
              <ul className="life-sports-accuracy-stats">
                <li>
                  <span className="life-sports-stat-val life-sports-stat-val--w">{playoffWins}</span>
                  <span className="life-sports-stat-key">Points (+2 / +1)</span>
                </li>
                <li>
                  <span className="life-sports-stat-val life-sports-stat-val--l">{playoffLosses}</span>
                  <span className="life-sports-stat-key">Losses</span>
                </li>
                <li>
                  <span className="life-sports-stat-val">{playoffPending}</span>
                  <span className="life-sports-stat-key">Pending</span>
                </li>
              </ul>
            </div>

            <article className="life-sports-card life-ufc-wide">
              <h3 className="life-ufc-wide-title">UFC</h3>
              <div className="life-ufc-wide-grid">
                {ufcPredictions.map((c, idx) => (
                  <div key={c.id} className={`life-ufc-wide-bout ${idx > 0 ? 'life-ufc-wide-bout--split' : ''}`}>
                    <span className="life-sports-card-tag">{c.tag}</span>
                    <p className="life-sports-card-event">{c.event}</p>
                    <p className="life-sports-card-matchup">{c.matchup}</p>
                    <p className="life-sports-card-prediction">
                      <span className="life-sports-card-pred-label">Prediction</span>
                      {c.prediction}
                    </p>
                    <p className="life-sports-card-detail">{c.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <div className="life-nba-bracket">
              <h3 className="life-nba-bracket-main-title">My NBA playoffs prediction bracket</h3>
              <div className="life-nba-bracket-grid">
                <PlayoffConferenceBlock data={nbaWesternPlayoffs} />
                <PlayoffConferenceBlock data={nbaEasternPlayoffs} />
              </div>
              <div className="life-nba-finals-wrap">
                <h4 className="life-bracket-round-title">{nbaFinalsBracket.label}</h4>
                <div className="life-bracket-round-grid life-bracket-round-grid--finals">
                  {nbaFinalsBracket.series.map((s) => (
                    <BracketSeriesCard key={s.id} series={s} />
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        </motion.section>
      </div>
    </PageFade>
  );
}

export default OutsideEngineering;
