import { useRef, useState } from 'react';
import './App.css';
import MissMeButton from './components/MissMeButton';
import PlaylistTitle from './components/PlaylistTitle';
import RainMode from './components/RainMode';
import MusicPlayer from './components/MusicPlayer';
import type { PlayerHandle } from './components/MusicPlayer';
import Footer from './components/Footer';

export default function App() {
  const player = useRef<PlayerHandle>(null);
  const [pulse, setPulse] = useState(0);
  const onBg = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button,a,input,iframe,[role="slider"],[data-nointeract]')) return;
    player.current?.toggle(); setPulse(n => n + 1); // real user click only
  };
  return (
    <main className="stage" onClick={onBg}>
      <MissMeButton />
      <div className="top"><PlaylistTitle /><RainMode /></div>
      <MusicPlayer ref={player} />
      <Footer />
      <span key={pulse} className={pulse ? 'flash' : ''} aria-hidden />
    </main>
  );
}
