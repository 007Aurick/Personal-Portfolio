import React from 'react';

const BASE = 'https://mcmaster-webring.vercel.app';
const USER_ID = 'aurick-anwar';
const SIZE = 36;

function go(dir) {
  return `${BASE}/go?from=${encodeURIComponent(USER_ID)}&to=${dir}`;
}

export default function WebringEmbed() {
  return (
    <nav className="site-webring" aria-label="McMaster webring">
      <a
        className="site-webring-link"
        href={go('prev')}
        title="Previous site in the McMaster webring"
        aria-label="Previous site in the McMaster webring"
      >
        ←
      </a>
      <a
        className="site-webring-home"
        href={`${BASE}/?ref=${encodeURIComponent(USER_ID)}`}
        title="McMaster Webring"
        aria-label="McMaster Webring"
      >
        <img
          src="/webring-flame.png"
          alt=""
          width={SIZE}
          height={SIZE}
        />
      </a>
      <a
        className="site-webring-link"
        href={go('next')}
        title="Next site in the McMaster webring"
        aria-label="Next site in the McMaster webring"
      >
        →
      </a>
    </nav>
  );
}
