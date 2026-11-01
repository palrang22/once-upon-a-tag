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
}

const key = 'once-upon-a-tag:progress:v1';
export const initialProgress = (): Progress => ({ current: 0, coins: 0, completed: [], drafts: {}, learned: [], tutorialDone: false });
export function loadProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null') as (Partial<Progress> & Pick<Progress, 'current' | 'coins' | 'completed' | 'drafts'>) | null;
    if (saved && Number.isInteger(saved.current) && saved.current >= 0 && saved.current < commissions.length && Number.isFinite(saved.coins) && Array.isArray(saved.completed) && saved.drafts && typeof saved.drafts === 'object') {
      return {
        current: saved.current, coins: saved.coins, completed: saved.completed, drafts: saved.drafts,
        learned: Array.isArray(saved.learned) ? saved.learned : saved.completed,
        tutorialDone: saved.tutorialDone === true || saved.completed.length > 0,
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
