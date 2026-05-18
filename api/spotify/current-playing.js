const { spotifyRoute } = require('../lib/spotify');
const { fetchCurrentlyPlaying } = require('../lib/spotifyFetchers');

module.exports = spotifyRoute((token) => fetchCurrentlyPlaying(token));
