import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { ChevronIcon } from '../components/ChevronIcon';
import { CoinIcon } from '../components/CoinIcon';
import { LockIcon } from '../components/LockIcon';
import { VillagerFull } from '../components/VillagerFull';
import { CHAPTERS, PART_NAMES, chapterOf, type Chapter, type PartNumber } from '../game/chapters';
import { chapterCommissions, commissions, isChapterOpen, isUnlocked, type Progress } from '../game/progress';
import '../components/NotePaper.css';
import '../components/StagePicker.css';
import './BoardScreen.css';

/** Board pages: parts 1–2 (chapters 1–5) and parts 3–5 (chapters 6–13). */
const PAGES: PartNumber[][] = [[1, 2], [3, 4, 5]];
/** Each pinned note leans a little differently, like notes stuck up by different villagers. */
const TILT = [-2.5, 1.5, -1, 2.5, -1.5, 1, -2, 2];

function Pin() {
  return <svg className="board-pin" viewBox="0 0 6 7" width={18} height={21} shapeRendering="crispEdges" aria-hidden="true">
    <path fill="#141414" d="M1 0h4v1H1zM0 1h1v3H0zM5 1h1v3H5zM1 4h4v1H1zM2 5h2v1H2zM2 6h1v1H2z"/>
    <path fill="#8C8C8C" d="M1 1h4v3H1z"/><path fill="#FFFFFF" d="M1 1h1v1H1z"/>
  </svg>;
}

function ChapterNote({ chapter, progress, fresh, tilt, onOpen }: { chapter: Chapter; progress: Progress; fresh: boolean; tilt: number; onOpen: () => void }) {
  const items = chapterCommissions(chapter.number);
  const open = isChapterOpen(progress, chapter.number);
  const done = items.filter(({ commission }) => progress.completed.includes(commission.id)).length;
  const finished = items.length > 0 && done === items.length;
  const playable = open && items.length > 0;
  const style = { '--tilt': `${tilt}deg` } as React.CSSProperties;
  if (!open) return <div className={`chapter-note locked${fresh ? ' pin-in' : ''}`} style={style} role="group" aria-label={`챕터 ${chapter.number} 잠김`}>
    <Pin/>
    <span className="chapter-num">챕터 {chapter.number}</span>
    <span className="chapter-lock"><LockIcon/></span>
    <span className="chapter-hint">챕터 {chapter.number - 1} 완료 후 열려요</span>
  </div>;
  return <button className={`chapter-note${fresh ? ' pin-in' : ''}`} style={style} disabled={!playable} onClick={onOpen} aria-label={`챕터 ${chapter.number} ${chapter.title}${playable ? `, ${items.length}개 중 ${done}개 완료` : ', 준비 중'}`}>
    <Pin/>
    <span className="chapter-num">챕터 {chapter.number}</span>
    <span className="chapter-face"><VillagerFull id={chapter.villager} height={64} facing="right" walking={false} talking={false} mouthOpen={false}/></span>
    <span className="chapter-title">{chapter.title}</span>
    {playable
      ? <><span className="chapter-cells" aria-hidden="true">{items.map(({ commission, index }) => <span key={commission.id} className={progress.completed.includes(commission.id) ? 'done' : index === progress.current ? 'current' : ''}/>)}</span><span className="chapter-count">{done} / {items.length}</span></>
      : <span className="chapter-hint">준비 중이에요</span>}
    {finished && <span className="chapter-stamp" aria-hidden="true">완료</span>}
  </button>;
}

