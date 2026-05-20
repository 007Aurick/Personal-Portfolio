import { useCallback, useEffect, useRef, useState } from 'react';
import {
  normalizeCurrentlyPlaying,
  normalizeRecentPlayItem,
  normalizeTopArtist,
} from '../utils/spotifyNormalize';

const POLL_MS_VISIBLE = 35_000;
const POLL_MS_HIDDEN = 120_000;
const LOCAL_CACHE_KEY = 'spotify-feed-cache-v2';
const LOCAL_CACHE_MS = 30 * 60_000;

function readLocalFeedCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || Date.now() - parsed.at > LOCAL_CACHE_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeLocalFeedCache(data) {
  try {
    if ((data.recent?.items?.length ?? 0) > 0 || (data.top?.items?.length ?? 0) > 0) {
      localStorage.setItem(
        LOCAL_CACHE_KEY,
        JSON.stringify({ at: Date.now(), data }),
      );
    }
  } catch {
    /* ignore */
  }
}

function mergeWithLocalCache(feed) {
  const local = readLocalFeedCache();
  if (!local) return feed;

  const emptyRecent = (feed.recent?.items?.length ?? 0) === 0;
  const emptyTop = (feed.top?.items?.length ?? 0) === 0;
  const needsFallback = emptyRecent || emptyTop;

  if (!needsFallback) return feed;

  return {
    ...feed,
    recent: emptyRecent && local.recent?.items?.length ? local.recent : feed.recent,
    top: emptyTop && local.top?.items?.length ? local.top : feed.top,
    currentlyPlaying:
      !feed.currentlyPlaying?.isPlaying && local.currentlyPlaying?.isPlaying
        ? local.currentlyPlaying
        : feed.currentlyPlaying,
    warnings:
      feed.warnings?.length > 0
        ? feed.warnings
        : needsFallback
          ? ['Showing your last saved Spotify data.']
          : [],
  };
}

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

function friendlyFetchError(err) {
  const msg = err?.message || '';
  if (msg === 'Failed to fetch' || err?.name === 'TypeError') {
    return (
      'Spotify API not reachable. From the project folder run: npm run dev — ' +
      'then open http://localhost:3000/api/spotify/feed (should show JSON). ' +
      'Do not use npm start alone.'
    );
  }
  return msg || 'Could not load Spotify activity';
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

  const applyFeed = useCallback((feed) => {
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

    const hasData =
      (feed.recent?.items?.length ?? 0) > 0 || (feed.top?.items?.length ?? 0) > 0;
    const warnings = feed.warnings || [];

    if (warnings.length > 0 && hasData) {
      setWarning(warnings.join(' · '));
      setError(null);
    } else if (warnings.length > 0) {
      setWarning(warnings.join(' · '));
      setError(null);
    } else {
      setWarning(null);
      setError(null);
    }

    return hasData;
  }, []);

  const load = useCallback(async () => {
    try {
      const feed = mergeWithLocalCache(await fetchJson('/api/spotify/feed'));
      writeLocalFeedCache(feed);
      applyFeed(feed);
      fetchedAtRef.current = Date.now();
    } catch (e) {
      const cached = readLocalFeedCache();
      if (cached) {
        applyFeed(cached);
        setWarning(
          'Live refresh failed — showing saved data. Keep `npm run dev` running for updates.',
        );
        setError(null);
      } else {
        setError(friendlyFetchError(e));
        setWarning(null);
      }
    } finally {
      setLoading(false);
    }
  }, [applyFeed]);

  useEffect(() => {
    const cached = readLocalFeedCache();
    if (cached) {
      applyFeed(cached);
      setLoading(false);
    }
    load();
  }, [load, applyFeed]);

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

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
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
