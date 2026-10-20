import React, { useEffect, useRef, useState } from 'react';
import {
  SIGNATURE_LETTERS,
  SIGNATURE_PEN,
  SIGNATURE_VIEWBOX,
  SIGNATURE_WORD_BREAK,
} from './signaturePath';
import './SignatureIntro.css';

const LETTER_MS = 680;
const STAGGER_MS = 360;
const WORD_GAP_MS = 460;
const FADE_MS = 560;

export function shouldPlaySignatureIntro() {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function SignatureIntro({ onDone }) {
  const refs = useRef([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.classList.add('sig-lock');
    const nodes = refs.current.filter(Boolean);
    let cursor = 0;
    nodes.forEach((el, i) => {
      if (i === SIGNATURE_WORD_BREAK) cursor += WORD_GAP_MS;
      el.style.animationDuration = `${LETTER_MS}ms`;
      el.style.animationDelay = `${cursor}ms`;
      cursor += STAGGER_MS;
    });
    const total = Math.max(0, cursor - STAGGER_MS) + LETTER_MS;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        nodes.forEach((el) => el.classList.add('is-drawing'));
      });
    });

    const fadeTimer = window.setTimeout(() => setDone(true), total + 120);
    const doneTimer = window.setTimeout(onDone, total + 120 + FADE_MS);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove('sig-lock');
    };
  }, [onDone]);

  return (
    <div className={`sig-intro${done ? ' is-done' : ''}`} aria-hidden="true">
      <svg className="sig-intro-svg" viewBox={SIGNATURE_VIEWBOX}>
        {SIGNATURE_LETTERS.map((d, i) => (
          <path
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={SIGNATURE_PEN.includes(i) ? 'sig-letter sig-letter--pen' : 'sig-letter'}
            d={d}
          />
        ))}
      </svg>
    </div>
  );
}