function ChapterList({ chapter, progress, onPlay, onClose }: { chapter: Chapter; progress: Progress; onPlay: (index: number) => void; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="note-backdrop" role="presentation" onClick={onClose}>
    <div className="note-sheet chapter-sheet" role="dialog" aria-modal="true" aria-label={`챕터 ${chapter.number} 의뢰 목록`} onClick={event => event.stopPropagation()}>
      <span className="note-tape" aria-hidden="true"/>
      <div className="note-paper"><div className="note-inner">
        <div className="note-label">챕터 {chapter.number} · 파트 {chapter.part} {PART_NAMES[chapter.part]}</div>
        <h2 className="note-title">{chapter.title}</h2>
        <div className="stage-grid">
          {chapterCommissions(chapter.number).map(({ commission: c, index }) => {
            const unlocked = isUnlocked(progress, index);
            const done = progress.completed.includes(c.id);
            return <button key={c.id} className="stage-item" disabled={!unlocked} aria-current={index === progress.current ? 'step' : undefined} onClick={() => onPlay(index)}>
              <span className="stage-mark" aria-hidden="true">{!unlocked ? <LockIcon/> : done ? '■' : index === progress.current ? '▨' : '□'}</span>
              <span>{c.id} {c.title}</span>
            </button>;
          })}
        </div>
        <div className="note-footer"><button ref={close} className="btn" onClick={onClose}>닫기</button></div>
      </div></div>
    </div>
  </div>;
}

interface Props {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
  onBack: () => void;
  onPlay: (index: number) => void;
}

export function BoardScreen({ progress, setProgress, onBack, onPlay }: Props) {
  const current = commissions[progress.current];
  const [page, setPage] = useState(() => Math.max(0, PAGES.findIndex(parts => parts.includes(CHAPTERS.find(c => c.number === chapterOf(current.id))?.part ?? 1))));
  const [listed, setListed] = useState<Chapter | null>(null);
  // Chapters opened since the last visit get pinned with an animation, once.
  const [fresh] = useState(() => CHAPTERS.filter(c => isChapterOpen(progress, c.number) && !progress.boardSeen.includes(c.number)).map(c => c.number));
  useEffect(() => {
    if (fresh.length > 0) setProgress(p => ({ ...p, boardSeen: [...new Set([...p.boardSeen, ...fresh])] }));
  }, [fresh, setProgress]);

  const firstTime = progress.completed.length === 0 && !progress.tutorialDone;
  return <div className="board-screen">
    <header className="board-header">
      <button className="wood-btn board-back" onClick={onBack}><ChevronIcon dir="left"/> 마을로</button>
      <h1>마을 게시판</h1>
      <span className="coin"><CoinIcon/><span>{progress.coins}</span></span>
    </header>
    <div className="board-stand">
      <div className="board-roof" aria-hidden="true"/>
      <div className="notice-board wood">
        <button className="continue-note" onClick={() => onPlay(progress.current)}>
          <Pin/>
          <span className="continue-label">{firstTime ? '첫 의뢰 시작하기' : '이어서 하기'}</span>
          <span>{current.id} {current.title}</span>
          <ChevronIcon dir="right"/>
        </button>
        <div className="board-page">
          {PAGES[page].map(part => {
            const chapters = CHAPTERS.filter(c => c.part === part);
            return <section key={part} className="board-part" aria-label={`파트 ${part} ${PART_NAMES[part]}`}>
              <div className="board-notes">
                {chapters.map(chapter => <ChapterNote key={chapter.number} chapter={chapter} progress={progress} fresh={fresh.includes(chapter.number)} tilt={TILT[(chapter.number - 1) % TILT.length]} onOpen={() => setListed(chapter)}/>)}
              </div>
              <div className="board-plaque">파트 {part} · {PART_NAMES[part]}</div>
            </section>;
          })}
        </div>
        <nav className="board-pager" aria-label="게시판 넘기기">
          <button className="wood-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)} aria-label="이전 판"><ChevronIcon dir="left"/></button>
          <span>{page + 1} / {PAGES.length}</span>
          <button className="wood-btn" disabled={page === PAGES.length - 1} onClick={() => setPage(p => p + 1)} aria-label="다음 판"><ChevronIcon dir="right"/></button>
        </nav>
      </div>
      <div className="board-legs" aria-hidden="true"><span/><span/></div>
    </div>
    {listed && <ChapterList chapter={listed} progress={progress} onPlay={onPlay} onClose={() => setListed(null)}/>}
  </div>;
}
