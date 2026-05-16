/** RFC 7636 PKCE helpers for Spotify authorization */

function randomVerifier(length = 64) {
  const unreserved =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = '';
  for (let i = 0; i < length; i += 1) out += unreserved[bytes[i] % unreserved.length];
  return out;
}

async function sha256Base64Url(plain) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
  const bin = String.fromCharCode(...new Uint8Array(digest));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generatePkcePair() {
  const verifier = randomVerifier(64);
  const challenge = await sha256Base64Url(verifier);
  return { verifier, challenge };
}
