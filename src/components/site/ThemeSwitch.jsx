import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'aurick-theme';

function readTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'carbon' ? 'carbon' : 'paper';
  } catch (err) {
    return 'paper';
  }
}

function applyTheme(theme) {
  if (theme === 'carbon') document.documentElement.setAttribute('data-theme', 'carbon');
  else document.documentElement.removeAttribute('data-theme');
}

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(readTheme);
  const dark = theme === 'carbon';

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      /* ignore private browsing */
    }
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      title={dark ? 'Light mode' : 'Dark mode'}
      onClick={() => setTheme(dark ? 'paper' : 'carbon')}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.15" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="4.35" r="1.05" fill="currentColor" />
          <circle cx="17.41" cy="6.59" r="1.05" fill="currentColor" />
          <circle cx="19.65" cy="12" r="1.05" fill="currentColor" />
          <circle cx="17.41" cy="17.41" r="1.05" fill="currentColor" />
          <circle cx="12" cy="19.65" r="1.05" fill="currentColor" />
          <circle cx="6.59" cy="17.41" r="1.05" fill="currentColor" />
          <circle cx="4.35" cy="12" r="1.05" fill="currentColor" />
          <circle cx="6.59" cy="6.59" r="1.05" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
