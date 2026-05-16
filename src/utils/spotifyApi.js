const API = 'https://api.spotify.com/v1';

export const SPOTIFY_ART_FALLBACK =
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80&auto=format&fit=crop';

function pickAlbumImage(images) {
  if (!images?.length) return SPOTIFY_ART_FALLBACK;
  const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url || sorted[sorted.length - 1]?.url || SPOTIFY_ART_FALLBACK;
}

export function normalizeTrack(track, meta = {}) {
  if (!track) return null;
  const album = track.album || {};
  const images = album.images?.length ? album.images : track.images;
  const show = track.show || {};
  return {
    id: track.id,
    /** ISO timestamp from `/me/player/recently-played` — use for stable list keys when the same track appears twice */
    playedAt: meta.playedAt ?? null,
    albumArt: pickAlbumImage(images),
    trackName: track.name || 'Unknown track',
    artistName:
      (track.artists || []).map((a) => a.name).filter(Boolean).join(', ') ||
      show.name ||
      'Unknown artist',
    albumName: album.name || '',
    openUrl: track.external_urls?.spotify || 'https://open.spotify.com/',
  };
}

/** One row from recently-played: `{ track, played_at }` or `{ episode, played_at }` */
export function normalizeRecentPlayItem(row) {
  if (!row) return null;
  const playedAt = row.played_at ?? null;
  const track = row.track || row.episode;
  return normalizeTrack(track, { playedAt });
}

function authHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function fetchCurrentlyPlaying(accessToken) {
  const res = await fetch(`${API}/me/player/currently-playing`, {
    headers: authHeaders(accessToken),
  });

  if (res.status === 204) {
    return { isPlaying: false, track: null };
  }

  if (res.status === 401) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`Currently playing failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return {
    isPlaying: Boolean(data.is_playing && data.item),
    track: data.item || null,
  };
}

export async function fetchRecentlyPlayed(accessToken, limit = 10) {
  const res = await fetch(`${API}/me/player/recently-played?limit=${limit}`, {
    headers: authHeaders(accessToken),
  });

  if (res.status === 401) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`Recently played failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data.items || [];
}

function pickArtistImage(images) {
  if (!images?.length) return SPOTIFY_ART_FALLBACK;
  const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url || SPOTIFY_ART_FALLBACK;
}

export function normalizeTopArtist(artist) {
  if (!artist) return null;
  return {
    id: artist.id,
    name: artist.name || 'Artist',
    image: pickArtistImage(artist.images),
    openUrl: artist.external_urls?.spotify || 'https://open.spotify.com/',
  };
}

/** ~last 4 weeks — closest Spotify has to “this month” */
export async function fetchTopArtistsShortTerm(accessToken, limit = 5) {
  const res = await fetch(`${API}/me/top/artists?time_range=short_term&limit=${limit}`, {
    headers: authHeaders(accessToken),
  });

  if (res.status === 401) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`Top artists failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return (data.items || []).map(normalizeTopArtist).filter(Boolean);
}
