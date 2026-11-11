import React from 'react';
import { NavLink } from 'react-router-dom';
import { RESUME_PDF } from '../../data/siteContent';
import ThemeSwitch from './ThemeSwitch';
import WebringEmbed from './WebringEmbed';
import './SiteLayout.css';

export default function SiteLayout({ children }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <WebringEmbed />
        <nav className="site-nav" aria-label="Primary">
          <ThemeSwitch />
          <NavLink
            to="/projects"
            end
            className={({ isActive }) =>
              `site-nav-link${isActive ? ' is-active' : ''}`
            }
          >
            Projects
          </NavLink>
          <a
            href={RESUME_PDF}
            className="site-nav-link site-nav-link--accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
            <span className="site-resume-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </nav>
      </header>
      <main className="site-main">{children}</main>
    </div>
  );
}
