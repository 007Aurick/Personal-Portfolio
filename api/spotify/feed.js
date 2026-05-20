const { applyCors, getAccessToken } = require('../lib/spotify');
const { fetchAll } = require('../lib/spotifyFetchers');

module.exports = async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('CDN-Cache-Control', 'max-age=30');
  res.setHeader(
    'Cache-Control',
    'public, max-age=15, s-maxage=30, stale-while-revalidate=120',
  );

  try {
    const token = await getAccessToken();
    const payload = await fetchAll(token);
    return res.status(200).json(payload);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({
      error: e.message || 'Server error',
      detail: e.detail,
      hint: e.hint,
      missing: e.missing,
    });
  }
};
