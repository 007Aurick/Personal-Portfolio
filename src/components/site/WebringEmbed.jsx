import React from 'react';

const WEBRING_URL = 'https://mac-csse-webring.vercel.app/';
const MY_SITE = 'aurickanwar.com';

export default function WebringEmbed() {
  return (
    <nav className="site-webring" aria-label="McMaster CS & SE webring">
      <a
        className="site-webring-link"
        href={`${WEBRING_URL}#${MY_SITE}?nav=prev`}
        title="Previous site in the McMaster CS & SE webring"
        aria-label="Previous site in the McMaster CS & SE webring"
      >
        ←
      </a>
      <a
        className="site-webring-home"
        href={WEBRING_URL}
        title="McMaster CS & SE Webring"
        aria-label="McMaster CS & SE Webring"
      >
        <img
          src={`${WEBRING_URL}assets/Uni_mcmaster_logo.svg.png`}
          alt=""
          height={28}
        />
      </a>
      <a
        className="site-webring-link"
        href={`${WEBRING_URL}#${MY_SITE}?nav=next`}
        title="Next site in the McMaster CS & SE webring"
        aria-label="Next site in the McMaster CS & SE webring"
      >
        →
      </a>
    </nav>
  );
}
