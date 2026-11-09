import { useEffect, useRef, useState } from 'react';
import { NotePaper } from '../components/NotePaper';
import { VillagePanorama } from '../components/VillagePanorama';
import { VillagerFull } from '../components/VillagerFull';
import { CHAPTERS } from '../game/chapters';
import { chapterCommissions, isChapterOpen, type Progress } from '../game/progress';
import { TUTORIAL } from '../game/tutorial';
import type { VillagerId } from '../game/types';
import { VILLAGER_NAMES } from '../game/villagers';
import './TitleScreen.css';

/** The panorama is drawn on a 720×180 grid and scaled up by at least 2 (1440×360 at full width), so 1 unit = a 2px line. */
const GRID_W = 720;
const GRID_H = 180;
const MIN_SCALE = 2;
/** Villagers stand about 36 grid units tall (about half a house); their feet sit 12/250 above the bottom of the 200×250 sprite. */
const VILLAGER_GRID_HEIGHT = 36;
const FOOT_GAP = 12 / 250;
/** Walking moves 1 grid unit (2px at scale 2) every 125ms: slow, pixel-stepped strolling. */
const TICK_MS = 125;
const STEP = 1;
/** Two walkers on about the same road depth stop instead of overlapping when closer than this. */
const PERSONAL_SPACE = 28;
const TYPE_MS = 60;

const LINES: Record<Exclude<VillagerId, 'rabbit'>, string[]> = {
  bear: ['안녕! 도서관 카드 부탁해도 될까?', '오늘은 책 읽기 좋은 날이야.'],
  cat: ['h1 태그는 꼭 닫아줘야 한다냥.', '잡화점 진열대도 언젠가 꾸며 줄 거지냥?'],
  fox: ['사진 위에 NEW 스티커 딱 붙여줄래요?', '밤이 되면 언덕에서 별 사진을 찍어요.'],
  dog: ['이 버튼 누르면 뭐가 나와요? 멍!', '간식가게 문 열면 제일 먼저 놀러 와요, 멍!'],
  tiger: ['가로 정렬? flex 하나면 끝이다, 어흥.', '체육관에서 만나자, 어흥!'],
};

function rabbitLine(progress: Progress): string {
  if (progress.completed.length === 0) return '어서 와요! 웹페이지 만들어 줄 개발자님 맞죠?';
  const finished = CHAPTERS.filter(c => { const items = chapterCommissions(c.number); return items.length > 0 && items.every(({ commission }) => progress.completed.includes(commission.id)); });
  const nextReady = CHAPTERS.some(c => isChapterOpen(progress, c.number) && chapterCommissions(c.number).some(({ commission }) => !progress.completed.includes(commission.id)));
  if (finished.length > 0 && !nextReady) return '덕분에 손님이 늘었어요! 새 의뢰는 곧 게시판에 붙을 거예요.';
  if (finished.length > 0) return '덕분에 손님이 늘었어요! 게시판에 새 의뢰가 붙었어요.';
  return '오늘도 게시판에 의뢰가 붙어 있어요!';
}

type Mode = 'walk' | 'idle' | 'talk';
interface Walker { id: VillagerId; gx: number; gy: number; dir: 1 | -1; mode: Mode; until: number; line: string; lineKey: number }

/** Start spots in grid units, in front of each villager's own building. Rabbit stays at the cafe door. */
const START: { id: VillagerId; gx: number; gy: number; dir: 1 | -1 }[] = [
  { id: 'bear', gx: 70, gy: 152, dir: 1 },
  { id: 'dog', gx: 180, gy: 156, dir: -1 },
  { id: 'rabbit', gx: 320, gy: 146, dir: 1 },
  { id: 'cat', gx: 465, gy: 154, dir: -1 },
  { id: 'tiger', gx: 575, gy: 150, dir: 1 },
  { id: 'fox', gx: 670, gy: 157, dir: -1 },
];

function TownVillager({ walker, scale, width, onTalk }: { walker: Walker; scale: number; width: number; onTalk: () => void }) {
  const [shown, setShown] = useState(0);
  const talking = walker.mode === 'talk';
  useEffect(() => {
    if (!talking) return;
    const timer = window.setInterval(() => setShown(i => i >= walker.line.length ? i : i + 1), TYPE_MS);
    return () => window.clearInterval(timer);
  }, [talking, walker.line]);
  const height = VILLAGER_GRID_HEIGHT * scale;
  const typing = talking && shown < walker.line.length;
  return <button
    className="town-villager"
    style={{ left: (walker.gx - GRID_W / 2) * scale + width / 2 - height * 0.4, bottom: (GRID_H - walker.gy) * scale - height * FOOT_GAP, zIndex: Math.round(walker.gy) }}
    aria-label={`${VILLAGER_NAMES[walker.id]}에게 말 걸기`}
    onClick={onTalk}
  >
    {talking && <span className="town-bubble" role="status">{walker.line.slice(0, shown)}<span className="sr-only">{walker.line.slice(shown)}</span></span>}
    <VillagerFull id={walker.id} height={height} facing={walker.dir === 1 ? 'right' : 'left'} walking={walker.mode === 'walk'} talking={typing} mouthOpen={typing && shown % 2 === 1 && walker.line[shown - 1] !== ' '}/>
  </button>;
}

