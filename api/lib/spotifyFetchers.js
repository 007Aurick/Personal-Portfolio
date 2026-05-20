const { spotifyGet } = require('./spotify');
const {
  readFeedSnapshot,
  writeFeedSnapshot,
  readTopSnapshot,
  writeTopSnapshot,
  readCpSnapshot,
  writeCpSnapshot,
} = require('./feedCache');
const {
  isBlocked,
  blockMsRemaining,
  applyRateLimitFromResponse,
} = require('./rateLimit');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EMPTY_CP = {
  is_playing: false,
  item: null,
  progress_ms: 0,
  duration_ms: 0,
};

async function fetchCurrentlyPlaying(token) {
  const res = await spotifyGet('/me/player/currently-playing', token);

  if (res.status === 429) {
    applyRateLimitFromResponse(res);
    const err = new Error('Currently playing rate limited');
    err.status = 429;
    throw err;
  }

  if (res.status === 204) return { ...EMPTY_CP };

  if (!res.ok) {
    const t = await res.text();
    const err = new Error(`Currently playing upstream ${res.status}`);
    err.status = 502;
    err.detail = t.slice(0, 300);
    throw err;
  }

  const data = await res.json();
  const item = data.item || null;
  return {
    is_playing: Boolean(data.is_playing && item),
    item,
    progress_ms: data.progress_ms ?? 0,
    duration_ms: item?.duration_ms ?? 0,
  };
}

async function fetchRecentTracks(token) {
  const res = await spotifyGet('/me/player/recently-played?limit=10', token);

  if (res.status === 429) {
    applyRateLimitFromResponse(res);
    const err = new Error('Recently played rate limited');
    err.status = 429;
    throw err;
  }

  if (!res.ok) {
    const t = await res.text();
    const err = new Error(`Recently played upstream ${res.status}`);
    err.status = res.status === 401 ? 401 : 502;
    err.detail = t.slice(0, 300);
    throw err;
  }

  const data = await res.json();
  return { items: data.items || [] };
}

/** Spotify short_term ≈ last 4 weeks (closest to “last month”). Includes artist images. */
async function fetchTopArtistsMonth(token) {
  const res = await spotifyGet(
    '/me/top/artists?time_range=short_term&limit=5',
    token,
  );

  if (res.status === 429) {
    applyRateLimitFromResponse(res);
    const err = new Error('Top artists rate limited');
    err.status = 429;
    throw err;
  }

  if (res.status === 401 || res.status === 403) {
    return { items: [], _topError: res.status };
  }

  if (!res.ok) {
    const t = await res.text();
    const err = new Error(`Top artists upstream ${res.status}`);
    err.status = 502;
    err.detail = t.slice(0, 300);
    throw err;
  }

  const data = await res.json();
  return { items: data.items || [] };
}

function blockedPayload(snapshot) {
  const mins = Math.ceil(blockMsRemaining() / 60_000);
  const warning =
    mins > 1
      ? `Spotify API cooldown (~${mins} min). Showing last loaded data.`
      : 'Spotify API cooldown. Showing last loaded data.';

  if (snapshot.stale && snapshot.payload) {
    return { ...snapshot.payload, warnings: [warning] };
  }

  return {
    currentlyPlaying: { ...EMPTY_CP },
    recent: { items: [] },
    top: { items: [] },
    warnings: [warning],
  };
}

function resolveTop(snapshot, topSnap) {
  if (topSnap.fresh && topSnap.top) return topSnap.top;
  if (snapshot.payload?.top?.items?.length) return snapshot.payload.top;
  return { items: [] };
}

/**
 * Live: currently-playing + recently-played (~every 45s).
 * Top artists: real Spotify top (short_term) cached ~12h.
 */
async function refreshCurrentlyPlaying(token, snapshot, warnings) {
  const cpSnap = readCpSnapshot();
  if (cpSnap.fresh) return cpSnap.cp;

  try {
    const cp = await fetchCurrentlyPlaying(token);
    writeCpSnapshot(cp);
    return cp;
  } catch (e) {
    if (e.status === 429) throw e;
    warnings.push(e.message || 'Currently playing unavailable');
    return cpSnap.cp || snapshot.payload?.currentlyPlaying || { ...EMPTY_CP };
  }
}

async function fetchAll(token) {
  const snapshot = readFeedSnapshot();
  const topSnap = readTopSnapshot();
  const warnings = [];

  if (isBlocked()) {
    return blockedPayload(snapshot);
  }

  let currentlyPlaying;
  try {
    currentlyPlaying = await refreshCurrentlyPlaying(token, snapshot, warnings);
  } catch (e) {
    if (e.status === 429) return blockedPayload(snapshot);
    currentlyPlaying = { ...EMPTY_CP };
  }

  if (snapshot.fresh) {
    return {
      ...snapshot.payload,
      currentlyPlaying,
      top: resolveTop(snapshot, topSnap),
      warnings,
    };
  }

  let recent = snapshot.payload?.recent || { items: [] };
  let top = resolveTop(snapshot, topSnap);

  await sleep(300);

  if (!isBlocked()) {
    try {
      recent = await fetchRecentTracks(token);
    } catch (e) {
      if (e.status === 429) {
        return {
          ...blockedPayload(snapshot),
          currentlyPlaying,
        };
      }
      warnings.push(e.message || 'Recently played unavailable');
      if (snapshot.stale && snapshot.payload?.recent) {
        recent = snapshot.payload.recent;
      }
    }
  }

  if (!topSnap.fresh && !isBlocked()) {
    await sleep(300);
    try {
      top = await fetchTopArtistsMonth(token);
      if ((top.items || []).length > 0 || top._topError) {
        writeTopSnapshot(top);
      }
    } catch (e) {
      if (e.status !== 429) {
        warnings.push(e.message || 'Top artists unavailable');
      }
      top = resolveTop(snapshot, topSnap);
    }
  }

  const payload = {
    currentlyPlaying,
    recent,
    top,
    warnings,
  };

  writeFeedSnapshot(payload);
  return payload;
}

module.exports = {
  fetchAll,
  fetchCurrentlyPlaying,
  fetchRecentTracks,
  fetchTopArtistsMonth,
};
