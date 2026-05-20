const g = globalThis;
if (typeof g.__spotifyBlockedUntil !== 'number') g.__spotifyBlockedUntil = 0;

function isBlocked() {
  return Date.now() < g.__spotifyBlockedUntil;
}

function blockMsRemaining() {
  return Math.max(0, g.__spotifyBlockedUntil - Date.now());
}

function applyRateLimitFromResponse(res) {
  if (res.status !== 429) return;
  const sec = parseInt(res.headers.get('Retry-After') || '1800', 10) || 1800;
  g.__spotifyBlockedUntil = Date.now() + sec * 1000;
}

function setBlockedForMs(ms) {
  g.__spotifyBlockedUntil = Date.now() + ms;
}

module.exports = {
  isBlocked,
  blockMsRemaining,
  applyRateLimitFromResponse,
  setBlockedForMs,
};