function Town({ progress }: { progress: Progress }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1440);
  const [walkers, setWalkers] = useState<Walker[]>(() => START.map(s => ({ ...s, mode: 'idle', until: s.id === 'rabbit' ? Infinity : Date.now() + 400 + Math.random() * 1600, line: '', lineKey: 0 })));
  const scale = Math.max(width / GRID_W, MIN_SCALE);
  const bounds = useRef({ min: 20, max: GRID_W - 20 });
  // Keep strollers inside the part of the street that is actually visible at this window width.
  useEffect(() => {
    const halfVisible = width / 2 / scale;
    bounds.current = { min: Math.max(20, GRID_W / 2 - halfVisible + 16), max: Math.min(GRID_W - 20, GRID_W / 2 + halfVisible - 16) };
  }, [width, scale]);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const talk = (id: VillagerId) => setWalkers(ws => ws.map(w => {
    if (w.id !== id) return w;
    const line = id === 'rabbit' ? rabbitLine(progress) : LINES[id][Math.floor(Math.random() * LINES[id].length)];
    return { ...w, mode: 'talk', line, lineKey: w.lineKey + 1, until: Date.now() + line.length * TYPE_MS + 2200 };
  }));
  const talkRef = useRef(talk);
  useEffect(() => { talkRef.current = talk; });

  useEffect(() => {
    const greet = window.setTimeout(() => talkRef.current('rabbit'), 900);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => window.clearTimeout(greet);
    const timer = window.setInterval(() => setWalkers(ws => {
      const now = Date.now();
      return ws.map((w, i): Walker => {
        if (w.id === 'rabbit') return w.mode === 'talk' && now > w.until ? { ...w, mode: 'idle', until: Infinity } : w;
        if (w.mode !== 'walk') {
          if (now < w.until) return w;
          return { ...w, mode: 'walk', dir: w.mode === 'idle' && Math.random() < 0.35 ? (w.dir === 1 ? -1 : 1) : w.dir };
        }
        const turned: 1 | -1 = w.dir === 1 ? -1 : 1;
        const next = w.gx + w.dir * STEP;
        const blocked = ws.some((o, j) => j !== i && o.id !== 'rabbit' && Math.abs(o.gy - w.gy) < 5 && (o.gx - w.gx) * w.dir > 0 && Math.abs(o.gx - w.gx) < PERSONAL_SPACE);
        if (blocked) return { ...w, mode: 'idle', dir: turned, until: now + 900 };
        if (next < bounds.current.min || next > bounds.current.max) return { ...w, mode: 'idle', dir: turned, until: now + 700 };
        if (Math.random() < 1 / 60) return { ...w, mode: 'idle', until: now + 1200 + Math.random() * 2400 };
        return { ...w, gx: next };
      });
    }), TICK_MS);
    return () => { window.clearTimeout(greet); window.clearInterval(timer); };
  }, []);

  const openChapters = CHAPTERS.filter(c => isChapterOpen(progress, c.number)).map(c => c.number);
  return <div className="title-village" ref={box}>
    <VillagePanorama openChapters={openChapters}/>
    {walkers.map(w => <TownVillager key={`${w.id}-${w.lineKey}`} walker={w} scale={scale} width={width} onTalk={() => talk(w.id)}/>)}
  </div>;
}

/** Puffy cloud: overlapping circles over a flat base, outlined once (1 unit = 2px, like every other line). */
const CLOUD_SHAPES = [
  { w: 40, h: 17, puffs: [[12, 10, 5], [20, 7, 6], [29, 9, 5]], base: [6, 10, 32, 6] },
  { w: 30, h: 13, puffs: [[10, 8, 4], [17, 6, 5], [23, 9, 3]], base: [5, 8, 22, 4] },
  { w: 52, h: 19, puffs: [[14, 12, 6], [24, 8, 7], [34, 10, 6], [42, 13, 4]], base: [7, 12, 41, 6] },
];
function Cloud({ shape }: { shape: number }) {
  const { w, h, puffs, base: [bx, by, bw, bh] } = CLOUD_SHAPES[shape];
  return <svg viewBox={`0 0 ${w} ${h}`} width={w * 2} height={h * 2} shapeRendering="crispEdges" aria-hidden="true">
    {puffs.map(([cx, cy, r]) => <circle key={`o${cx}`} cx={cx} cy={cy} r={r + 1} fill="#A6A6A6"/>)}
    <rect x={bx - 1} y={by - 1} width={bw + 2} height={bh + 2} fill="#A6A6A6"/>
    {puffs.map(([cx, cy, r]) => <circle key={`i${cx}`} cx={cx} cy={cy} r={r} fill="#FFFFFF"/>)}
    <rect x={bx} y={by} width={bw} height={bh} fill="#FFFFFF"/>
  </svg>;
}

