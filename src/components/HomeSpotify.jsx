import React, { useCallback, useEffect, useState } from 'react';
import './HomeSpotify.css';
import { spotifyPlaceholder } from '../data/spotifyPlaceholder';
import {
  disconnectSpotify,
  getValidAccessToken,
} from '../utils/spotifyAuth';
import { getClientId } from '../utils/spotifyConfig';
import { consumeSpotifyOAuthError } from '../utils/spotifyErrors';
import {
  fetchCurrentlyPlaying,
  fetchRecentlyPlayed,
  fetchTopArtistsShortTerm,
  normalizeRecentPlayItem,
  normalizeTrack,
  normalizeTopArtist,
} from '../utils/spotifyApi';
import { isSpotifyPublicFeedEnabled, fetchSpotifyPublicBundle } from '../utils/spotifyPublicFeed';

/** Idle “currently playing” art — replace `Spotify.png` or swap this path to any file under `public/` */
const SPOTIFY_IDLE_CARD_IMAGE = `${process.env.PUBLIC_URL}/Spotify.png`;

function recentPlayListKey(item, index) {
  if (item.playedAt != null && String(item.playedAt).length > 0) {
    return `recent-${item.playedAt}-${item.id ?? index}`;
  }
  return `recent-${index}-${item.id ?? item.trackName}`;
}

const Equalizer = ({ active }) => (
  <div className="spotify-eq" aria-hidden>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`spotify-eq-bar ${active ? 'spotify-eq-bar--on' : ''}`}
        style={{ animationDelay: `${i * 0.09}s` }}
      />
    ))}
  </div>
);

