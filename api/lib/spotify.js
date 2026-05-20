/**
 * Shared Spotify server helpers — refresh token flow, never exposed to the browser.
 * Required: SPOTIFY_REFRESH_TOKEN, SPOTIFY_CLIENT_ID (or REACT_APP_SPOTIFY_CLIENT_ID)
 * Optional: SPOTIFY_CLIENT_SECRET, SPOTIFY_CORS_ORIGINS
 */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';

let cached = { access: null, exp: 0 };

/** Per-endpoint response cache (survives warm serverless invocations). */
const dataCache = new Map();

function cacheRead(key) {
  const entry = dataCache.get(key);
  if (!entry) return { fresh: false, stale: false, data: null };
  const now = Date.now();
  if (now < entry.freshUntil) return { fresh: true, stale: true, data: entry.data };
  if (now < entry.staleUntil) return { fresh: false, stale: true, data: entry.data };
  dataCache.delete(key);
  return { fresh: false, stale: false, data: null };
}

function cacheWrite(key, data, freshMs, staleMs = freshMs * 12) {
  const now = Date.now();
  dataCache.set(key, {
    data,
    freshUntil: now + freshMs,
    staleUntil: now + staleMs,
  });
}

function envTrim(name) {
  return String(process.env[name] || '').trim();
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const extras = (process.env.SPOTIFY_CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowed = new Set([
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    ...extras,
  ]);
  if (origin && allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
}

async function getAccessToken() {
  const now = Date.now();
  if (cached.access && now < cached.exp - 60_000) return cached.access;

  const clientId = envTrim('SPOTIFY_CLIENT_ID') || envTrim('REACT_APP_SPOTIFY_CLIENT_ID');
  let refreshToken = envTrim('SPOTIFY_REFRESH_TOKEN');
  if (
    (refreshToken.startsWith('"') && refreshToken.endsWith('"')) ||
    (refreshToken.startsWith("'") && refreshToken.endsWith("'"))
  ) {
    refreshToken = refreshToken.slice(1, -1).trim();
  }
  const clientSecret = envTrim('SPOTIFY_CLIENT_SECRET');

  if (!clientId || !refreshToken) {
    const missing = [];
    if (!clientId) missing.push('SPOTIFY_CLIENT_ID');
    if (!refreshToken) missing.push('SPOTIFY_REFRESH_TOKEN');
    const err = new Error(`Server misconfigured: missing ${missing.join(', ')}`);
    err.status = 503;
    err.missing = missing;
    err.hint =
      'Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET (if required), and SPOTIFY_REFRESH_TOKEN in Vercel → Environment Variables, then redeploy.';
    throw err;
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });
  if (clientSecret) body.append('client_secret', clientSecret);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Spotify token refresh failed (${res.status})`);
    err.status = 502;
    err.detail = text.slice(0, 400);
    try {
      const j = JSON.parse(text);
      if (j.error === 'invalid_grant') {
        err.hint =
          'Spotify rejected the refresh token. Re-issue SPOTIFY_REFRESH_TOKEN with the same Client ID and scopes (user-read-currently-playing, user-read-recently-played, user-top-read).';
      }
    } catch {
      /* ignore */
    }
    throw err;
  }

  const json = JSON.parse(text);
  cached = {
    access: json.access_token,
    exp: Date.now() + (json.expires_in || 3600) * 1000,
  };

  return cached.access;
}

async function spotifyGet(path, token) {
  return fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Cached Spotify GET — avoids 429s from tight polling / many visitors.
 * Returns stale cache on rate limit when available.
 */
async function spotifyGetCached(path, token, { key, freshMs, staleMs, transform }) {
  const hit = cacheRead(key);
  if (hit.fresh) return hit.data;

  let res = await spotifyGet(path, token);

  if (res.status === 429) {
    if (hit.stale && hit.data) return hit.data;
    const err = new Error(`Spotify rate limited (${key})`);
    err.status = 429;
    err.detail = await res.text().then((t) => t.slice(0, 200)).catch(() => '');
    throw err;
  }

  const data = await transform(res);
  cacheWrite(key, data, freshMs, staleMs);
  return data;
}

function spotifyRoute(fetchData, options = {}) {
  const cacheControl =
    options.cacheControl || 's-maxage=45, stale-while-revalidate=120';

  return async function handler(req, res) {
    applyCors(req, res);

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.status(204).end();
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', cacheControl);

    try {
      const token = await getAccessToken();
      const payload = await fetchData(token);
      return res.status(200).json(payload);
    } catch (e) {
      const status = e.status || 500;
      return res.status(status).json({
        error: e.message || 'Server error',
        detail: e.detail,
        hint: e.hint,
        missing: e.missing,
      });
    }
  };
}

module.exports = {
  spotifyRoute,
  spotifyGet,
  spotifyGetCached,
  applyCors,
  getAccessToken,
};
