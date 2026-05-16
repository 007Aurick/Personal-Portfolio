/** RFC 7636 PKCE helpers for Spotify authorization */

import { sha256 } from 'js-sha256';

/** @returns {Crypto | undefined} */
function getWebCrypto() {
  return typeof window !== 'undefined' ? window.crypto : undefined;
}

function randomVerifier(length = 64) {
  const unreserved =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const c = getWebCrypto();
  if (!c?.getRandomValues) {
    throw new Error('Web Crypto getRandomValues is not available — use a modern browser over http://127.0.0.1 or https.');
  }
  const bytes = c.getRandomValues(new Uint8Array(length));
  let out = '';
  for (let i = 0; i < length; i += 1) out += unreserved[bytes[i] % unreserved.length];
  return out;
}

function bytesToBase64Url(buf) {
  const bin = String.fromCharCode(...new Uint8Array(buf));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Base64Url(plain) {
  const subtle = getWebCrypto()?.subtle;
  if (subtle?.digest) {
    const digest = await subtle.digest('SHA-256', new TextEncoder().encode(plain));
    return bytesToBase64Url(digest);
  }
  /** `crypto.subtle` is missing on some http://127.0.0.1 dev setups (non–secure context) */
  const digest = sha256.arrayBuffer(plain);
  return bytesToBase64Url(digest);
}

export async function generatePkcePair() {
  const verifier = randomVerifier(64);
  const challenge = await sha256Base64Url(verifier);
  return { verifier, challenge };
}