const PlayTriangleIcon = () => (
  <svg className="spotify-recent-play-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

function demoSnapshot() {
  return {
    isPlaying: spotifyPlaceholder.isPlaying,
    current: {
      albumArt: spotifyPlaceholder.currentlyPlaying.albumArt,
      trackName: spotifyPlaceholder.currentlyPlaying.trackName,
      artistName: spotifyPlaceholder.currentlyPlaying.artistName,
      albumName: spotifyPlaceholder.currentlyPlaying.albumName || '',
      openUrl: spotifyPlaceholder.currentlyPlaying.openUrl || 'https://open.spotify.com/',
    },
    recent: spotifyPlaceholder.recentlyPlayed.map((r) => ({
      id: r.id,
      playedAt: r.playedAt || null,
      albumArt: r.albumArt,
      trackName: r.trackName,
      artistName: r.artistName,
      openUrl: r.openUrl || 'https://open.spotify.com/',
    })),
  };
}

function buildLiveSnapshot(cur, recentNorm) {
  const trackNorm = normalizeTrack(cur.track);
  /** Spotify often keeps `item` while paused; only treat as "live" when actually playing */
  const activelyPlaying = Boolean(cur.isPlaying && trackNorm);

  if (!activelyPlaying) {
    return {
      isPlaying: false,
      current: {
        albumArt: SPOTIFY_IDLE_CARD_IMAGE,
        trackName: 'User is not playing music',
        //artistName: 'Nothing on Spotify right now',
        albumName: '',
        openUrl: 'https://open.spotify.com/',
      },
      recent: recentNorm,
    };
  }

  return {
    isPlaying: true,
    current: trackNorm,
    recent: recentNorm,
  };
}

const POLL_MS_VISIBLE = 12_000;
const POLL_MS_HIDDEN = 45_000;

const HomeSpotify = () => {
  const publicFeed = isSpotifyPublicFeedEnabled();
  const configured = Boolean(getClientId()) || publicFeed;
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [snapshot, setSnapshot] = useState(() => demoSnapshot());
  const [topArtists, setTopArtists] = useState([]);
  const [extrasHint, setExtrasHint] = useState(null);

  const loadPlayback = useCallback(async () => {
    setError(null);

    if (publicFeed) {
      try {
        const bundle = await fetchSpotifyPublicBundle();
        const cp = bundle.currentlyPlaying || {};
        const cur = {
          isPlaying: Boolean(cp.is_playing && cp.item),
          track: cp.item || null,
        };
        const recentRaw = bundle.recentlyPlayed?.items || [];
        const recentNorm = recentRaw.map(normalizeRecentPlayItem).filter(Boolean);
        setSnapshot(buildLiveSnapshot(cur, recentNorm));

        const topErr = bundle.topArtists?._topError;
        if (topErr === 403) {
          setTopArtists([]);
          setExtrasHint(
            'Top artists: server token may need user-top-read — re-issue SPOTIFY_REFRESH_TOKEN with that scope.',
          );
        } else {
          const items = bundle.topArtists?.items || [];
          setTopArtists(items.map(normalizeTopArtist).filter(Boolean));
          setExtrasHint(null);
        }
        setConnected(true);
      } catch (e) {
        setConnected(false);
        setSnapshot(demoSnapshot());
        setTopArtists([]);
        setExtrasHint(null);
        const extra = e.detail ? ` ${typeof e.detail === 'string' ? e.detail : ''}` : '';
        setError((e.message || 'Spotify proxy failed') + extra);
      }
      return;
    }

    const token = await getValidAccessToken();
    if (!token) {
      setConnected(false);
      setSnapshot(demoSnapshot());
      setTopArtists([]);
      setExtrasHint(null);
      return;
    }

    setConnected(true);
    const cur = await fetchCurrentlyPlaying(token);
    const recentRaw = await fetchRecentlyPlayed(token);
    const recentNorm = recentRaw.map(normalizeRecentPlayItem).filter(Boolean);
    setSnapshot(buildLiveSnapshot(cur, recentNorm));

    try {
      const artists = await fetchTopArtistsShortTerm(token, 5);
      setTopArtists(artists);
      setExtrasHint(null);
    } catch (e) {
      setTopArtists([]);
      if (e.status === 403) {
        setExtrasHint('Top artists: add user-top-read to your Spotify app, then update SPOTIFY_REFRESH_TOKEN on the server or sign in again locally.');
      } else {
        setExtrasHint(null);
      }
    }
  }, [publicFeed]);

  useEffect(() => {
    const oauthErr = consumeSpotifyOAuthError();
    if (oauthErr) setError(oauthErr);
  }, []);

  useEffect(() => {
    if (!configured) {
      return undefined;
    }

    (async () => {
      try {
        await loadPlayback();
      } catch (e) {
        if (e.status === 401) {
          disconnectSpotify();
          setConnected(false);
          setSnapshot(demoSnapshot());
          setTopArtists([]);
          setExtrasHint(null);
        } else {
          const base = e.message || 'Could not load Spotify';
          const hint403 =
            e.status === 403
              ? ' If the app is in Development mode, add your Spotify email under the app’s “Users and access” in the Spotify Developer Dashboard.'
              : '';
          setError(base + hint403);
        }
      }
    })();
  }, [configured, loadPlayback]);

  useEffect(() => {
    if (!configured || !connected) return undefined;

    const tick = () => {
      loadPlayback().catch((e) => {
        if (e.status === 401) {
          disconnectSpotify();
          setConnected(false);
          setSnapshot(demoSnapshot());
          setTopArtists([]);
          setExtrasHint(null);
        }
      });
    };

    const pollMs = () => (document.hidden ? POLL_MS_HIDDEN : POLL_MS_VISIBLE);
    let id = window.setInterval(tick, pollMs());

    const onVisibility = () => {
      window.clearInterval(id);
      if (!document.hidden) tick();
      id = window.setInterval(tick, pollMs());
    };

    const onFocus = () => {
      if (!document.hidden) tick();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, [configured, connected, loadPlayback]);

  const { isPlaying, current, recent } = snapshot;

  return (
    <section className="home-spotify fade-in-up" aria-label="Spotify music">
      <div className="home-spotify-wrap">
        {error && <p className="home-spotify-error">{error}</p>}
        {!configured && (
          <p className="home-spotify-api-banner home-spotify-api-banner--solo">
            Add <code className="home-spotify-code">REACT_APP_SPOTIFY_CLIENT_ID</code> or enable{' '}
            <code className="home-spotify-code">REACT_APP_SPOTIFY_PUBLIC_FEED</code> — see{' '}
            <code className="home-spotify-code">.env.example</code>.
          </p>
        )}

        <div className="home-spotify-split">
          <div className="spotify-pane spotify-pane--now">
            <div className="spotify-left-stack">
              <div>
                <div className="spotify-pane-head">
                  <span className="home-spotify-label">Currently playing</span>
                </div>

                <div className="spotify-now-card">
                  <div className="spotify-now-art">
                    <img src={current.albumArt} alt="" />
                    <div className="spotify-now-art-shade" />
                  </div>

                  <div className="spotify-now-main">
                    <div className="spotify-now-row">
                      <div
                        className={`home-spotify-live ${isPlaying ? 'home-spotify-live--on' : ''}`}
                        title={isPlaying ? 'Playing' : 'Idle'}
                      />
                      <Equalizer active={isPlaying} />
                    </div>
                    <h3 className="spotify-now-track">{current.trackName}</h3>
                    <p className="spotify-now-artist">{current.artistName}</p>
                    {current.albumName ? <p className="spotify-now-album">{current.albumName}</p> : null}

                    <a
                      href={current.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn spotify-now-cta"
                    >
                      Play on Spotify
                    </a>
                  </div>
                </div>
              </div>

              <div className="spotify-extra-card spotify-extra-card--artists">
                <div className="spotify-pane-head">
                  <span className="home-spotify-label">Top artists ~this month</span>
                </div>
                <p className="spotify-extra-sub">Based on Spotify’s “short term” window (~last 4 weeks).</p>
                {extrasHint && <p className="spotify-extra-hint">{extrasHint}</p>}
                <ul className="spotify-top-artists">
                  {connected &&
                    topArtists.map((a, i) => (
                      <li key={a.id || `${a.name}-${i}`} className="spotify-top-artist-row">
                        <span className="spotify-top-artist-rank">{i + 1}</span>
                        <div className="spotify-top-artist-img-wrap">
                          <img src={a.image} alt="" className="spotify-top-artist-img" />
                        </div>
                        <a
                          href={a.openUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="spotify-top-artist-name"
                        >
                          {a.name}
                        </a>
                      </li>
                    ))}
                  {connected && topArtists.length === 0 && !extrasHint && (
                    <li className="spotify-top-artist-row spotify-top-artist-row--empty">No data yet — keep listening.</li>
                  )}
                  {!connected &&
                    [1, 2, 3, 4, 5].map((i) => (
                      <li key={i} className="spotify-top-artist-row spotify-top-artist-row--placeholder">
                        <span className="spotify-top-artist-rank">{i}</span>
                        <div className="spotify-top-artist-img-wrap spotify-top-artist-img-wrap--ph" />
                        <span className="spotify-top-artist-name spotify-top-artist-name--ph">Awaiting live data</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="spotify-pane spotify-pane--recent">
            <div className="spotify-pane-head">
              <span className="home-spotify-label">Recently played</span>
            </div>

            <ul className="spotify-recent-list spotify-recent-list--fill">
              {recent.map((item, index) => (
                <li key={recentPlayListKey(item, index)} className="spotify-recent-item">
                  <span className="spotify-recent-index">{index + 1}</span>
                  <div className="spotify-recent-thumb">
                    <img src={item.albumArt} alt="" />
                  </div>
                  <div className="spotify-recent-meta">
                    <span className="spotify-recent-title">{item.trackName}</span>
                    <span className="spotify-recent-artist">{item.artistName}</span>
                  </div>
                  <a
                    href={item.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spotify-recent-play"
                    aria-label={`Open ${item.trackName} on Spotify`}
                  >
                    <PlayTriangleIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSpotify;
