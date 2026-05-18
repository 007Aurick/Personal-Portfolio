import { useCallback, useEffect, useRef, useState } from 'react';
import {
  normalizeCurrentlyPlaying,
  normalizeRecentPlayItem,
  normalizeTopArtist,
} from '../utils/spotifyNormalize';

const POLL_MS_VISIBLE = 60_000;
const POLL_MS_HIDDEN = 180_000;

function apiBase() {
  return (process.env.REACT_APP_SPOTIFY_API_BASE || '').replace(/\/$/, '');
}

async function fetchJson(path) {
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { credentials: 'same-origin' });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    const isHtml = /^\s*<!doctype/i.test(text) || /^\s*<html/i.test(text);
    const msg = isHtml
      ? 'Spotify API is not reachable — deploy to Vercel with SPOTIFY_* env vars, or run `npx vercel dev` locally.'
      : `Invalid JSON from Spotify API (HTTP ${res.status})`;
    throw Object.assign(new Error(msg), { status: res.status });
  }
  if (!res.ok) {
    const hint = json.hint ? ` ${json.hint}` : '';
    const err = new Error((json.error || `Spotify API failed (${res.status})`) + hint);
    err.status = res.status;
    throw err;
  }
  return json;
}

export function useSpotifyFeed() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState({
    isPlaying: false,
    track: null,
    progressMs: 0,
    durationMs: 0,
  });
  const [recentTracks, setRecentTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topArtistsHint, setTopArtistsHint] = useState(null);
  const fetchedAtRef = useRef(0);

  const load = useCallback(async () => {
    try {
      const feed = await fetchJson('/api/spotify/feed');

      setCurrentlyPlaying(normalizeCurrentlyPlaying(feed.currentlyPlaying));
      setRecentTracks(
        (feed.recent?.items || []).map(normalizeRecentPlayItem).filter(Boolean),
      );

      const top = feed.top || { items: [] };
      if (top._topError === 403) {
        setTopArtists([]);
        setTopArtistsHint(
          'Top artists need the user-top-read scope on your refresh token.',
        );
      } else {
        setTopArtists((top.items || []).map(normalizeTopArtist).filter(Boolean));
        setTopArtistsHint(null);
      }

      const warnings = feed.warnings || [];
      if (warnings.length > 0) {
        const rateLimited = warnings.some((w) => /429|rate limit/i.test(w));
        setWarning(
          rateLimited
            ? 'Spotify is rate-limiting requests — showing what we can. Data should return in a minute.'
            : warnings.join(' · '),
        );
      } else {
        setWarning(null);
      }

      fetchedAtRef.current = Date.now();
      setError(null);
    } catch (e) {
      setError(e.message || 'Could not load Spotify activity');
      setWarning(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const tick = () => {
      load().catch(() => {});
    };

    const pollMs = () => (document.hidden ? POLL_MS_HIDDEN : POLL_MS_VISIBLE);
    let id = window.setInterval(tick, pollMs());

    const onVisibility = () => {
      window.clearInterval(id);
      if (!document.hidden) tick();
      id = window.setInterval(tick, pollMs());
    };

    const onFocus = () => {
      if (!document.hidden) tick();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, [load]);

  return {
    loading,
    error,
    warning,
    currentlyPlaying,
    recentTracks,
    topArtists,
    topArtistsHint,
    fetchedAt: fetchedAtRef.current,
    refresh: load,
  };
}