/** Each cloud drifts on its own: different height, size, speed and a random starting point. */
const CLOUDS = [
  { shape: 0, top: 26, seconds: 150 },
  { shape: 1, top: 104, seconds: 95 },
  { shape: 2, top: 58, seconds: 210 },
];
function Clouds() {
  const [offsets] = useState(() => CLOUDS.map(() => Math.random()));
  return <>{CLOUDS.map((c, i) => <div key={c.shape} className="cloud" style={{ top: c.top, animationDuration: `${c.seconds}s`, animationDelay: `${-offsets[i] * c.seconds}s` }}><Cloud shape={c.shape}/></div>)}</>;
}

function Bird({ className }: { className: string }) {
  return <svg className={`bird ${className}`} viewBox="0 0 7 4" width={14} height={8} shapeRendering="crispEdges" aria-hidden="true">
    <path className="wing-up" fill="#8C8C8C" d="M0 0h1v1H0zM1 1h1v1H1zM2 2h3v1H2zM5 1h1v1H5zM6 0h1v1H6z"/>
    <path className="wing-down" fill="#8C8C8C" d="M0 2h2v1H0zM2 2h3v1H2zM5 2h2v1H5zM1 3h1v1H1zM5 3h1v1H5z"/>
  </svg>;
}

/** Outline sun whose rays twinkle between a long and a short frame. */
function Sun() {
  return <svg className="sun" viewBox="0 0 17 17" width={68} height={68} shapeRendering="crispEdges" aria-hidden="true">
    <path fill="#FFFFFF" d="M6 5h5v7H6zM5 6h7v5H5z"/>
    <path fill="#141414" d="M6 4h5v1H6zM5 5h1v1H5zM11 5h1v1h-1zM4 6h1v5H4zM12 6h1v5h-1zM5 11h1v1H5zM11 11h1v1h-1zM6 12h5v1H6z"/>
    <path className="rays-long" fill="#141414" d="M8 0h1v3H8zM8 14h1v3H8zM0 8h3v1H0zM14 8h3v1h-3zM2 2h1v1H2zM3 3h1v1H3zM14 2h1v1h-1zM13 3h1v1h-1zM2 14h1v1H2zM3 13h1v1H3zM14 14h1v1h-1zM13 13h1v1h-1z"/>
    <path className="rays-short" fill="#141414" d="M8 1h1v2H8zM8 14h1v2H8zM1 8h2v1H1zM14 8h2v1h-2zM3 3h1v1H3zM13 3h1v1h-1zM3 13h1v1H3zM13 13h1v1h-1z"/>
  </svg>;
}

interface Props { progress: Progress; onStart: () => void; onReset: () => void }

export function TitleScreen({ progress, onStart, onReset }: Props) {
  const [tutorialKey, setTutorialKey] = useState(0);
  const firstVisit = progress.completed.length === 0 && !progress.tutorialDone;
  return <div className="title-screen">
    <div className="title-sky">
      <Clouds/>
      <Sun/>
      <Bird className="bird-1"/><Bird className="bird-2"/>
      <div className="title-sign-wrap">
        <div className="title-ropes" aria-hidden="true"><span/><span/></div>
        <h1 className="title-sign wood">&lt;Once Upon a Tag/&gt;</h1>
        <p className="title-sub">동물 마을 웹 가판대</p>
      </div>
    </div>
    <Town progress={progress}/>
    <div className="title-ground">
      <div className="title-buttons">
        <button className="wood-btn big" onClick={onStart}>{firstVisit ? '시작하기' : '마을 게시판 가기'}</button>
        <button className="wood-btn" onClick={() => setTutorialKey(Date.now())}>처음 설명</button>
      </div>
      <button className="title-reset" onClick={onReset}>진행도 지우기</button>
    </div>
    {tutorialKey > 0 && <NotePaper key={tutorialKey} pages={TUTORIAL} label="처음 설명" doneLabel="닫기" onClose={() => setTutorialKey(0)}/>}
  </div>;
}
