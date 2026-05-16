/**
 * When REACT_APP_SPOTIFY_PUBLIC_FEED=true, the site loads Spotify from /api/spotify
 * (Vercel serverless) so visitors see your playback without signing in.
 */

export function isSpotifyPublicFeedEnabled() {
  return String(process.env.REACT_APP_SPOTIFY_PUBLIC_FEED || '').toLowerCase() === 'true';
}

/**
 * Base URL for API (empty = same origin, e.g. https://yoursite.vercel.app/api/spotify).
 * Override if the API is hosted elsewhere.
 */
function apiBase() {
  return (process.env.REACT_APP_SPOTIFY_API_BASE || '').replace(/\/$/, '');
}

export async function fetchSpotifyPublicBundle() {
  const url = `${apiBase()}/api/spotify`;
  const res = await fetch(url, { credentials: 'same-origin' });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw Object.assign(new Error('Invalid JSON from Spotify proxy'), { status: res.status });
  }
  if (!res.ok) {
    const missingPart = Array.isArray(json.missing) ? ` Missing: ${json.missing.join(' | ')}.` : '';
    const hintPart = json.hint ? ` ${json.hint}` : '';
    const err = new Error(
      (json.error || `Spotify proxy failed (${res.status})`) +
        (json.detail ? ` ${json.detail}` : '') +
        missingPart +
        hintPart,
    );
    err.status = res.status;
    err.detail = json.detail;
    throw err;
  }
  return json;
}
