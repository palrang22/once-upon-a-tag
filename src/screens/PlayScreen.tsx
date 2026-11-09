import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Awning } from '../components/Awning';
import { ChevronIcon } from '../components/ChevronIcon';
import { CodeEditor } from '../components/CodeEditor';
import { CoinIcon } from '../components/CoinIcon';
import { LockIcon } from '../components/LockIcon';
import { NotePaper } from '../components/NotePaper';
import { StagePicker } from '../components/StagePicker';
import { Scene } from '../components/Scene';
import { Villager } from '../components/Villager';
import { CHAPTERS, PART_NAMES, chapterOf } from '../game/chapters';
import { lintHtml, SYNTAX_LABEL } from '../game/htmlLint';
import { commissions, isUnlocked, type Progress } from '../game/progress';
import { makePreview, type PreviewMessage } from '../game/preview';
import { TUTORIAL } from '../game/tutorial';
import type { CheckResult, Commission, FileKind, Note } from '../game/types';
import { VILLAGER_NAMES } from '../game/villagers';

type NoteKind = 'tutorial' | 'learn' | 'review' | 'hint' | 'recap';
interface OpenNote { kind: NoteKind; pages: Note[]; key: number }
const NOTE_LABEL: Record<NoteKind, string> = { tutorial: '처음 오셨나요?', learn: '새 문법 쪽지', review: '다시 보는 쪽지', hint: '힌트 쪽지', recap: '오늘 배운 것' };
const NOTE_DONE: Record<Exclude<NoteKind, 'recap'>, string> = { tutorial: '시작하기', learn: '해볼게요', review: '닫기', hint: '알겠어요' };
const openNote = (kind: NoteKind, pages: Note[]): OpenNote => ({ kind, pages, key: Date.now() });
const firstNote = (progress: Progress, commission: Commission): OpenNote | null =>
  !progress.tutorialDone ? openNote('tutorial', TUTORIAL) : progress.learned.includes(commission.id) ? null : openNote('learn', [commission.learn]);

const EMPTY: CheckResult[] = [];
function CheckIcon({ pass }: { pass: boolean }) { return <svg width="20" height="20" viewBox="0 0 10 10" shapeRendering="crispEdges" aria-hidden="true"><rect width="10" height="10" fill="#141414"/>{pass ? <path d="M2 5h1v1H2zm1 1h1v1H3zm1 1h1v1H4zm1-1h1v1H5zm1-1h1v1H6zm1-1h1v1H7zm1-1h1v1H8z" fill="white"/> : <rect x="1" y="1" width="8" height="8" fill="white"/>}</svg> }

function Phone({ children }: { children: React.ReactNode }) { return <div className="phone-shadow"><div className="px-phone phone-outer"><div className="px-phone phone-inner"><div className="speaker" aria-hidden="true"><span className="dither"/><span/></div>{children}<span className="home-button" aria-hidden="true"/></div></div></div> }
function PreviewFrame({ commission, children }: { commission: Commission; children: React.ReactNode }) {
  if (commission.frame === 'phone') return <Phone>{children}</Phone>;
  if (commission.frame === 'browser') return <div className="browser-frame"><div className="browser-bar"><span className="browser-buttons">▪ ▪ ▪</span> 토끼네 카페 · 브라우저</div>{children}</div>;
  return <div className="card-frame">{children}</div>;
}

function useDialogue(initial: string) {
  const [speech, setSpeech] = useState({ line: initial });
  const [index, setIndex] = useState(0);
  const line = speech.line;
  useEffect(() => {
    const timer = window.setInterval(() => setIndex(i => {
      if (i >= line.length) { window.clearInterval(timer); return i; }
      return i + 1;
    }), 60);
    return () => window.clearInterval(timer);
  }, [speech, line.length]);
  return { line, show: line.slice(0, index), talking: index < line.length, mouthOpen: index < line.length && index % 2 === 1 && line[index - 1] !== ' ',
    say: (next: string) => { setIndex(0); setSpeech({ line: next }); }, finish: () => setIndex(line.length) };
}

interface Props {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
  /** Logo: back to the village board. */
  onHome: () => void;
  /** Asks for confirmation, clears saved progress and returns to the title. */
  onReset: () => void;
}

