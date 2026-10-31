import { useEffect, useRef, useState } from 'react';
import { Umbrella } from 'lucide-react';
import { startRain, stopRain } from '../audio/RainAudio';

function RainAnimation() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, g = c.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const size = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    size(); addEventListener('resize', size);
    const n = reduce ? 40 : Math.min(140, Math.floor(innerWidth / 8));
    const drops = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, l: 10 + Math.random() * 14, v: 9 + Math.random() * 8 }));
    const tick = () => {
      g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(200,220,255,.4)'; g.lineWidth = 1; g.beginPath();
      for (const d of drops) {
        g.moveTo(d.x, d.y); g.lineTo(d.x - 2, d.y + d.l);
        d.y += d.v; if (d.y > h) { d.y = -d.l; d.x = Math.random() * w; }
      }
      g.stroke(); raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="rain" aria-hidden />;
}

export default function RainMode() {
  const [on, setOn] = useState(false);
  useEffect(() => { on ? startRain() : stopRain(); return stopRain; }, [on]);
  return (
    <>
      {on && <RainAnimation />}
      <button className="rainbtn" aria-pressed={on} onClick={() => setOn(v => !v)}>
        <Umbrella size={20} aria-hidden /> Rain Mode <b className={on ? 'on' : ''}>{on ? 'ON' : 'OFF'}</b>
      </button>
    </>
  );
}
