import { useEffect, useRef, useState } from 'react';
import { Awning } from './components/Awning';
import { clearProgress, initialProgress, isUnlocked, loadProgress, saveProgress, type Progress } from './game/progress';
import { BoardScreen } from './screens/BoardScreen';
import { PlayScreen } from './screens/PlayScreen';
import { TitleScreen } from './screens/TitleScreen';
import './App.css';

type Screen = 'title' | 'board' | 'play';
/** The shutter covers the screen halfway through its animation; the screen swaps underneath at that moment. */
const SHUTTER_SWAP_MS = 240;

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [screen, setScreen] = useState<Screen>('title');
  const [playKey, setPlayKey] = useState(0);
  const [shutter, setShutter] = useState(0);
  const swapTimer = useRef(0);

  useEffect(() => { saveProgress(progress); }, [progress]);
  useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  const go = (next: Screen, beforeSwap?: () => void) => {
    window.clearTimeout(swapTimer.current);
    const swap = () => { beforeSwap?.(); setScreen(next); window.scrollTo(0, 0); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { swap(); return; }
    setShutter(Date.now());
    swapTimer.current = window.setTimeout(swap, SHUTTER_SWAP_MS);
  };
  const play = (index: number) => {
    if (!isUnlocked(progress, index)) return;
    go('play', () => { setProgress(p => ({ ...p, current: index })); setPlayKey(k => k + 1); });
  };
  const reset = () => {
    if (!window.confirm('진행도, 코인, 작성한 코드를 모두 지울까요? 되돌릴 수 없어요.')) return;
    clearProgress();
    go('title', () => setProgress(initialProgress()));
  };

  return <>
    {screen === 'title' && <TitleScreen progress={progress} onStart={() => go('board')} onReset={reset}/>}
    {screen === 'board' && <BoardScreen progress={progress} setProgress={setProgress} onBack={() => go('title')} onPlay={play}/>}
    {screen === 'play' && <PlayScreen key={playKey} progress={progress} setProgress={setProgress} onHome={() => go('board')} onReset={reset}/>}
    {shutter > 0 && <div key={shutter} className="shutter" aria-hidden="true" onAnimationEnd={() => setShutter(0)}><div className="shutter-cloth"/><Awning className="shutter-edge"/></div>}
  </>;
}
