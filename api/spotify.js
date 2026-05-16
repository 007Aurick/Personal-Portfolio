/**
 * Vercel Serverless — serves your Spotify data to all visitors using a refresh token
 * (never exposed to the browser). Set env vars in the Vercel project dashboard.
 *
 * Required: SPOTIFY_CLIENT_ID, SPOTIFY_REFRESH_TOKEN
 * Optional: SPOTIFY_CLIENT_SECRET (only if your Spotify app type requires it for refresh)
 */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';

let cached = { access: null, exp: 0 };

async function getAccessToken() {
  const now = Date.now();
  if (cached.access && now < cached.exp - 60_000) return cached.access;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !refreshToken) {
    const err = new Error('Server misconfigured: missing SPOTIFY_CLIENT_ID or SPOTIFY_REFRESH_TOKEN');
    err.status = 503;
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
    throw err;
  }

  const json = JSON.parse(text);
  cached = {
    access: json.access_token,
    exp: Date.now() + (json.expires_in || 3600) * 1000,
  };

  if (json.refresh_token) {
    // Spotify occasionally rotates refresh tokens
    console.warn(
      '[api/spotify] Spotify returned a new refresh_token — copy it from logs once or re-auth and update SPOTIFY_REFRESH_TOKEN in Vercel.'
    );
  }

  return cached.access;
}

async function spotifyGet(path, token) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate=60');

  try {
    const token = await getAccessToken();

    const [cpRes, rpRes, taRes] = await Promise.all([
      spotifyGet('/me/player/currently-playing', token),
      spotifyGet('/me/player/recently-played?limit=10', token),
      spotifyGet('/me/top/artists?time_range=short_term&limit=5', token),
    ]);

    let currentlyPlaying = null;
    if (cpRes.status === 204) {
      currentlyPlaying = { is_playing: false, item: null };
    } else if (cpRes.status === 401) {
      return res.status(401).json({ error: 'Spotify unauthorized — check refresh token and app settings.' });
    } else if (!cpRes.ok) {
      const t = await cpRes.text();
      return res.status(502).json({ error: `Currently playing upstream ${cpRes.status}`, detail: t.slice(0, 300) });
    } else {
      currentlyPlaying = await cpRes.json();
    }

    if (!rpRes.ok) {
      const t = await rpRes.text();
      return res.status(502).json({ error: `Recently played upstream ${rpRes.status}`, detail: t.slice(0, 300) });
    }
    const recentlyPlayed = await rpRes.json();

    let topArtists = { items: [] };
    if (taRes.status === 401 || taRes.status === 403) {
      topArtists = { items: [], _topError: taRes.status };
    } else if (!taRes.ok) {
      const t = await taRes.text();
      topArtists = { items: [], _topError: taRes.status, _topDetail: t.slice(0, 200) };
    } else {
      topArtists = await taRes.json();
    }

    return res.status(200).json({
      currentlyPlaying,
      recentlyPlayed,
      topArtists,
    });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({
      error: e.message || 'Server error',
      detail: e.detail,
    });
  }
}
