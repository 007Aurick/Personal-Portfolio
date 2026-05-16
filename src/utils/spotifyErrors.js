/** Key used to pass OAuth/token errors from /callback back to Home */
export const SPOTIFY_OAUTH_ERROR_KEY = 'spotify_oauth_error';

export function setSpotifyOAuthError(message) {
  try {
    sessionStorage.setItem(SPOTIFY_OAUTH_ERROR_KEY, message);
  } catch {
    /* ignore */
  }
}

export function consumeSpotifyOAuthError() {
  try {
    const m = sessionStorage.getItem(SPOTIFY_OAUTH_ERROR_KEY);
    sessionStorage.removeItem(SPOTIFY_OAUTH_ERROR_KEY);
    return m || null;
  } catch {
    return null;
  }
}

/** Spotify token endpoint returns JSON: { error, error_description } */
export function formatSpotifyTokenErrorResponse(text) {
  if (!text) return 'Spotify token request failed.';
  try {
    const j = JSON.parse(text);
    if (j.error_description) return `${j.error || 'Error'}: ${j.error_description}`;
    if (j.error) return String(j.error);
  } catch {
    /* not JSON */
  }
  if (text.length > 280) return `${text.slice(0, 280)}…`;
  return text;
}
