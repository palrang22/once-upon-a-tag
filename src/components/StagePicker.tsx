import { useEffect, useRef } from 'react';
import { CHAPTERS, PART_NAMES, chapterOf, type PartNumber } from '../game/chapters';
import { commissions, isUnlocked, type Progress } from '../game/progress';
import { LockIcon } from './LockIcon';
import './StagePicker.css';

interface Props { progress: Progress; onPick: (index: number) => void; onClose: () => void }

const PARTS = Object.keys(PART_NAMES).map(Number) as PartNumber[];
const commissionsOf = (chapter: number) => commissions.map((c, index) => ({ c, index })).filter(({ c }) => chapterOf(c.id) === chapter);

export function StagePicker({ progress, onPick, onClose }: Props) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const done = (id: string) => progress.completed.includes(id);
  const chapterOpen = (number: number) => {
    if (number === 1) return true;
    const previous = commissionsOf(number - 1);
    return previous.length > 0 && previous.every(({ c }) => done(c.id));
  };

  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <div className="stage-picker panel" role="dialog" aria-modal="true" aria-label="단계 선택" onClick={event => event.stopPropagation()}>
      <div className="stage-head">
        <h2>단계 선택</h2>
        <button ref={close} className="btn" onClick={onClose}>닫기 ×</button>
      </div>
      <p className="stage-sub">이전 단계를 끝내면 다음 단계가 열려요.</p>
      {PARTS.map(part => {
        const chapters = CHAPTERS.filter(chapter => chapter.part === part);
        return <section key={part} className="stage-part">
          <h3><span className="part-chip">파트 {part} · {PART_NAMES[part]}</span></h3>
          {chapters.length === 0 && <p className="stage-locked"><LockIcon/> 준비 중이에요.</p>}
          {chapters.map(chapter => {
            const items = commissionsOf(chapter.number);
            const open = chapterOpen(chapter.number);
            const finished = items.filter(({ c }) => done(c.id)).length;
            return <div key={chapter.number} className={`stage-chapter${open ? '' : ' locked'}`}>
              <div className="stage-chapter-head">
                <span>챕터 {chapter.number} · {chapter.title}</span>
                {open && items.length > 0 && <span className="stage-count">{finished} / {items.length} 완료</span>}
              </div>
              {!open && <p className="stage-locked"><LockIcon/> 챕터 {chapter.number - 1} 완료 후 열려요.</p>}
              {open && items.length === 0 && <p className="stage-locked">준비 중이에요. 아직 만들어지지 않은 챕터예요.</p>}
              {open && items.length > 0 && <div className="stage-grid">
                {items.map(({ c, index }) => {
                  const unlocked = isUnlocked(progress, index);
                  return <button key={c.id} className="stage-item" disabled={!unlocked} aria-current={index === progress.current ? 'step' : undefined} onClick={() => onPick(index)}>
                    <span className="stage-mark" aria-hidden="true">{!unlocked ? <LockIcon/> : done(c.id) ? '■' : index === progress.current ? '▨' : '□'}</span>
                    <span>{c.id} {c.title}</span>
                  </button>;
                })}
              </div>}
            </div>;
          })}
        </section>;
      })}
    </div>
  </div>;
}
