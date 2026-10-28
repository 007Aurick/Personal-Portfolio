import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import {
  SITE_ABOUT,
  SITE_EMAIL,
  SITE_PROJECTS,
  SITE_SOCIAL,
  SITE_WORK,
} from '../../data/siteContent';
import { buildYouTubeEmbedUrl } from '../../utils/youtube';
import './HomePage.css';

const CALLOUT = "that's me lol";

const WORK_MONTHS = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

function timelineDate(value) {
  const formatPart = (part) => {
    if (/present/i.test(part)) return 'present';
    const [month, year] = part.trim().split(' ');
    return `${year}.${WORK_MONTHS[month] || month}`;
  };
  const [start, end] = value.split('—');
  return `${formatPart(start)} – ${formatPart(end || '')}`;
}

const HERO_PHOTOS = [
  {
    src: '/hero.jpg',
    alt: 'Aurick Anwar at Hack the North',
    position: '70% 42%',
  },
  {
    src: '/SF.jpg',
    alt: 'Aurick Anwar at the Golden Gate Bridge',
    position: 'center 40%',
  },
];

function HeroFrame() {
  const [index, setIndex] = useState(0);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_PHOTOS.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="home-photo-frame">
      <div className="home-photo-mat">
        <div className="home-photo-stage">
          {HERO_PHOTOS.map((photo, photoIndex) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className={`home-photo${photoIndex === index ? ' is-active' : ''}`}
              style={{ objectPosition: photo.position }}
            />
          ))}
          <div className={`home-callout-slot${index === 0 ? ' is-on' : ''}`}>
            <AboutCallout />
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutCallout() {
  const [text, setText] = useState('');
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) {
      setText(CALLOUT);
      return undefined;
    }
    let i = 0;
    let id;
    const tick = () => {
      i += 1;
      setText(CALLOUT.slice(0, i));
      if (i < CALLOUT.length) id = window.setTimeout(tick, 55);
    };
    id = window.setTimeout(tick, 400);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  return (
    <div className="home-callout" aria-hidden="true">
      <span className="home-callout-text">
        {text}
        <span
          className={`home-callout-caret${
            text.length >= CALLOUT.length ? ' is-done' : ''
          }`}
        />
      </span>
      <svg
        className="home-callout-arrow"
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="home-me-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0 0 L7 3.5 L0 7 Z" fill="#fff" />
          </marker>
        </defs>
        <path
          d="M70 6 C 78 28, 62 52, 28 78"
          stroke="#fff"
          strokeWidth="2.75"
          strokeLinecap="round"
          markerEnd="url(#home-me-arrow)"
        />
      </svg>
    </div>
  );
}

function ProjectItem({ project }) {
  const [open, setOpen] = useState(false);
  const embed =
    open && project.youtubeId
      ? buildYouTubeEmbedUrl(project.youtubeId, {
          autoplay: true,
          mute: true,
          controls: true,
        })
      : null;

  return (
    <div className={`home-project${open ? ' is-open' : ''}`}>
      <div className="home-project-row">
        <Link to={`/projects/${project.slug}`} className="home-project-thumb">
          <img
            src={project.image}
            alt=""
            loading="lazy"
            style={
              project.imageObjectPosition
                ? { objectPosition: project.imageObjectPosition }
                : undefined
            }
          />
        </Link>

        <div className="home-project-main">
          <Link to={`/projects/${project.slug}`} className="home-project-title">
            {project.title}
          </Link>
          <p className="home-project-line">{project.line}</p>
        </div>

        <div className="home-project-actions">
          <button
            type="button"
            className="home-project-chevron"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse project' : 'Expand project'}
          >
            {open ? '−' : '+'}
          </button>
          {project.github && (
            <a
              className="home-project-gh-icon"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
            >
              <img src="/Github.png" alt="" />
            </a>
          )}
        </div>
      </div>

      {open && (
        <div className="home-project-panel">
          {embed && (
            <div className="home-project-video">
              <iframe
                src={embed}
                title={`${project.title} demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="home-project-writeup">
            {project.writeup.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          {project.stack?.length > 0 && (
            <div className="home-project-stack-row">
              <span className="home-project-stack-label">Tech stack:</span>
              <ul className="home-project-stack" aria-label="Tech stack">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          )}
          <Link to={`/projects/${project.slug}`} className="home-project-more">
            Full write-up →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = 'Aurick Anwar';
  }, []);

  return (
    <SiteLayout>
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-hero-top">
            <h1 className="home-name">{SITE_ABOUT.name}</h1>
            <p className="home-school">
              <a href={SITE_ABOUT.schoolHref} target="_blank" rel="noopener noreferrer">
                {SITE_ABOUT.school}
              </a>
            </p>
          </div>

          <div className="home-hero-mid">
            <div className="home-contacts">
              <a href={`mailto:${SITE_EMAIL}`} className="home-contact">
                <span aria-hidden="true">✉️</span>
                {SITE_EMAIL}
              </a>
              <span className="home-contact-sep" aria-hidden="true" />
              <span className="home-contact home-contact--static">
                <span aria-hidden="true">📍</span>
                {SITE_ABOUT.location}
              </span>
              <span className="home-contact-sep" aria-hidden="true" />
              <span className="home-contact-socials">
                {SITE_SOCIAL.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`home-social home-social--${item.label.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <img src={item.icon} alt="" />
                  </a>
                ))}
              </span>
            </div>
            <p className="home-blurb">{SITE_ABOUT.blurb}</p>
            <div className="home-currently">
              <p className="home-currently-label">Currently:</p>
              <ul className="home-about-bullets">
                {SITE_ABOUT.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="home-currently home-previously">
              <p className="home-currently-label">Previously:</p>
              <ul className="home-about-bullets">
                {SITE_ABOUT.previously.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <HeroFrame />
      </section>

      <div className="home-bottom">
        <section className="home-card home-card--work" aria-labelledby="work-heading">
          <h2 id="work-heading" className="home-card-title">
            <svg className="home-card-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 13a18.2 18.2 0 0 1-20 0"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"
              />
            </svg>
            Work Experience
          </h2>
          <div className="home-work-list">
            {SITE_WORK.map((entry) => (
              <a
                key={entry.id}
                href={entry.url}
                className="home-work-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="home-work-dates">{timelineDate(entry.datesCompact)}</span>
                <span className="home-work-row">
                  <span
                    className={`home-work-logo${
                      entry.logoTheme === 'light' ? ' home-work-logo--light' : ''
                    }`}
                  >
                    <img
                      src={entry.logo}
                      alt=""
                      style={{
                        objectFit: entry.logoFit === 'contain' ? 'contain' : 'cover',
                        transform: entry.logoScale ? `scale(${entry.logoScale})` : undefined,
                      }}
                    />
                  </span>
                  <span className="home-work-role">
                    {entry.role}
                    <span className="home-work-at"> @ </span>
                    <span className="home-work-company">{entry.company}</span>
                  </span>
                </span>
                <span className="home-work-location">{entry.location}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="home-card" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="home-card-title">
            <svg className="home-card-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18 16 4-4-4-4"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 8-4 4 4 4"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.5 4-5 16"
              />
            </svg>
            Featured Projects
          </h2>
          <div className="home-project-list">
            {SITE_PROJECTS.map((project) => (
              <ProjectItem key={project.slug} project={project} />
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
