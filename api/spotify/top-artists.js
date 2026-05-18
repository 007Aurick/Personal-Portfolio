const { spotifyRoute } = require('../lib/spotify');
const { fetchTopArtists } = require('../lib/spotifyFetchers');

module.exports = spotifyRoute((token) => fetchTopArtists(token));
