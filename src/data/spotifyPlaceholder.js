/**
 * Spotify Web API placeholders — swap fetch logic later without redesigning UI.
 */

export const spotifyPlaceholder = {
  isPlaying: true,
  /** Opens track in Spotify when wired (demo = Spotify home) */
  spotifyOpenBaseUrl: 'https://open.spotify.com/',
  currentlyPlaying: {
    albumArt:
      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80&auto=format&fit=crop',
    trackName: 'Nightdrive Compiler',
    artistName: 'Lofi Engineer Collective',
    albumName: 'Ship Logs Vol. 2',
    durationMs: 212000,
    progressMs: 74000,
    /** Replace with real track URL when API returns external_urls.spotify */
    openUrl: 'https://open.spotify.com/',
  },
  recentlyPlayed: [
    {
      id: 'rp1',
      albumArt:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80&auto=format&fit=crop',
      trackName: 'Gaussian Dreams',
      artistName: 'Slip Ensemble',
      playedAt: '2h ago',
      openUrl: 'https://open.spotify.com/',
    },
    {
      id: 'rp2',
      albumArt:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80&auto=format&fit=crop',
      trackName: 'Firmware Waltz',
      artistName: 'GPIO Syndicate',
      playedAt: '5h ago',
      openUrl: 'https://open.spotify.com/',
    },
    {
      id: 'rp3',
      albumArt:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80&auto=format&fit=crop',
      trackName: 'Closed Loop',
      artistName: 'PID & Chill',
      playedAt: 'yesterday',
      openUrl: 'https://open.spotify.com/',
    },
    {
      id: 'rp4',
      albumArt:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80&auto=format&fit=crop',
      trackName: 'Latency Blues',
      artistName: 'Buffer Overflow Trio',
      playedAt: '2d ago',
      openUrl: 'https://open.spotify.com/',
    },
    {
      id: 'rp5',
      albumArt:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80&auto=format&fit=crop',
      trackName: 'Stack Trace Serenade',
      artistName: 'Segfault Orchestra',
      playedAt: '3d ago',
      openUrl: 'https://open.spotify.com/',
    },
  ],
};
