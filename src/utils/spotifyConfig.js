/**
 * Spotify Web API — public client (PKCE). Never put Client Secret in the frontend.
 *
 * Spotify (since Apr 2025) rejects redirect URIs that use the hostname "localhost".
 * Dev must use a loopback literal: http://127.0.0.1:PORT/callback
 * @see https://developer.spotify.com/documentation/web-api/concepts/redirect_uri
 */

export function getClientId() {
  return (process.env.REACT_APP_SPOTIFY_CLIENT_ID || '').trim();
}

/** Must exactly match a Redirect URI in your Spotify Developer app settings */
export function getRedirectUri() {
  const env = (process.env.REACT_APP_SPOTIFY_REDIRECT_URI || '').trim();
  if (env) return env;

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    // Spotify does not allow "localhost"; normalize so OAuth matches dashboard URIs.
    const loopHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    const portPart = port ? `:${port}` : '';
    return `${protocol}//${loopHost}${portPart}/callback`;
  }

  return 'http://127.0.0.1:3000/callback';
}
