/**
 * Local Spotify API — run beside `npm start` (proxied via src/setupProxy.js).
 * Usage: node scripts/local-spotify-server.js
 */
const http = require('http');
const { loadEnvLocal } = require('./load-env-local');

loadEnvLocal();

const feed = require('../api/spotify/feed');
const PORT = Number(process.env.SPOTIFY_LOCAL_API_PORT || 4398);

/** Vercel-style res helpers on plain Node http.ServerResponse */
function vercelRes(res) {
  const sendJson = (status, body) => {
    const data = JSON.stringify(body);
    if (!res.headersSent) {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data),
      });
    }
    res.end(data);
  };

  res.status = (code) => {
    res.statusCode = code;
    return {
      json: (body) => sendJson(code, body),
      end: () => {
        if (!res.headersSent) res.writeHead(code);
        res.end();
      },
    };
  };
  res.json = (body) => sendJson(res.statusCode || 200, body);
  res.setHeader = res.setHeader.bind(res);
  return res;
}

const server = http.createServer((req, res) => {
  const url = req.url || '';

  if (req.method === 'OPTIONS' && url.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && (url === '/api/health' || url.startsWith('/api/health'))) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
    return;
  }

  if (req.method === 'GET' && url.startsWith('/api/spotify/feed')) {
    return feed(req, vercelRes(res));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found. Try GET /api/health or /api/spotify/feed');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use (old dev server still running).`);
    console.error(`PowerShell: Get-NetTCPConnection -LocalPort ${PORT} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`);
    console.error(`Then run: npm run dev\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  const hasToken = Boolean(process.env.SPOTIFY_REFRESH_TOKEN);
  console.log(`Spotify local API  http://127.0.0.1:${PORT}/api/spotify/feed`);
  if (!hasToken) {
    console.warn('Warning: SPOTIFY_REFRESH_TOKEN missing in .env.local');
  }
});
