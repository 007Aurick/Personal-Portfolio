import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForTokensDeduped } from '../utils/spotifyAuth';
import { setSpotifyOAuthError } from '../utils/spotifyErrors';
import './SpotifyCallback.css';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Connecting Spotify…');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err = params.get('error');

    if (err) {
      const desc = params.get('error_description') || err;
      const msg = `Spotify login: ${desc}`;
      setMessage(msg);
      setSpotifyOAuthError(msg);
      window.setTimeout(() => navigate('/', { replace: true }), 3200);
      return;
    }

    if (!code) {
      navigate('/', { replace: true });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await exchangeCodeForTokensDeduped(code);
        if (!cancelled) navigate('/', { replace: true });
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          const msg = e.message || 'Could not finish Spotify login.';
          setMessage(msg);
          setSpotifyOAuthError(msg);
          window.setTimeout(() => navigate('/', { replace: true }), 4200);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <section className="spotify-callback section">
      <div className="container">
        <p className="spotify-callback-text">{message}</p>
      </div>
    </section>
  );
};

export default SpotifyCallback;
