/** Process-wide feed snapshot (warm serverless instances + stale fallback on 429). */
const g = globalThis;
if (!g.__spotifyFeedSnapshot) {
  g.__spotifyFeedSnapshot = { payload: null, freshUntil: 0, staleUntil: 0 };
}
if (!g.__spotifyTopSnapshot) {
  g.__spotifyTopSnapshot = { top: null, freshUntil: 0 };
}
if (!g.__spotifyCpSnapshot) {
  g.__spotifyCpSnapshot = { cp: null, freshUntil: 0 };
}

function readFeedSnapshot() {
  const s = g.__spotifyFeedSnapshot;
  const now = Date.now();
  if (!s.payload) return { fresh: false, stale: false, payload: null };
  if (now < s.freshUntil) return { fresh: true, stale: true, payload: s.payload };
  if (now < s.staleUntil) return { fresh: false, stale: true, payload: s.payload };
  g.__spotifyFeedSnapshot = { payload: null, freshUntil: 0, staleUntil: 0 };
  return { fresh: false, stale: false, payload: null };
}

function writeFeedSnapshot(payload, freshMs = 45_000, staleMs = 3_600_000) {
  const now = Date.now();
  g.__spotifyFeedSnapshot = {
    payload,
    freshUntil: now + freshMs,
    staleUntil: now + staleMs,
  };
}

/** Top artists (~4 weeks) — refresh at most every 12h to save API quota. */
function readTopSnapshot() {
  const s = g.__spotifyTopSnapshot;
  if (!s.top) return { fresh: false, top: null };
  if (Date.now() < s.freshUntil) return { fresh: true, top: s.top };
  return { fresh: false, top: s.top };
}

function writeTopSnapshot(top, freshMs = 12 * 60 * 60_000) {
  g.__spotifyTopSnapshot = {
    top,
    freshUntil: Date.now() + freshMs,
  };
}

function readCpSnapshot() {
  const s = g.__spotifyCpSnapshot;
  if (!s.cp) return { fresh: false, cp: null };
  if (Date.now() < s.freshUntil) return { fresh: true, cp: s.cp };
  return { fresh: false, cp: s.cp };
}

function writeCpSnapshot(cp, freshMs = 20_000) {
  g.__spotifyCpSnapshot = {
    cp,
    freshUntil: Date.now() + freshMs,
  };
}

module.exports = {
  readFeedSnapshot,
  writeFeedSnapshot,
  readTopSnapshot,
  writeTopSnapshot,
  readCpSnapshot,
  writeCpSnapshot,
};
