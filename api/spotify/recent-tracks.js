const { spotifyRoute } = require('../lib/spotify');
const { fetchRecentTracks } = require('../lib/spotifyFetchers');

module.exports = spotifyRoute((token) => fetchRecentTracks(token));
