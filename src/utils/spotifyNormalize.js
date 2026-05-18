export const SPOTIFY_ART_FALLBACK =
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80&auto=format&fit=crop';

function pickAlbumImage(images) {
  if (!images?.length) return SPOTIFY_ART_FALLBACK;
  const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url || sorted[sorted.length - 1]?.url || SPOTIFY_ART_FALLBACK;
}

function pickArtistImage(images) {
  if (!images?.length) return SPOTIFY_ART_FALLBACK;
  const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url || SPOTIFY_ART_FALLBACK;
}

export function normalizeTrack(track, meta = {}) {
  if (!track) return null;
  const album = track.album || {};
  const images = album.images?.length ? album.images : track.images;
  const show = track.show || {};
  return {
    id: track.id,
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

export function normalizeRecentPlayItem(row) {
  if (!row) return null;
  const playedAt = row.played_at ?? null;
  const track = row.track || row.episode;
  return normalizeTrack(track, { playedAt });
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

export function normalizeCurrentlyPlaying(payload) {
  if (!payload) {
    return {
      isPlaying: false,
      track: null,
      progressMs: 0,
      durationMs: 0,
    };
  }

  const item = payload.item;
  const activelyPlaying = Boolean(payload.is_playing && item);

  if (!activelyPlaying) {
    return {
      isPlaying: false,
      track: null,
      progressMs: 0,
      durationMs: 0,
    };
  }

  return {
    isPlaying: true,
    track: normalizeTrack(item),
    progressMs: payload.progress_ms ?? 0,
    durationMs: payload.duration_ms ?? item?.duration_ms ?? 0,
  };
}
