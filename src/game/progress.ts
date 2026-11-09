import { chapterOf } from './chapters';
import type { Commission } from './types';

const modules = import.meta.glob<{ default: Commission }>('../commissions/chapter1/*.ts', { eager: true });
export const commissions = Object.values(modules).map(module => module.default).sort((a, b) => Number(a.id.split('-')[1]) - Number(b.id.split('-')[1]));

export interface Progress {
  current: number;
  coins: number;
  completed: string[];
  drafts: Record<string, string>;
  /** Commissions whose new-syntax note has been read. */
  learned: string[];
  tutorialDone: boolean;
  /** Chapters whose board note has already been pinned (the pin-in animation plays once per chapter). */
  boardSeen: number[];
}

/** A commission opens once the one before it is completed; the current one and earlier ones stay open. */
export const isUnlocked = (progress: Progress, index: number) =>
  index <= progress.current || progress.completed.includes(commissions[index - 1]?.id);

/** Commissions of one chapter with their index in the global `commissions` list. */
export const chapterCommissions = (chapter: number) =>
  commissions.map((commission, index) => ({ commission, index })).filter(({ commission }) => chapterOf(commission.id) === chapter);

/** Chapter 1 is always open; a later chapter opens when every commission of the previous chapter is completed. */
export function isChapterOpen(progress: Progress, chapter: number): boolean {
  if (chapter === 1) return true;
  const previous = chapterCommissions(chapter - 1);
  return previous.length > 0 && previous.every(({ commission }) => progress.completed.includes(commission.id));
}

const key = 'once-upon-a-tag:progress:v1';
export const initialProgress = (): Progress => ({ current: 0, coins: 0, completed: [], drafts: {}, learned: [], tutorialDone: false, boardSeen: [] });
export function loadProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null') as (Partial<Progress> & Pick<Progress, 'current' | 'coins' | 'completed' | 'drafts'>) | null;
    if (saved && Number.isInteger(saved.current) && saved.current >= 0 && saved.current < commissions.length && Number.isFinite(saved.coins) && Array.isArray(saved.completed) && saved.drafts && typeof saved.drafts === 'object') {
      return {
        current: saved.current, coins: saved.coins, completed: saved.completed, drafts: saved.drafts,
        learned: Array.isArray(saved.learned) ? saved.learned : saved.completed,
        tutorialDone: saved.tutorialDone === true || saved.completed.length > 0,
        boardSeen: Array.isArray(saved.boardSeen) ? saved.boardSeen : [],
      };
    }
  } catch { /* corrupted or unavailable storage */ }
  return initialProgress();
}
export function saveProgress(progress: Progress): void {
  try { localStorage.setItem(key, JSON.stringify(progress)); } catch { /* private browsing or storage limit */ }
}
export function clearProgress(): void {
  try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
}
