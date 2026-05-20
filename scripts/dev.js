/**
 * One command local dev: Spotify API (4398) + React (3000). Windows-safe.
 * Usage: npm run dev
 */
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const root = path.join(__dirname, '..');
const apiPort = Number(process.env.SPOTIFY_LOCAL_API_PORT || 4398);
const children = [];

function waitForPort(port, host = '127.0.0.1', timeoutMs = 90_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const socket = net.createConnection({ port, host }, () => {
        socket.destroy();
        resolve();
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`API did not start on ${host}:${port}`));
        } else {
          setTimeout(tryOnce, 300);
        }
      });
    };
    tryOnce();
  });
}

function run(label, command, args) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  child.on('error', (err) => {
    console.error(`[${label}]`, err.message);
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { shell: true });
      } else {
        child.kill('SIGTERM');
      }
    } catch {
      /* ignore */
    }
  }
  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('[dev] Starting Spotify API...');
run('api', 'node', ['scripts/local-spotify-server.js']);

waitForPort(apiPort)
  .then(() => {
    console.log(`[dev] API ready → http://127.0.0.1:${apiPort}/api/spotify/feed`);
    console.log('[dev] Starting React → http://localhost:3000');
    run('web', 'npx', ['craco', 'start']);
  })
  .catch((err) => {
    console.error('[dev]', err.message);
    console.error('[dev] Fix: .env.local needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN');
    shutdown(1);
  });
