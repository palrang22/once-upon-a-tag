import type { Check, CheckResult } from './types';
import neoFont from '../assets/fonts/neodgm.woff2?url';

/** This function is serialized into the sandbox, where the player's document is the only DOM. */
function previewRuntime() {
  type Condition =
    | { kind: 'exists'; selector: string; label: string }
    | { kind: 'count'; selector: string; min: number; label: string }
    | { kind: 'text'; selector: string; equals: string[]; label: string }
    | { kind: 'filled'; selector: string; label: string }
    | { kind: 'attr'; selector: string; attr: string; equals?: string; label: string }
    | { kind: 'style'; selector: string; prop: string; equals: string; label: string }
    | { kind: 'layout'; selectors: [string, string]; rule: 'sameY' | 'sameX' | 'gapAtLeast'; px?: number; label: string }
    | { kind: 'hasHoverRule'; selector: string; label: string };

  function color(value: string): string {
    const probe = document.createElement('span');
    probe.style.color = value;
    document.body.append(probe);
    const result = getComputedStyle(probe).color;
    probe.remove();
    return result;
  }
  function hoverRule(selector: string): boolean {
    function walk(rules: CSSRuleList): boolean {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule && rule.selectorText.split(',').some(s => s.trim() === `${selector}:hover`)) return true;
        if (rule instanceof CSSGroupingRule && walk(rule.cssRules)) return true;
      }
      return false;
    }
    for (const sheet of document.styleSheets) {
      try { if (walk(sheet.cssRules)) return true; } catch { /* inaccessible external stylesheet */ }
    }
    return false;
  }
  function check(c: Condition): { label: string; pass: boolean; actual?: number } {
    const normalize = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
    try {
      if (c.kind === 'layout') {
        const a = document.querySelector(c.selectors[0])?.getBoundingClientRect();
        const b = document.querySelector(c.selectors[1])?.getBoundingClientRect();
        if (!a || !b) return { label: c.label, pass: false };
        const pass = c.rule === 'sameY' ? Math.abs(a.top - b.top) < 2 : c.rule === 'sameX' ? Math.abs(a.left - b.left) < 2 : b.left - a.right >= (c.px ?? 0) - 1;
        return { label: c.label, pass };
      }
      if (c.kind === 'hasHoverRule') return { label: c.label, pass: hoverRule(c.selector) };
      const nodes = document.querySelectorAll(c.selector);
      if (c.kind === 'count') return { label: c.label, pass: nodes.length >= c.min, actual: nodes.length };
      const node = nodes[0];
      if (!node) return { label: c.label, pass: false };
      if (c.kind === 'exists') return { label: c.label, pass: true };
      if (c.kind === 'text') return { label: c.label, pass: c.equals.every(t => Array.from(nodes).some(n => normalize(n.textContent) === t)) };
      if (c.kind === 'filled') return { label: c.label, pass: normalize(node.textContent) !== '' };
      if (c.kind === 'attr') return { label: c.label, pass: Array.from(nodes).some(n => {
        const value = n.getAttribute(c.attr)?.trim();
        return value !== undefined && (c.equals === undefined ? value !== '' : value === c.equals);
      }) };
      const actual = getComputedStyle(node).getPropertyValue(c.prop).trim();
      const expected = c.prop.includes('color') ? color(c.equals) : c.equals;
      return { label: c.label, pass: actual === expected };
    } catch { return { label: c.label, pass: false }; }
  }
  document.addEventListener('click', event => {
    const anchor = (event.target as Element).closest?.('a');
    if (anchor) event.preventDefault();
  });
  window.addEventListener('message', event => {
    if (event.data?.type !== 'ouat:grade') return;
    const results = (event.data.checks as Condition[]).map(check);
    window.parent.postMessage({ type: 'ouat:result', requestId: event.data.requestId, results }, '*');
  });
  window.addEventListener('DOMContentLoaded', () => window.parent.postMessage({ type: 'ouat:ready' }, '*'));
}

const baseStyle = `@font-face{font-family:NeoDGM;src:url('${neoFont}') format('woff2')}body{margin:0;padding:16px 14px;font-family:NeoDGM,monospace;font-size:16px;line-height:1.75;color:#141414;background:#FFFFFF}h1{font-size:32px;font-weight:400;line-height:1.25;margin:0 0 12px}h2{font-size:16px;font-weight:400;margin:0 0 6px;padding-bottom:2px;border-bottom:2px solid #141414}p{margin:0 0 16px}ul{list-style:square;margin:0 0 16px;padding-left:20px}`;

/** Preview runs on a unique sandbox origin; the parent accepts only messages from its active frame. */
export function makePreview(html: string, css = ''): string {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${baseStyle}</style><style>${css}</style><script>(${previewRuntime.toString()})()</script></head><body>${html}</body></html>`;
}

export interface PreviewMessage { type: 'ouat:ready' | 'ouat:result'; requestId?: number; results?: CheckResult[] }
export interface GradeRequest { type: 'ouat:grade'; requestId: number; checks: Check[] }
