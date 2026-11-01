import { useEffect, useRef, useState } from 'react';
import type { Note } from '../game/types';
import { ChevronIcon } from './ChevronIcon';
import './NotePaper.css';

interface Props { pages: Note[]; label: string; doneLabel: string; onClose: () => void }

export function NotePaper({ pages, label, doneLabel, onClose }: Props) {
  const [page, setPage] = useState(0);
  const primary = useRef<HTMLButtonElement>(null);
  const note = pages[page];
  const last = page === pages.length - 1;
  useEffect(() => { primary.current?.focus(); }, [page]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="note-backdrop" role="presentation" onClick={onClose}>
    <div className="note-sheet" role="dialog" aria-modal="true" aria-label={label} onClick={event => event.stopPropagation()}>
      <span className="note-tape" aria-hidden="true"/>
      <div className="note-paper"><div className="note-inner">
        <div className="note-label">{label}</div>
        <h2 className="note-title">{note.title}</h2>
        {note.body.map(line => <p key={line}>{line}</p>)}
        {note.parts && <dl className="note-parts">{note.parts.map(part => <div key={part.code}><dt><code>{part.code}</code></dt><dd>{part.text}</dd></div>)}</dl>}
        {note.code && <pre className="note-code">{note.code}</pre>}
        <div className="note-footer">
          {pages.length > 1 && <>
            <button className="btn note-nav" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronIcon dir="left"/> 이전</button>
            <span className="note-count">{page + 1} / {pages.length}</span>
          </>}
          {last
            ? <button ref={primary} className="note-done" onClick={onClose}>{doneLabel}</button>
            : <button ref={primary} className="btn note-nav" onClick={() => setPage(p => p + 1)}>다음 <ChevronIcon dir="right"/></button>}
        </div>
      </div></div>
    </div>
  </div>;
}
