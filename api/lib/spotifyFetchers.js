const { spotifyGetCached } = require('./spotify');

async function fetchCurrentlyPlaying(token) {
  return spotifyGetCached('/me/player/currently-playing', token, {
    key: 'current-playing',
    freshMs: 25_000,
    staleMs: 120_000,
    transform: async (res) => {
      if (res.status === 204) {
        return { is_playing: false, item: null, progress_ms: 0, duration_ms: 0 };
      }
      if (res.status === 401) {
        const err = new Error('Spotify unauthorized — check refresh token and app settings.');
        err.status = 401;
        throw err;
      }
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
    },
  });
}

async function fetchRecentTracks(token) {
  return spotifyGetCached('/me/player/recently-played?limit=10', token, {
    key: 'recent-tracks',
    freshMs: 90_000,
    staleMs: 600_000,
    transform: async (res) => {
      if (!res.ok) {
        const t = await res.text();
        const err = new Error(`Recently played upstream ${res.status}`);
        err.status = res.status === 401 ? 401 : 502;
        err.detail = t.slice(0, 300);
        throw err;
      }
      const data = await res.json();
      return { items: data.items || [] };
    },
  });
}

async function fetchTopArtists(token) {
  return spotifyGetCached('/me/top/artists?time_range=short_term&limit=5', token, {
    key: 'top-artists',
    freshMs: 300_000,
    staleMs: 900_000,
    transform: async (res) => {
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
    },
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAll(token) {
  const out = {
    currentlyPlaying: null,
    recent: null,
    top: null,
    warnings: [],
  };

  try {
    out.currentlyPlaying = await fetchCurrentlyPlaying(token);
  } catch (e) {
    out.currentlyPlaying = {
      is_playing: false,
      item: null,
      progress_ms: 0,
      duration_ms: 0,
    };
    out.warnings.push(e.message || 'Currently playing unavailable');
  }

  await sleep(200);

  try {
    out.recent = await fetchRecentTracks(token);
  } catch (e) {
    out.recent = { items: [] };
    out.warnings.push(e.message || 'Recently played unavailable');
  }

  await sleep(200);

  try {
    out.top = await fetchTopArtists(token);
  } catch (e) {
    out.top = { items: [] };
    out.warnings.push(e.message || 'Top artists unavailable');
  }

  return out;
}

module.exports = {
  fetchCurrentlyPlaying,
  fetchRecentTracks,
  fetchTopArtists,
  fetchAll,
};
