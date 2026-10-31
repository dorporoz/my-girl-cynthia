
import { RAIN_VOLUME } from '../config';

let audio: HTMLAudioElement | null = null;

export function startRain() {
  if (audio) return;

  audio = new Audio(
    new URL('./10 Minutes of Rain and Thunderstorm Sounds For Focus, Relaxing and Sleep ⛈️ Epidemic ASMR [7Vc4-FDGBxo].mp3', import.meta.url).href
  );

  audio.loop = true;
  audio.volume = RAIN_VOLUME;

  void audio.play().catch((error) => {
    console.error('Rain audio playback failed:', error);
    audio = null;
  });
}

export function stopRain() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
}
