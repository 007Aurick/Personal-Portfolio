import { getClientId, getRedirectUri } from './spotifyConfig';
import { formatSpotifyTokenErrorResponse } from './spotifyErrors';
import { generatePkcePair } from './spotifyPkce';
import {
  clearSpotifySession,
  consumePkceVerifier,
  getStoredTokens,
  setPkceVerifier,
  storeTokens,
} from './spotifyTokens';

const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

const SCOPES = ['user-read-currently-playing', 'user-read-recently-played', 'user-top-read'].join(' ');

/** Dedupe token exchange when React Strict Mode runs effects twice in dev */
const exchangeLocks = new Map();

export async function startSpotifyLogin() {
  const clientId = getClientId();
  if (!clientId) throw new Error('Missing REACT_APP_SPOTIFY_CLIENT_ID');

  const { verifier, challenge } = await generatePkcePair();
  setPkceVerifier(verifier);

  const redirectUri = getRedirectUri();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUri,
  });

  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

async function postToken(body) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(formatSpotifyTokenErrorResponse(text) || `Token error ${res.status}`);
  }
  return JSON.parse(text);
}

export async function exchangeCodeForTokens(code) {
  const clientId = getClientId();
  const codeVerifier = consumePkceVerifier();
  if (!codeVerifier) throw new Error('Missing PKCE verifier — try signing in again.');

  const data = await postToken({
    grant_type: 'authorization_code',
    code,
    redirect_uri: getRedirectUri(),
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  storeTokens(data);
  return data;
}

/** Same as exchangeCodeForTokens but shares one promise per auth code (Strict Mode safe). */
export function exchangeCodeForTokensDeduped(code) {
  if (exchangeLocks.has(code)) return exchangeLocks.get(code);

  const p = exchangeCodeForTokens(code).finally(() => {
    window.setTimeout(() => exchangeLocks.delete(code), 15_000);
  });

  exchangeLocks.set(code, p);
  return p;
}

export async function refreshAccessToken(refreshToken) {
  const clientId = getClientId();
  const data = await postToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });
  storeTokens({
    ...data,
    refresh_token: data.refresh_token || refreshToken,
    expires_in: data.expires_in ?? 3600,
  });
  return data.access_token;
}

export async function getValidAccessToken() {
  const { accessToken, refreshToken, expiryMs } = getStoredTokens();

  if (accessToken && Date.now() < expiryMs - 60_000) {
    return accessToken;
  }

  if (refreshToken) {
    try {
      return await refreshAccessToken(refreshToken);
    } catch {
      clearSpotifySession();
      return null;
    }
  }

  return null;
}

export function disconnectSpotify() {
  clearSpotifySession();
}
