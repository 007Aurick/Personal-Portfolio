const STORAGE = {
  verifier: 'spotify_pkce_verifier',
  access: 'spotify_access_token',
  refresh: 'spotify_refresh_token',
  expiry: 'spotify_token_expiry_ms',
};

export function setPkceVerifier(verifier) {
  sessionStorage.setItem(STORAGE.verifier, verifier);
}

export function consumePkceVerifier() {
  const v = sessionStorage.getItem(STORAGE.verifier);
  sessionStorage.removeItem(STORAGE.verifier);
  return v;
}

export function storeTokens(payload) {
  const { access_token, refresh_token, expires_in } = payload;
  if (!access_token) return;
  sessionStorage.setItem(STORAGE.access, access_token);
  if (expires_in != null) {
    sessionStorage.setItem(STORAGE.expiry, String(Date.now() + Number(expires_in) * 1000));
  }
  if (refresh_token) sessionStorage.setItem(STORAGE.refresh, refresh_token);
}

export function getStoredTokens() {
  return {
    accessToken: sessionStorage.getItem(STORAGE.access),
    refreshToken: sessionStorage.getItem(STORAGE.refresh),
    expiryMs: Number(sessionStorage.getItem(STORAGE.expiry) || 0),
  };
}

export function clearSpotifySession() {
  Object.values(STORAGE).forEach((k) => sessionStorage.removeItem(k));
}
