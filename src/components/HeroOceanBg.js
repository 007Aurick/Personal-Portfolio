import React, { useMemo } from 'react';
import './HeroOceanBg.css';

const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const MICRO_DOT_COLS = 14;
const MICRO_DOT_ROWS = 10;
const NODE_COUNT = 24;
const NEAREST_NEIGHBORS = 3;
const LINE_ANIMATION_DURATION = 8;

const HeroOceanBg = () => {
  const { microDots, nodes, connections } = useMemo(() => {
    const microDots = [];
    for (let row = 0; row < MICRO_DOT_ROWS; row++) {
      for (let col = 0; col < MICRO_DOT_COLS; col++) {
        const baseX = (col / (MICRO_DOT_COLS - 1)) * 100;
        const baseY = (row / (MICRO_DOT_ROWS - 1)) * 100;
        const waveX = Math.sin(row * 0.4) * 1.5 + Math.cos(col * 0.3) * 1;
        const waveY = Math.cos(col * 0.35) * 1.5 + Math.sin(row * 0.45) * 1;
        microDots.push({
          id: `${row}-${col}`,
          x: baseX + waveX + (seededRandom(row * 7 + col) - 0.5) * 2,
          y: baseY + waveY + (seededRandom(col * 11 + row) - 0.5) * 2,
        });
      }
    }

    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        id: i,
        x: 5 + seededRandom(i * 7) * 90,
        y: 5 + seededRandom(i * 13 + 1) * 90,
        delay: seededRandom(i * 11) * (LINE_ANIMATION_DURATION - 2),
        duration: 2.5 + seededRandom(i * 17) * 2,
        variant: Math.floor(seededRandom(i * 19) * 3),
      });
    }

    const connections = [];
    const connectionSet = new Set();
    for (let i = 0; i < nodes.length; i++) {
      const distances = nodes
        .map((n, j) => (i === j ? { j, d: Infinity } : {
          j,
          d: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y),
        }))
        .sort((a, b) => a.d - b.d);
      for (let k = 0; k < NEAREST_NEIGHBORS && k < distances.length; k++) {
        const j = distances[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!connectionSet.has(key)) {
          connectionSet.add(key);
          const from = nodes[i];
          const to = nodes[j];
          connections.push({
            from,
            to,
            delay: (from.delay + to.delay) / 2,
            duration: LINE_ANIMATION_DURATION,
          });
        }
      }
    }

    return { microDots, nodes, connections };
  }, []);

  return (
    <div className="hero-ocean-bg" aria-hidden="true">
      <svg
        className="hero-network-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="hero-micro-dots">
          {microDots.map((d) => (
            <circle
              key={d.id}
              cx={d.x}
              cy={d.y}
              r={0.2}
              className="hero-micro-dot"
            />
          ))}
        </g>
        <g className="hero-connections">
          {connections.map(({ from, to, delay, duration }, idx) => (
            <line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="hero-line"
              pathLength="100"
              style={{
                animationDelay: `${delay}s`,
                animationDuration: `${LINE_ANIMATION_DURATION}s`,
              }}
            />
          ))}
        </g>
        <g className="hero-nodes">
          {nodes.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={0.35}
              className={`hero-node hero-node--v${node.variant}`}
              style={{
                animationDelay: `${node.delay}s`,
                animationDuration: `${node.duration}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default HeroOceanBg;
