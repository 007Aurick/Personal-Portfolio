const { spotifyRoute } = require('../lib/spotify');
const { fetchAll } = require('../lib/spotifyFetchers');

/** One request from the browser → one serverless hit → sequential Spotify calls + shared cache. */
module.exports = spotifyRoute(async (token) => fetchAll(token));
