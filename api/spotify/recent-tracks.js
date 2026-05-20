const { spotifyRoute } = require('../lib/spotify');
const { fetchAll } = require('../lib/spotifyFetchers');

module.exports = spotifyRoute(async (token) => {
  const feed = await fetchAll(token);
  return feed.recent;
});
