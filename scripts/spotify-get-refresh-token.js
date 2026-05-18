/**
 * One-time helper: open Spotify login, capture redirect, print refresh_token.
 *
 * Before running:
 * 1. Spotify Dashboard → your app → Settings
 * 2. Redirect URIs: add exactly → http://127.0.0.1:4399/callback
 * 3. If app is in Development mode: Users and Access → add your Spotify email
 * 4. Fill SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
 *
 * Run: npm run spotify:token
 */

const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 4399;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
].join(' ');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env.local — copy from .env.example and add SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET.');
    process.exit(1);
  }
  const vars = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

function openBrowser(url) {
  const cmd =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) console.log('\nOpen this URL in your browser:\n', url, '\n');
  });
}

async function exchangeCode(code, clientId, clientSecret) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Token exchange failed (${res.status}): ${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    const hint =
      json.error === 'invalid_grant'
        ? '\nTip: Codes expire in ~60s. Run npm run spotify:token again and approve quickly.'
        : json.error === 'invalid_client'
          ? '\nTip: Check SPOTIFY_CLIENT_SECRET in .env.local and Redirect URI in Spotify Dashboard.'
          : '';
    throw new Error(`${json.error || 'token_error'}: ${json.error_description || text}${hint}`);
  }

  return json;
}

function htmlPage(title, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>body{font-family:system-ui;background:#0a0a0a;color:#eaeaea;padding:2rem;max-width:32rem;margin:auto}
code{background:#1a1a1a;padding:.2em .4em;border-radius:4px;word-break:break-all}
.ok{color:#1ed760}.err{color:#fca5a5}</style></head><body>${body}</body></html>`;
}

async function main() {
  const env = loadEnvLocal();
  const clientId = env.SPOTIFY_CLIENT_ID || env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;

  if (!clientId) {
    console.error('Set SPOTIFY_CLIENT_ID in .env.local');
    process.exit(1);
  }
  if (!clientSecret) {
    console.error('Set SPOTIFY_CLIENT_SECRET in .env.local (Spotify Dashboard → View client secret)');
    process.exit(1);
  }

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', SCOPES);
  authUrl.searchParams.set('show_dialog', 'true');

  console.log('\nSpotify one-time login\n');
  console.log('Dashboard must include this Redirect URI (exact):');
  console.log(`  ${REDIRECT_URI}\n`);
  console.log('If the app is in Development mode, add your Spotify email under Users and Access.\n');
  console.log('Opening browser…\n');

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

    if (url.pathname !== '/callback') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const err = url.searchParams.get('error');
    const code = url.searchParams.get('code');

    if (err) {
      const desc = url.searchParams.get('error_description') || err;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        htmlPage(
          'Spotify error',
          `<h1 class="err">Authorization failed</h1><p>${desc}</p>
<p>Common fixes:</p><ul>
<li>Redirect URI in Dashboard must be <code>${REDIRECT_URI}</code> (not localhost, not port 3000)</li>
<li>Development mode: add your email under Users and Access</li>
</ul><p>You can close this tab.</p>`,
        ),
      );
      console.error('\nSpotify returned error:', desc);
      server.close();
      process.exit(1);
      return;
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlPage('Missing code', '<p class="err">No authorization code in URL.</p>'));
      return;
    }

    try {
      const tokens = await exchangeCode(code, clientId, clientSecret);
      const refresh = tokens.refresh_token;

      if (!refresh) {
        throw new Error('No refresh_token in response. Try again or revoke app access at spotify.com/account/apps first.');
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        htmlPage(
          'Success',
          `<h1 class="ok">Success</h1><p>Copy <code>refresh_token</code> into <code>.env.local</code> and Vercel as <code>SPOTIFY_REFRESH_TOKEN</code>, then redeploy.</p><p>You can close this tab.</p>`,
        ),
      );

      console.log('\n✓ Got refresh token. Add to .env.local:\n');
      console.log(`SPOTIFY_REFRESH_TOKEN=${refresh}\n`);
      console.log('Also add the same three SPOTIFY_* vars on Vercel, then deploy.\n');
      console.log('Local test: npm run dev:api\n');

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 500);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        htmlPage('Exchange failed', `<h1 class="err">Token exchange failed</h1><p>${e.message}</p>`),
      );
      console.error('\n', e.message);
      server.close();
      process.exit(1);
    }
  });

  server.listen(PORT, '127.0.0.1', () => {
    openBrowser(authUrl.toString());
    console.log('Waiting for Spotify redirect on', REDIRECT_URI);
    console.log('(If the browser did not open, paste the URL from the script source or run again.)\n');
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
