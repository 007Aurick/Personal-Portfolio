import React, { useEffect, useRef, useState } from 'react';
import { buildYouTubeEmbedUrl } from '../../utils/youtube';
import './YouTubeLoop.css';

/**
 * Looping YouTube embed — muted autoplay when visible (cards) or on load (detail).
 */
const YouTubeLoop = ({
  videoId,
  title,
  className = '',
  poster,
  showControls = false,
  eager = false,
}) => {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager) {
      return undefined;
    }
    const node = wrapRef.current;
    if (!node) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25, rootMargin: '40px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  const embedUrl = buildYouTubeEmbedUrl(videoId, {
    autoplay: visible,
    mute: !showControls,
    controls: showControls,
  });

  return (
    <div ref={wrapRef} className={`youtube-loop ${className}`.trim()}>
      {visible && embedUrl ? (
        <iframe
          title={title}
          src={embedUrl}
          className="youtube-loop__iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        poster && <img src={poster} alt="" className="youtube-loop__poster" />
      )}
    </div>
  );
};

export default YouTubeLoop;
