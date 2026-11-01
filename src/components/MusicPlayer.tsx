
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward, Shuffle } from 'lucide-react';
import { PLAYLIST_ID, PLAYLIST_URL } from '../config';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface PlayerHandle {
  toggle: () => void;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const MusicPlayer = forwardRef<PlayerHandle>((_, ref) => {
  const p = useRef<any>(null);

  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [meta, setMeta] = useState({
    title: 'Cynthia Playlist',
    author: 'YouTube Music',
    thumb: '',
  });
  const [t, setT] = useState({ cur: 0, dur: 0 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const init = () => {
      p.current = new window.YT.Player('yt-embed', {
        width: '200',
        height: '113',
        playerVars: {
          listType: 'playlist',
          list: PLAYLIST_ID,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onStateChange: (e: any) => {
            setPlaying(e.data === 1);

            const d = p.current.getVideoData?.();

            if (d?.title) {
              setMeta({
                title: d.title,
                author: d.author || 'YouTube Music',
                thumb: d.video_id
                  ? `https://i.ytimg.com/vi/${d.video_id}/mqdefault.jpg`
                  : '',
              });
            }
          },
          onError: () => setFailed(true),
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;

      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }

    const id = setInterval(() => {
      const pl = p.current;

      if (pl?.getCurrentTime) {
        setT({
          cur: pl.getCurrentTime(),
          dur: pl.getDuration() || 0,
        });
      }
    }, 500);

    return () => {
      clearInterval(id);
      p.current?.destroy?.();
    };
  }, []);

  const toggle = () => {
    const pl = p.current;

    if (!pl?.getPlayerState) return;

    pl.getPlayerState() === 1
      ? pl.pauseVideo()
      : pl.playVideo();
  };

  const toggleShuffle = () => {
    const pl = p.current;

    if (!pl?.setShuffle) return;

    const next = !shuffle;

    pl.setShuffle(next);
    setShuffle(next);
  };

  useImperativeHandle(ref, () => ({ toggle }));

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();

    if (t.dur) {
      p.current?.seekTo(
        t.dur * ((e.clientX - r.left) / r.width),
        true
      );
    }
  };

  return (
    <>
      <section className="player" aria-label="Music player">
        <div
          className="art"
          style={
            meta.thumb
              ? { backgroundImage: `url(${meta.thumb})` }
              : undefined
          }
        />

        <div className="info">
          <div className="song">{meta.title}</div>

          <div className="artist">
            {failed ? (
              <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
                Open playlist in YouTube Music
              </a>
            ) : meta.author}
          </div>

          <div className="prog">
            <span>{fmt(t.cur)}</span>

            <div
              className="bar"
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(t.dur)}
              aria-valuenow={Math.round(t.cur)}
              onClick={seek}
            >
              <div
                style={{
                  width: t.dur
                    ? `${(t.cur / t.dur) * 100}%`
                    : 0,
                }}
              />
            </div>

            <span>{fmt(t.dur)}</span>
          </div>
        </div>

        <div className="ctrl">
          <button
            className={`sm shuffle-btn ${shuffle ? 'active' : ''}`}
            aria-label={shuffle ? 'Turn shuffle off' : 'Turn shuffle on'}
            aria-pressed={shuffle}
            title={shuffle ? 'Shuffle ON' : 'Shuffle OFF'}
            onClick={toggleShuffle}
          >
            <Shuffle size={17} />
          </button>

          <button
            className="sm"
            aria-label="Previous"
            onClick={() => p.current?.previousVideo()}
          >
            <SkipBack size={18} />
          </button>

          <button
            className="play"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={toggle}
          >
            {playing ? <Pause size={26} /> : <Play size={26} />}
          </button>

          <button
            className="sm"
            aria-label="Next"
            onClick={() => p.current?.nextVideo()}
          >
            <SkipForward size={18} />
          </button>
        </div>
      </section>

      <div className="yt-wrap" data-nointeract>
        <div id="yt-embed" />
      </div>
    </>
  );
});

export default MusicPlayer;