export function PlayScreen({ progress, setProgress, onHome, onReset }: Props) {
  const commission = commissions[progress.current];
  const [code, setCode] = useState(() => progress.drafts[commission.id] ?? commission.starter.html);
  const [previewCode, setPreviewCode] = useState(code);
  const [frameVersion, setFrameVersion] = useState(0);
  const [results, setResults] = useState<CheckResult[]>(EMPTY);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMockup, setShowMockup] = useState(false);
  const [stagesOpen, setStagesOpen] = useState(false);
  // A commission finished in an earlier visit resumes on its success line, so the dialogue still leads to the recap and the next commission.
  const [lineMode, setLineMode] = useState<'intro' | 'fail' | 'success'>(() => progress.completed.includes(commission.id) ? 'success' : 'intro');
  const [note, setNote] = useState<OpenNote | null>(() => firstNote(progress, commission));
  const [introIndex, setIntroIndex] = useState(0);
  const dialogue = useDialogue(lineMode === 'success' ? commission.lines.success : commission.lines.intro[0]);
  const lintIssues = useMemo(() => lintHtml(previewCode), [previewCode]);
  const [cursor, setCursor] = useState([1, 1]);
  const frame = useRef<HTMLIFrameElement>(null);
  const delivery = useRef(false);
  const requestId = useRef(0);
  const lastSent = useRef(0);
  const currentRef = useRef(commission);
  const progressRef = useRef(progress);
  const dialogueRef = useRef(dialogue.say);
  useEffect(() => {
    currentRef.current = commission;
    progressRef.current = progress;
    dialogueRef.current = dialogue.say;
  });

  useEffect(() => { const timer = window.setTimeout(() => setPreviewCode(code), 280); return () => window.clearTimeout(timer); }, [code]);
  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'ouat:ready') {
        const id = ++requestId.current;
        lastSent.current = id;
        frame.current?.contentWindow?.postMessage({ type: 'ouat:grade', requestId: id, checks: currentRef.current.checks }, '*');
      }
      if (event.data?.type !== 'ouat:result' || event.data.requestId !== lastSent.current || !event.data.results) return;
      const received = event.data.results;
      setResults(received);
      if (!delivery.current) return;
      delivery.current = false;
      const c = currentRef.current;
      const failed = received.find(r => !r.pass);
      if (failed) { setLineMode('fail'); dialogueRef.current(c.lines.fail[failed.label] ?? `아직 ${failed.label} 조건을 확인해 주세요.`); return; }
      setLineMode('success');
      dialogueRef.current(c.lines.success);
      if (!progressRef.current.completed.includes(c.id)) setProgress(p => ({ ...p, coins: p.coins + c.reward, completed: [...p.completed, c.id] }));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [setProgress]);

  const updateCode = (value: string) => {
    setCode(value);
    setProgress(p => ({ ...p, drafts: { ...p.drafts, [commission.id]: value } }));
  };
  const choose = (index: number) => {
    const c = commissions[index];
    if (!c || !isUnlocked(progress, index)) return;
    setProgress(p => ({ ...p, current: index }));
    const nextCode = progress.drafts[c.id] ?? c.starter.html;
    setCode(nextCode); setPreviewCode(nextCode); setFrameVersion(v => v + 1);
    setResults(EMPTY); setIntroIndex(0); setLineMode('intro'); dialogue.say(c.lines.intro[0]); setMenuOpen(false); setShowMockup(false); setStagesOpen(false); delivery.current = false;
    setNote(progress.learned.includes(c.id) ? null : openNote('learn', [c.learn]));
  };
  const deliver = () => {
    const issues = lintHtml(code);
    setPreviewCode(code);
    setFrameVersion(v => v + 1);
    if (issues.length > 0) {
      delivery.current = false;
      setLineMode('fail');
      dialogue.say(`어라! ${issues[0].line}번째 줄에서 ${issues[0].message}`);
      return;
    }
    delivery.current = true;
  };
  const sayIntro = (index: number) => { setIntroIndex(index); setLineMode('intro'); dialogue.say(commission.lines.intro[index]); };
  const introCount = commission.lines.intro.length;
  const advanceDialogue = () => {
    if (dialogue.talking) { dialogue.finish(); return; }
    if (lineMode === 'intro') sayIntro((introIndex + 1) % introCount);
    else if (lineMode === 'fail') sayIntro(introIndex);
    else setNote(openNote('recap', [commission.recap]));
  };
  const closeNote = () => {
    if (!note) return;
    if (note.kind === 'tutorial') {
      setProgress(p => ({ ...p, tutorialDone: true }));
      setNote(progress.learned.includes(commission.id) ? null : openNote('learn', [commission.learn]));
      return;
    }
    if (note.kind === 'learn') setProgress(p => p.learned.includes(commission.id) ? p : { ...p, learned: [...p.learned, commission.id] });
    setNote(null);
    if (note.kind === 'recap' && progress.current + 1 < commissions.length) choose(progress.current + 1);
  };
  const complete = progress.completed.includes(commission.id);
  const syntaxOk = lintIssues.length === 0;
  const passed = (syntaxOk ? 1 : 0) + results.filter(r => r.pass).length;
  const nextAvailable = complete && progress.current + 1 < commissions.length;
  const codeName: Record<FileKind, string> = { html: 'index.html', css: 'style.css', js: 'script.js', ts: 'script.ts' };
  const chapter = CHAPTERS.find(ch => ch.number === chapterOf(commission.id)) ?? CHAPTERS[0];
  const openStages = () => { setMenuOpen(false); setStagesOpen(true); };
  return <div className="app">
    <header className="topbar"><button className="brand brand-button" onClick={onHome} aria-label="마을 게시판으로 가기">&lt;Once Upon a Tag/&gt;</button><div className="top-center"><button className="part-chip part-button" onClick={openStages} aria-label="단계 선택 열기">파트 {chapter.part} · {PART_NAMES[chapter.part]}</button><span>챕터 {chapter.number} · {chapter.title}</span><div className="progress-cells" aria-label={`의뢰 ${commissions.length}개 중 ${progress.completed.length}개 완료, ${progress.current + 1}번째 진행 중`}>{commissions.map((c, i) => <span key={c.id} className={progress.completed.includes(c.id) ? 'done' : i === progress.current ? 'current' : ''}/>)}</div></div><div className="top-right"><div className="coin"><CoinIcon/><span>{progress.coins}</span></div><button className="btn menu-trigger" onClick={() => setMenuOpen(v => !v)} aria-label="메뉴 열기" aria-expanded={menuOpen}><svg width="20" height="20" viewBox="0 0 10 10" shapeRendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M1 2h8v1H1zm0 3h8v1H1zm0 3h8v1H1z"/></svg></button></div></header>
    {menuOpen && <nav className="menu-panel panel" aria-label="의뢰 메뉴"><div className="menu-title">의뢰 목록 <button className="plain-button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)}>×</button></div><button className="menu-item stages-menu" onClick={openStages}>다른 단계 보기</button>{commissions.map((c, i) => <button key={c.id} className="menu-item" disabled={!isUnlocked(progress, i)} onClick={() => choose(i)}><span>{progress.completed.includes(c.id) ? '■' : i === progress.current ? '▨' : '□'} {c.id} {c.title}</span></button>)}<button className="menu-item tutorial-menu" onClick={() => { setMenuOpen(false); setNote(openNote('review', TUTORIAL)); }}>처음 설명 다시 보기</button><button className="menu-item reset-menu" onClick={onReset}>진행도 지우기</button></nav>}
    <Awning/>
    <main className="game-layout">
      <section className="stall" aria-label="의뢰 가판대"><div className="scene-panel panel"><Scene id={commission.scene}/><Villager id={commission.villager} talking={dialogue.talking} mouthOpen={dialogue.mouthOpen}/></div>
        <div className="dialogue panel" onClick={advanceDialogue} role="button" tabIndex={0} onKeyDown={e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); advanceDialogue(); } }} aria-label="대화 계속하기"><span className="nameplate">{VILLAGER_NAMES[commission.villager]}</span><p>{dialogue.show}<span className="sr-only">{dialogue.line.slice(dialogue.show.length)}</span></p>{lineMode === 'intro'
          ? <div className="dialogue-nav"><button aria-label="이전 대사" onClick={e => { e.stopPropagation(); sayIntro((introIndex - 1 + introCount) % introCount); }}><ChevronIcon dir="left"/></button><span>{introIndex + 1} / {introCount}</span><button aria-label="다음 대사" onClick={e => { e.stopPropagation(); if (dialogue.talking) dialogue.finish(); sayIntro((introIndex + 1) % introCount); }}><ChevronIcon dir="right"/></button></div>
          : <svg className="dialogue-cursor" width="12" height="8" viewBox="0 0 6 4" shapeRendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M0 0h6v1H0zm1 1h4v1H1zm1 1h2v1H2z"/></svg>}</div>
        <article className="commission panel"><div className="commission-meta"><span>의뢰 {commission.id}</span><span>보상 {commission.reward}코인</span></div><h1>{commission.title}</h1>{commission.mockup && <button className="btn mockup-button" onClick={() => setShowMockup(true)}>손그림 목업 보기 ↗</button>}<div className="concepts"><span>새 태그</span>{commission.newConcepts.map(concept => <span className="concept" key={concept}>{concept}</span>)}<button className="btn note-button" onClick={() => setNote(openNote('review', [commission.learn]))}>쪽지 다시 보기</button></div><ul className="checklist"><li><CheckIcon pass={syntaxOk}/><span>{SYNTAX_LABEL}{syntaxOk ? '' : ` (${lintIssues[0].line}번째 줄)`}</span></li>{commission.checks.map(c => { const result = results.find(r => r.label === c.label); return <li key={c.label}><CheckIcon pass={!!result?.pass}/><span>{c.label}{result && !result.pass && result.actual !== undefined ? ` (지금 ${result.actual}개)` : ''}</span></li>; })}</ul>{nextAvailable && <button className="btn next-button" onClick={() => choose(progress.current + 1)}>다음 의뢰 →</button>}</article>
      </section>
      <section className="workbench panel" aria-label="코드 작업대"><div className="tabs"><button className="tab active">{codeName.html}</button>{commission.locked.includes('css') && <button className="tab locked" disabled><LockIcon/><span><span className="mono">style.css</span> · 파트 2에서 열려요</span></button>}</div><CodeEditor file="html" value={code} onChange={updateCode} issues={lintIssues} onPosition={(l, col) => setCursor([l, col])}/><div className="statusbar"><span>줄 {cursor[0]}, 칸 {cursor[1]}</span><div className="status-actions"><button className="btn" onClick={() => { if (window.confirm('이 의뢰의 코드를 처음 상태로 돌릴까요?')) updateCode(commission.starter.html); }}>처음부터</button><button className="btn" onClick={() => setNote(openNote('hint', [commission.hint]))}>힌트 보기</button></div></div></section>
      <section className="preview-column" aria-label="미리보기"><div className="preview-heading"><span>미리보기</span><span>고치면 바로 바뀌어요</span></div><PreviewFrame commission={commission}><iframe key={frameVersion} ref={frame} title="작성한 웹페이지 미리보기" sandbox="allow-scripts" srcDoc={makePreview(previewCode, commission.starter.css)} className="preview-iframe"/></PreviewFrame><div className="score"><span>채점 조건</span><span>{passed} / {commission.checks.length + 1} 통과</span></div><button className="deliver" onClick={deliver}>납품하기</button>{complete && !nextAvailable && <p className="final-note">챕터 1 완성! 토끼 카페가 문을 열었어요.</p>}</section>
    </main>
    {showMockup && <div className="modal-backdrop" role="presentation" onClick={() => setShowMockup(false)}><div className="modal panel" role="dialog" aria-modal="true" aria-label="토끼 카페 손그림 목업" onClick={e => e.stopPropagation()}><button className="btn modal-close" onClick={() => setShowMockup(false)}>닫기 ×</button><div className="mockup-svg" role="img" aria-label="토끼 카페 홈페이지의 손그림 목업" dangerouslySetInnerHTML={{ __html: commission.mockup ?? '' }}/></div></div>}
    {note && <NotePaper key={note.key} pages={note.pages} label={NOTE_LABEL[note.kind]} doneLabel={note.kind === 'recap' ? (progress.current + 1 < commissions.length ? '다음 의뢰로' : '닫기') : NOTE_DONE[note.kind]} onClose={closeNote}/>}
    {stagesOpen && <StagePicker progress={progress} onPick={choose} onClose={() => setStagesOpen(false)}/>}
  </div>;
}
