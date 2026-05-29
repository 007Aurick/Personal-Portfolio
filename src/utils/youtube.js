/** Extract YouTube video ID from watch, embed, or youtu.be URLs. */
export function parseYouTubeId(urlOrId) {
  if (!urlOrId) {
    return null;
  }
  const value = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.slice(1).split('/')[0] || null;
    }
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v');
    }
  } catch {
    return null;
  }
  return null;
}

export function buildYouTubeEmbedUrl(videoId, { autoplay = true, mute = true, controls = false } = {}) {
  if (!videoId) {
    return null;
  }
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: mute ? '1' : '0',
    loop: '1',
    playlist: videoId,
    controls: controls ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
