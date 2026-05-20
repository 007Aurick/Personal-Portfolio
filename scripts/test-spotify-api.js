/* One-off: node scripts/test-spotify-api.js — prints status codes only */
const fs = require('fs');
const path = require('path');

function loadEnv(file) {
  const env = {};
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[t.slice(0, i).trim()] = v;
  }
  return env;
}

async function main() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('No .env.local');
    process.exit(1);
  }
  const env = loadEnv(envPath);
  const clientId = env.SPOTIFY_CLIENT_ID || env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });
  if (clientSecret) body.append('client_secret', clientSecret);

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const tokenText = await tokenRes.text();
  if (!tokenRes.ok) {
    console.error('token', tokenRes.status, tokenText.slice(0, 200));
    process.exit(1);
  }
  const { access_token: token } = JSON.parse(tokenText);
  console.log('token ok');

  async function hit(path) {
    const res = await fetch(`https://api.spotify.com/v1${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const retry = res.headers.get('Retry-After');
    let extra = '';
    if (res.ok && path.includes('recently')) {
      const j = await res.json();
      extra = ` items=${(j.items || []).length}`;
    } else if (!res.ok) {
      extra = ` body=${(await res.text()).slice(0, 80)}`;
    }
    console.log(path, res.status, retry ? `retry-after=${retry}` : '', extra);
  }

  await hit('/me/player/recently-played?limit=5');
  await new Promise((r) => setTimeout(r, 500));
  await hit('/me/player/currently-playing');
  await new Promise((r) => setTimeout(r, 500));
  await hit('/me/top/artists?time_range=short_term&limit=5');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
